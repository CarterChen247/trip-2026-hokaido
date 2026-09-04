// Ported from interests/carter.md, interests/rola.md, interests/shared.md
// When those markdown files change, regenerate this array to match.

export const SOURCES = [
  { key: "shared", label: "共同" },
  { key: "carter", label: "Carter" },
  { key: "rola", label: "Rola" },
];

export const interests = [
  // interests/carter.md — currently empty (header row only)
  // interests/rola.md — currently empty (header row only)

  // interests/shared.md
  { name: "瀧野鈴蘭丘陵公園", source: "shared", category: "活動", note: "雪上泡泡", priority: "想去" },
  { name: "北海道農學校", source: "shared", category: "景點", note: "跟北海道大學是同一天早上的候選（擇一）", priority: "想去" },
  { name: "北海道大學", source: "shared", category: "景點", note: "跟北海道農學校是同一天早上的候選（擇一）", priority: "想去" },
  { name: "小樽", source: "shared", category: "景點", note: "", priority: "想去" },
  { name: "美瑛 青池", source: "shared", category: "景點", note: "", priority: "想去" },
  { name: "美瑛 聖誕樹", source: "shared", category: "景點", note: "", priority: "想去" },
  { name: "精靈露台", source: "shared", category: "景點", note: "", priority: "想去" },
  { name: "雪地摩托車體驗", source: "shared", category: "活動", note: "美瑛/富良野一帶，具體地點還沒定", priority: "想去" },
  { name: "北海道神宮", source: "shared", category: "景點", note: "", priority: "想去" },
  { name: "旭川動物園", source: "shared", category: "景點", note: "可以不去", priority: "有空再去" },
  { name: "滑雪場（待定）", source: "shared", category: "活動", note: "是否要滑雪（雪橇滑梯那種）？還沒確認要不要去、去哪", priority: "待討論" },
  { name: "StellarPlace", source: "shared", category: "購物", note: "札幌車站逛街", priority: "想去" },
  { name: "狸小路 Parco", source: "shared", category: "購物", note: "", priority: "想去" },
  { name: "札幌工廠（Sapporo Factory）", source: "shared", category: "購物", note: "原始資料有 🔥 標記", priority: "想去" },
  { name: "apia lowrys farm", source: "shared", category: "購物", note: "APIA 地下街的服飾店，跟 StellarPlace 同一棟（JR Tower）", priority: "想去" },
];

export const CATEGORIES = [...new Set(interests.map((i) => i.category))];
