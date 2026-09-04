// Ported from web/index.html — source: itinerary/outline.md (draft stage, no detailed.md content yet)
// When outline.md (or later detailed.md) changes, regenerate this to match.

export const trip = {
  name: "北海道",
  dateRange: "2026/12/17 – 12/24",
  flights: [
    { label: "去程 12/17 (四)", value: "TPE 09:30 → CTS 14:05" },
    { label: "回程 12/24 (四)", value: "CTS 15:20 → TPE 19:05" },
  ],
  hotel: [
    { label: "Sapporo Stream Hotel", value: "全程（札幌）" },
    { label: "Check-in / out", value: "12/17 15:00 – 12/24 11:00" },
  ],
};

export const CATEGORIES = [
  { key: "transport", label: "交通" },
  { key: "food", label: "美食" },
  { key: "shopping", label: "購物" },
  { key: "sight", label: "景點" },
  { key: "lodging", label: "住宿" },
  { key: "activity", label: "活動" },
];

export const SLOTS = ["早", "午", "晚", "TBD"];

export const days = [
  {
    num: "D1",
    date: "12/17 四",
    theme: "薄野",
    groups: {
      早: [
        { cat: "transport", text: "🚌 台灣時間 6:00 前往機場" },
        { cat: "transport", text: "🛫 搭機", sub: "TPE 09:30 → CTS 14:05" },
      ],
      午: [{ cat: "lodging", text: "🏨 抵達後前往飯店", sub: "15:00 後 check-in" }],
      晚: [
        { cat: "shopping", text: "🧢 狸小路商店街補裝備" },
        { cat: "food", text: "🍽️ 貍小路吃飯" },
      ],
      TBD: [{ cat: "shopping", text: "🛍️ 逛街候補", sub: "StellarPlace、狸小路 Parco、札幌工廠" }],
    },
  },
  {
    num: "D2",
    date: "12/18 五",
    theme: "札幌逛街",
    groups: {
      早: [{ cat: "sight", text: "🏫 北海道大學／北海道農學校", sub: "擇一，待選" }],
      午: [
        { cat: "shopping", text: "🛍️ Stellaplace 逛街" },
        { cat: "shopping", text: "🛍️ apia lowrys farm" },
      ],
      晚: [{ cat: "shopping", text: "🏮 貍小路商店街" }],
      TBD: [],
    },
  },
  {
    num: "D3",
    date: "12/19 六",
    theme: "小樽",
    groups: {
      早: [],
      午: [{ cat: "sight", text: "🚋 小樽", sub: "細節待排" }],
      晚: [],
      TBD: [],
    },
  },
  {
    num: "D4",
    date: "12/20 日",
    theme: "北海道神宮",
    groups: {
      早: [{ cat: "sight", text: "🌳 大通公園" }],
      午: [{ cat: "sight", text: "⛩️ 北海道神宮", sub: "1–2 hr" }],
      晚: [{ cat: null, text: "❓ 待定" }],
      TBD: [],
    },
  },
  {
    num: "D5",
    date: "12/21 一",
    theme: "旭川・美瑛",
    groups: { 早: [], 午: [], 晚: [], TBD: [] },
  },
  {
    num: "D6",
    date: "12/22 二",
    theme: "札幌",
    groups: { 早: [], 午: [], 晚: [], TBD: [] },
  },
  {
    num: "D7",
    date: "12/23 三",
    theme: "札幌",
    groups: { 早: [], 午: [], 晚: [], TBD: [] },
  },
  {
    num: "D8",
    date: "12/24 四",
    theme: "回程",
    groups: {
      早: [],
      午: [{ cat: "lodging", text: "🧳 Check-out", sub: "11:00" }],
      晚: [{ cat: "transport", text: "🛫 搭機回程", sub: "CTS 15:20 → TPE 19:05" }],
      TBD: [],
    },
  },
];
