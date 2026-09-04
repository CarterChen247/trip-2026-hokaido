// Per-slice payload encoding for the QR / paste-text sync channel (#11).
// Reuses the same payload shape as file export/import (exportImport.js) so the
// decoded result can go straight into computeMergePlan/applyMergePlan — only
// scoped to ONE slice at a time, to keep the encoded string small enough for
// a reliably-scannable QR code.
import { SYNC_SLICES, readSliceData } from "./registry";
import { EXPORT_VERSION } from "./exportImport";

// Practical reliable-scan ceiling for a screen-displayed (not printed) QR code —
// well under the format's theoretical max, chosen so the QR stays scannable at
// typical phone-screen size/distance.
export const MAX_QR_PAYLOAD_CHARS = 2000;

export class QrPayloadTooLargeError extends Error {}

async function gzipCompress(text) {
  if (typeof CompressionStream === "undefined") return null;
  const stream = new Blob([text]).stream().pipeThrough(new CompressionStream("gzip"));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

async function gzipDecompress(bytes) {
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("gzip"));
  return new TextDecoder().decode(await new Response(stream).arrayBuffer());
}

function bytesToBase64Url(bytes) {
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlToBytes(str) {
  const b64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
  return Uint8Array.from(atob(padded), (c) => c.charCodeAt(0));
}

function buildSlicePayload(sliceKey, now) {
  const slice = SYNC_SLICES.find((s) => s.key === sliceKey);
  if (!slice) throw new Error(`Unknown slice: ${sliceKey}`);
  return {
    version: EXPORT_VERSION,
    exportedAt: now,
    slices: { [sliceKey]: { type: slice.type, data: readSliceData(slice) } },
  };
}

// Returns { text, usedCompression }. Throws QrPayloadTooLargeError if the
// encoded string is too long to reliably display/scan as a QR code — the
// caller should fall back to file export/import for that slice instead.
export async function encodeSlicePayload(sliceKey, now = Date.now()) {
  const json = JSON.stringify(buildSlicePayload(sliceKey, now));
  const compressed = await gzipCompress(json);
  const usedCompression = compressed !== null;
  const bytes = usedCompression ? compressed : new TextEncoder().encode(json);
  const text = (usedCompression ? "1:" : "0:") + bytesToBase64Url(bytes);

  if (text.length > MAX_QR_PAYLOAD_CHARS) {
    throw new QrPayloadTooLargeError(
      `編碼後長度 ${text.length} 字元，超過建議上限 ${MAX_QR_PAYLOAD_CHARS}，這個項目的資料量對 QR code 來說太大，請改用「同步」頁面的檔案匯出/匯入。`
    );
  }
  return { text, usedCompression };
}

// Reverses encodeSlicePayload — returns a payload object shaped like a full
// export (single slice populated), usable directly with computeMergePlan.
export async function decodeSlicePayload(text) {
  const flag = text.slice(0, 2);
  const bytes = base64UrlToBytes(text.slice(2));
  const json = flag === "1:" ? await gzipDecompress(bytes) : new TextDecoder().decode(bytes);
  return JSON.parse(json);
}
