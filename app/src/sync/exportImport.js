import { SYNC_SLICES, readSliceData, writeSliceData } from "./registry";
import { mergeBooleanSet, mergeTimestampedList } from "./merge";

export const EXPORT_VERSION = 1;

export function buildExportPayload(now = Date.now()) {
  const slices = {};
  for (const slice of SYNC_SLICES) {
    slices[slice.key] = { type: slice.type, data: readSliceData(slice) };
  }
  return { version: EXPORT_VERSION, exportedAt: now, slices };
}

export function isValidExportPayload(payload) {
  return (
    !!payload &&
    payload.version === EXPORT_VERSION &&
    typeof payload.slices === "object" &&
    payload.slices !== null
  );
}

// Returns { [sliceKey]: { merged, added, conflicts } } — see merge.js for shapes.
export function computeMergePlan(localPayload, remotePayload) {
  const plan = {};
  for (const slice of SYNC_SLICES) {
    const localData = localPayload.slices[slice.key]?.data ?? [];
    const remoteData = remotePayload.slices[slice.key]?.data ?? [];
    plan[slice.key] =
      slice.type === "boolean-set"
        ? mergeBooleanSet(localData, remoteData)
        : mergeTimestampedList(localData, remoteData);
  }
  return plan;
}

export function planHasUnresolvedConflicts(plan, resolutions = {}) {
  return SYNC_SLICES.some((slice) => {
    const conflicts = plan[slice.key]?.conflicts ?? [];
    const sliceResolutions = resolutions[slice.key] ?? {};
    return conflicts.some((c) => !sliceResolutions[c.id]);
  });
}

// resolutions: { [sliceKey]: { [conflictId]: "local" | "remote" } }
export function applyMergePlan(plan, resolutions = {}) {
  if (planHasUnresolvedConflicts(plan, resolutions)) {
    throw new Error("Cannot apply merge plan with unresolved conflicts");
  }
  for (const slice of SYNC_SLICES) {
    const result = plan[slice.key];
    if (!result) continue;
    const sliceResolutions = resolutions[slice.key] ?? {};
    const finalData = [...result.merged];
    for (const conflict of result.conflicts) {
      const choice = sliceResolutions[conflict.id];
      finalData.push(choice === "local" ? conflict.local : conflict.remote);
    }
    writeSliceData(slice, finalData);
  }
}
