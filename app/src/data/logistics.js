// Ported from itinerary/logistics.md
// When that markdown file changes, regenerate this to match.

export const dates = { depart: "2026/12/17", return: "2026/12/24" };

export const flights = [
  {
    segment: "桃園(TPE T2) → 新千歲(CTS T1)",
    date: "2026/12/17",
    flightNo: "TBD",
    depart: "09:30",
    arrive: "14:05",
    note: "去程",
  },
  {
    segment: "新千歲(CTS T1) → 桃園(TPE T2)",
    date: "2026/12/24",
    flightNo: "TBD",
    depart: "15:20",
    arrive: "19:05",
    note: "回程",
  },
];

export const lodging = [
  {
    day: "1-7",
    date: "2026/12/17 - 12/24",
    place: "SAPPORO STREAM HOTEL",
    area: "札幌",
    bookingStatus: "TBD",
    coord: "43.0555, 141.354（地址級近似值，非精確門牌）",
    note: "Check-in 12/17 15:00，Check-out 12/24 11:00（全程都住這）",
  },
];

export const localTransport = ["TBD（例如：JR Pass、租車、巴士）"];

export const other = [
  { label: "網路 / SIM卡", value: "TBD" },
  { label: "保險", value: "TBD" },
  { label: "預算", value: "TBD" },
];
