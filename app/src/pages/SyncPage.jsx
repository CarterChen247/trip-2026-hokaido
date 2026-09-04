import { useRef, useState } from "react";
import QRCode from "qrcode";
import jsQR from "jsqr";
import Nav from "../components/Nav";
import { SYNC_SLICES } from "../sync/registry";
import {
  buildExportPayload,
  isValidExportPayload,
  computeMergePlan,
  planHasUnresolvedConflicts,
  applyMergePlan,
} from "../sync/exportImport";
import { encodeSlicePayload, decodeSlicePayload, QrPayloadTooLargeError } from "../sync/qrPayload";
import "./SyncPage.css";

function formatForFilename(ts) {
  const d = new Date(ts);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}`;
}

// `item` is a bare id string for boolean-set slices, or a full { id, text, removed }
// record for timestamped-list slices (which carry their own label, no registry lookup needed).
function getAddedLabel(slice, item) {
  if (typeof item === "string") {
    return slice.getItemLabel ? slice.getItemLabel(item) : item;
  }
  return item.text ?? item.id;
}

function describeConflictSide(record) {
  if (!record) return "（這邊沒有這個項目）";
  return `${record.text}（${record.removed ? "已標記完成" : "尚未完成"}）`;
}

export default function SyncPage() {
  const [stage, setStage] = useState("idle"); // idle | previewing | applied | error
  const [mergePlan, setMergePlan] = useState(null);
  const [resolutions, setResolutions] = useState({});
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef(null);

  const [qrSliceKey, setQrSliceKey] = useState(SYNC_SLICES[0].key);
  const [qrResult, setQrResult] = useState(null); // { text, dataUrl } | null
  const [qrError, setQrError] = useState("");
  const [scanning, setScanning] = useState(false);
  const [pasteText, setPasteText] = useState("");
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const rafRef = useRef(null);

  // Shared by file import, QR scan, and paste-text — the only thing that
  // differs between those three input channels is how remotePayload is obtained.
  function applyRemotePayload(remotePayload) {
    if (!isValidExportPayload(remotePayload)) {
      setStage("error");
      setErrorMsg("這不是有效的同步資料（版本不符或格式錯誤）。");
      return;
    }
    const localPayload = buildExportPayload();
    const plan = computeMergePlan(localPayload, remotePayload);
    setMergePlan(plan);
    setResolutions({});
    setStage("previewing");
  }

  function handleExport() {
    const payload = buildExportPayload();
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `hokkaido-sync-${formatForFilename(payload.exportedAt)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleFileSelected(e) {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file next time
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      let remotePayload;
      try {
        remotePayload = JSON.parse(reader.result);
      } catch {
        setStage("error");
        setErrorMsg("這個檔案不是有效的 JSON。");
        return;
      }
      applyRemotePayload(remotePayload);
    };
    reader.readAsText(file);
  }

  async function handleGenerateQr() {
    setQrError("");
    setQrResult(null);
    try {
      const { text } = await encodeSlicePayload(qrSliceKey);
      const dataUrl = await QRCode.toDataURL(text, { margin: 1, width: 260 });
      setQrResult({ text, dataUrl });
    } catch (err) {
      setQrError(err instanceof QrPayloadTooLargeError ? err.message : "產生 QR code 失敗。");
    }
  }

  function stopScanning() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setScanning(false);
  }

  async function startScanning() {
    setQrError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      setScanning(true);

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const tick = () => {
        const video = videoRef.current;
        if (!video || video.readyState !== video.HAVE_ENOUGH_DATA) {
          rafRef.current = requestAnimationFrame(tick);
          return;
        }
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code) {
          handleScannedText(code.data);
          return;
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    } catch {
      setQrError("無法開啟相機（可能是權限被拒絕，或這台裝置不支援）。可以改用下面的貼上文字。");
    }
  }

  async function handleScannedText(text) {
    stopScanning();
    try {
      const remotePayload = await decodeSlicePayload(text);
      applyRemotePayload(remotePayload);
    } catch {
      setStage("error");
      setErrorMsg("掃描到的內容不是有效的同步資料。");
    }
  }

  async function handlePasteSubmit() {
    try {
      const remotePayload = await decodeSlicePayload(pasteText.trim());
      setPasteText("");
      applyRemotePayload(remotePayload);
    } catch {
      setStage("error");
      setErrorMsg("貼上的內容不是有效的同步資料。");
    }
  }

  function setResolution(sliceKey, conflictId, choice) {
    setResolutions((prev) => ({
      ...prev,
      [sliceKey]: { ...prev[sliceKey], [conflictId]: choice },
    }));
  }

  function handleApply() {
    applyMergePlan(mergePlan, resolutions);
    setStage("applied");
  }

  function reset() {
    setStage("idle");
    setMergePlan(null);
    setResolutions({});
    setErrorMsg("");
  }

  const hasAnyChange =
    mergePlan && SYNC_SLICES.some((slice) => (mergePlan[slice.key]?.added.length ?? 0) > 0);
  const hasAnyConflict = mergePlan && planHasUnresolvedConflicts(mergePlan, {});
  const blocked = mergePlan && planHasUnresolvedConflicts(mergePlan, resolutions);

  return (
    <div className="sync-wrap">
      <Nav />
      <header className="hero">
        <span className="eyebrow">草稿版・裝置端手動同步（不經過任何雲端服務）</span>
        <h1>同步</h1>
        <p className="sub">
          匯出這台裝置的打包進度等狀態給對方，或匯入對方傳來的檔案來合併進度。
        </p>
      </header>

      <section className="sync-section">
        <h2>匯出</h2>
        <p className="sync-hint">產生一個 JSON 檔，用 AirDrop / LINE 等方式傳給對方。</p>
        <button className="sync-btn" onClick={handleExport}>
          匯出目前狀態
        </button>
      </section>

      <section className="sync-section">
        <h2>匯入</h2>
        <p className="sync-hint">選擇對方傳來的 JSON 檔，合併進這台裝置的狀態。</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          onChange={handleFileSelected}
          hidden
        />
        <button className="sync-btn" onClick={() => fileInputRef.current?.click()}>
          選擇檔案來匯入
        </button>
      </section>

      <section className="sync-section">
        <h2>面對面同步（QR / 貼上文字）</h2>
        <p className="sync-hint">
          兩人在一起的時候，可以用 QR code 或直接貼上一段文字同步單一項目（例如只同步打包清單），不用傳檔案。
        </p>

        <div className="qr-generate">
          <select value={qrSliceKey} onChange={(e) => setQrSliceKey(e.target.value)}>
            {SYNC_SLICES.map((slice) => (
              <option key={slice.key} value={slice.key}>
                {slice.label}
              </option>
            ))}
          </select>
          <button className="sync-btn secondary" onClick={handleGenerateQr}>
            產生 QR
          </button>
        </div>

        {qrError && <p className="sync-hint qr-error">{qrError}</p>}

        {qrResult && (
          <div className="qr-result">
            <img src={qrResult.dataUrl} alt="同步 QR code" width={260} height={260} />
            <textarea readOnly value={qrResult.text} rows={3} />
            <button
              className="sync-btn secondary"
              onClick={() => navigator.clipboard.writeText(qrResult.text)}
            >
              複製文字
            </button>
          </div>
        )}

        <div className="qr-scan">
          {!scanning ? (
            <button className="sync-btn secondary" onClick={startScanning}>
              開始掃描對方的 QR
            </button>
          ) : (
            <button className="sync-btn secondary" onClick={stopScanning}>
              停止掃描
            </button>
          )}
          <video ref={videoRef} className={scanning ? "qr-video" : "qr-video hidden"} muted playsInline />
        </div>

        <div className="qr-paste">
          <textarea
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            placeholder="或者把對方傳來的文字貼在這裡"
            rows={3}
          />
          <button className="sync-btn secondary" onClick={handlePasteSubmit} disabled={!pasteText.trim()}>
            解析
          </button>
        </div>
      </section>

      {stage === "error" && (
        <section className="sync-section sync-error">
          <p>{errorMsg}</p>
          <button className="sync-btn secondary" onClick={reset}>
            重新開始
          </button>
        </section>
      )}

      {stage === "previewing" && mergePlan && (
        <section className="sync-section sync-preview">
          <h2>這次匯入的變更</h2>
          {!hasAnyChange && !hasAnyConflict && <p className="sync-hint">沒有新的變更。</p>}

          {SYNC_SLICES.map((slice) => {
            const result = mergePlan[slice.key];
            if (!result) return null;
            return (
              <div className="sync-diff-block" key={slice.key}>
                {result.added.length > 0 && (
                  <>
                    <h3>{slice.label}・新增 {result.added.length} 項</h3>
                    <ul className="sync-diff-list">
                      {result.added.map((item) => {
                        const id = typeof item === "string" ? item : item.id;
                        return <li key={id}>{getAddedLabel(slice, item)}</li>;
                      })}
                    </ul>
                  </>
                )}

                {result.conflicts.length > 0 && (
                  <>
                    <h3 className="conflict-heading">
                      {slice.label}・{result.conflicts.length} 項有衝突，需要你手動選擇
                    </h3>
                    <ul className="sync-conflict-list">
                      {result.conflicts.map((conflict) => {
                        const choice = resolutions[slice.key]?.[conflict.id];
                        return (
                          <li key={conflict.id} className="sync-conflict-item">
                            <label>
                              <input
                                type="radio"
                                name={`conflict-${slice.key}-${conflict.id}`}
                                checked={choice === "local"}
                                onChange={() => setResolution(slice.key, conflict.id, "local")}
                              />
                              採用我的版本：{describeConflictSide(conflict.local)}
                            </label>
                            <label>
                              <input
                                type="radio"
                                name={`conflict-${slice.key}-${conflict.id}`}
                                checked={choice === "remote"}
                                onChange={() => setResolution(slice.key, conflict.id, "remote")}
                              />
                              採用對方的版本：{describeConflictSide(conflict.remote)}
                            </label>
                          </li>
                        );
                      })}
                    </ul>
                  </>
                )}
              </div>
            );
          })}

          <div className="sync-actions">
            <button className="sync-btn" onClick={handleApply} disabled={blocked}>
              套用變更
            </button>
            <button className="sync-btn secondary" onClick={reset}>
              取消
            </button>
          </div>
          {blocked && <p className="sync-hint">請先解決上面所有衝突項目，才能套用。</p>}
        </section>
      )}

      {stage === "applied" && (
        <section className="sync-section sync-applied">
          <p>已套用變更。切換到其他頁面（例如打包清單）查看最新狀態。</p>
          <button className="sync-btn secondary" onClick={reset}>
            完成
          </button>
        </section>
      )}
    </div>
  );
}
