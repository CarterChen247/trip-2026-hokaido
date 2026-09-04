// Ported from itinerary/packing.md
// When that markdown file changes, regenerate this to match.
// `id` is stable and used as the localStorage key for checked state — don't reuse an id for a different item.

export const CATEGORIES = ["證件", "保暖衣物", "電子", "盥洗藥品", "其他"];

export const packingItems = [
  { id: "passport", name: "護照", category: "證件", note: "確認效期 6 個月以上" },
  { id: "e-ticket", name: "電子機票 / 訂房確認信", category: "證件", note: "" },
  { id: "insurance", name: "海外旅平險保單", category: "證件", note: "" },
  { id: "cash-jpy", name: "日幣現金", category: "證件", note: "" },
  { id: "credit-card", name: "信用卡", category: "證件", note: "" },
  { id: "down-jacket", name: "羽絨外套", category: "保暖衣物", note: "" },
  { id: "thermal-wear", name: "發熱衣", category: "保暖衣物", note: "" },
  { id: "beanie", name: "毛帽", category: "保暖衣物", note: "" },
  { id: "gloves", name: "手套", category: "保暖衣物", note: "建議防水" },
  { id: "scarf", name: "圍巾", category: "保暖衣物", note: "" },
  { id: "snow-boots", name: "防滑雪靴", category: "保暖衣物", note: "" },
  { id: "thick-socks", name: "厚襪子", category: "保暖衣物", note: "" },
  { id: "hand-warmers", name: "暖暖包", category: "保暖衣物", note: "" },
  { id: "charging-cable", name: "手機充電線", category: "電子", note: "" },
  { id: "power-bank", name: "行動電源", category: "電子", note: "" },
  { id: "adapter", name: "轉接頭", category: "電子", note: "台灣轉日本" },
  { id: "camera", name: "相機", category: "電子", note: "" },
  { id: "medicine", name: "個人藥品", category: "盥洗藥品", note: "" },
  { id: "lip-balm", name: "護唇膏", category: "盥洗藥品", note: "北海道冬天很乾" },
  { id: "lotion", name: "乳液", category: "盥洗藥品", note: "" },
  { id: "backpack", name: "後背包", category: "其他", note: "" },
  { id: "umbrella", name: "折疊傘", category: "其他", note: "" },
];
