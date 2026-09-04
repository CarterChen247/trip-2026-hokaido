import { useRef, useState } from "react";
import Nav from "../components/Nav";
import { SYNC_SLICES } from "../sync/registry";
import {
  buildExportPayload,
  isValidExportPayload,
  computeMergePlan,
  planHasUnresolvedConflicts,
  applyMergePlan,
} from "../sync/exportImport";
import "./SyncPage.css";

function formatForFilename(ts) {
  const d = new Date(ts);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}`;
}

export default function SyncPage() {
  const [stage, setStage] = useState("idle"); // idle | previewing | applied | error
  const [mergePlan, setMergePlan] = useState(null);
  const [resolutions, setResolutions] = useState({});
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef(null);

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
      if (!isValidExportPayload(remotePayload)) {
        setStage("error");
        setErrorMsg("這個檔案不是有效的同步匯出檔（版本不符或格式錯誤）。");
        return;
      }
      const localPayload = buildExportPayload();
      const plan = computeMergePlan(localPayload, remotePayload);
      setMergePlan(plan);
      setResolutions({});
      setStage("previewing");
    };
    reader.readAsText(file);
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
                        const label = slice.getItemLabel ? slice.getItemLabel(id) : id;
                        return <li key={id}>{label}</li>;
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
                            <p className="conflict-id">{conflict.id}</p>
                            <label>
                              <input
                                type="radio"
                                name={`conflict-${slice.key}-${conflict.id}`}
                                checked={choice === "local"}
                                onChange={() => setResolution(slice.key, conflict.id, "local")}
                              />
                              採用我的版本
                            </label>
                            <label>
                              <input
                                type="radio"
                                name={`conflict-${slice.key}-${conflict.id}`}
                                checked={choice === "remote"}
                                onChange={() => setResolution(slice.key, conflict.id, "remote")}
                              />
                              採用對方的版本
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
