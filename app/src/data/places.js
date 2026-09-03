// Ported from web/map.html — source: interests/shared.md 座標欄 + itinerary/logistics.md 飯店座標
// When those markdown files change, regenerate this array to match.

export const CAT_COLORS_LIGHT = {
  景點: "#eda100",
  活動: "#008300",
  購物: "#1baf7a",
  住宿: "#e87ba4",
};

export const CAT_COLORS_DARK = {
  景點: "#c98500",
  活動: "#008300",
  購物: "#199e70",
  住宿: "#d55181",
};

export const places = [
  { name: "瀧野鈴蘭丘陵公園", cat: "活動", note: "雪上泡泡", priority: "想去", lat: 42.91572, lng: 141.38268 },
  { name: "北海道農學校", cat: "景點", note: "跟北海道大學是同一天早上的候選（擇一）", priority: "想去", lat: 43.08204, lng: 141.33999 },
  { name: "北海道大學", cat: "景點", note: "跟北海道農學校是同一天早上的候選（擇一）", priority: "想去", lat: 43.07796, lng: 141.34001 },
  { name: "小樽（運河）", cat: "景點", note: "", priority: "想去", lat: 43.19886, lng: 141.0021 },
  { name: "美瑛 青池", cat: "景點", note: "", priority: "想去", lat: 43.49358, lng: 142.61403 },
  { name: "美瑛 聖誕樹", cat: "景點", note: "クリスマスツリーの木", priority: "想去", lat: 43.55437, lng: 142.44427 },
  { name: "精靈露台（ニングルテラス）", cat: "景點", note: "富良野", priority: "想去", lat: 43.32284, lng: 142.35589 },
  { name: "北海道神宮", cat: "景點", note: "", priority: "想去", lat: 43.05424, lng: 141.30771 },
  { name: "旭川動物園", cat: "景點", note: "可以不去", priority: "有空再去", lat: 43.76805, lng: 142.47978 },
  { name: "StellarPlace", cat: "購物", note: "札幌車站逛街", priority: "想去", lat: 43.06813, lng: 141.35253 },
  { name: "狸小路 Parco", cat: "購物", note: "", priority: "想去", lat: 43.05869, lng: 141.35319 },
  { name: "札幌工廠（Sapporo Factory）", cat: "購物", note: "🔥 標記", priority: "想去", lat: 43.06556, lng: 141.36306 },
  { name: "apia lowrys farm", cat: "購物", note: "APIA 地下街，跟 StellarPlace 同一棟", priority: "想去", lat: 43.06813, lng: 141.35253 },
  { name: "Sapporo Stream Hotel", cat: "住宿", note: "全程住宿，12/17–12/24", priority: "必去", lat: 43.0555, lng: 141.354 },
];
