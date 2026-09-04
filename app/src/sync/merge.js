// Pure merge functions — no localStorage/DOM access, so they're easy to hand-verify.
// Semantics per ADR 0007 (docs/adr/0007-local-sync-supersedes-firebase.md).

// Boolean-set: OR merge. Either side having the id "on" wins. Never conflicts.
export function mergeBooleanSet(localIds, remoteIds) {
  const localSet = new Set(localIds);
  const remoteSet = new Set(remoteIds);
  const merged = new Set([...localSet, ...remoteSet]);
  const added = remoteIds.filter((id) => !localSet.has(id));
  return { merged: [...merged], added, conflicts: [] };
}

// Timestamped-list: union by id. An id present on both sides with identical
// content carries over untouched. An id present on both sides with *different*
// content (edited or removed on one/both sides) is a conflict — device clocks
// aren't trusted to auto-resolve it, so it's surfaced for manual choice instead
// of silently picked by timestamp.
export function mergeTimestampedList(localItems, remoteItems) {
  const localById = new Map(localItems.map((item) => [item.id, item]));
  const remoteById = new Map(remoteItems.map((item) => [item.id, item]));
  const allIds = new Set([...localById.keys(), ...remoteById.keys()]);

  const merged = [];
  const added = [];
  const conflicts = [];

  for (const id of allIds) {
    const local = localById.get(id);
    const remote = remoteById.get(id);

    if (local && !remote) {
      merged.push(local);
    } else if (!local && remote) {
      merged.push(remote);
      added.push(remote);
    } else if (isSameRecord(local, remote)) {
      merged.push(local);
    } else {
      conflicts.push({ id, local, remote });
    }
  }

  merged.sort((a, b) => a.updatedAt - b.updatedAt);
  return { merged, added, conflicts };
}

function isSameRecord(a, b) {
  return a.text === b.text && a.removed === b.removed;
}
