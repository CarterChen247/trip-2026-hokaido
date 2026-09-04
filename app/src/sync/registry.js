// Registry of shared-state "slices" the local-sync engine (ADR 0007) knows how to
// export/import/merge. Each slice reads/writes one localStorage key.
//
// type: "boolean-set" — an array of item ids that are "on" (e.g. packing checked state).
//       Merge rule: OR (union) — never conflicts.
// type: "timestamped-list" — an array of { id, text, removed, updatedAt } records
//       (e.g. the future shared ad-hoc list, issue #8). Merge rule: union by id;
//       an id edited/removed differently on both sides is a conflict routed to
//       manual resolution — see mergeTimestampedList in merge.js.
import { packingItems } from "../data/packing";
import { days } from "../data/itinerary";

const itineraryItemsById = new Map(
  days.flatMap((day) => Object.values(day.groups).flat()).map((item) => [item.id, item])
);

export const SYNC_SLICES = [
  {
    key: "packing",
    label: "打包清單",
    type: "boolean-set",
    storageKey: "packing-checked-v1",
    getItemLabel: (id) => packingItems.find((item) => item.id === id)?.name ?? id,
  },
  {
    key: "itinerary-done",
    label: "行程完成標記",
    type: "boolean-set",
    storageKey: "itinerary-done-v1",
    getItemLabel: (id) => itineraryItemsById.get(id)?.text ?? id,
  },
  {
    key: "shared-list",
    label: "共享清單",
    type: "timestamped-list",
    storageKey: "shared-list-v1",
  },
];

export function readSliceData(slice) {
  try {
    const raw = localStorage.getItem(slice.storageKey);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeSliceData(slice, data) {
  localStorage.setItem(slice.storageKey, JSON.stringify(data));
}
