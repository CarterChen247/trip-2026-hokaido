---
status: superseded by ADR-0005
---

# 前端不上 build，用 Preact + htm（CDN 引入）

網站要新增打包清單、興趣清單篩選、行程進度標記等互動功能後，純手寫 DOM 操作會越來越難維護。決定改用 Preact + htm 透過 CDN script 引入，取得元件化與宣告式渲染的好處，同時不引入 npm/build step，保持「改檔案存檔、瀏覽器重新整理即可看到結果」的開發回饋循環——這對於這個由 Claude Code 反覆直接編輯檔案來維護的專案特別重要。若未來互動複雜度真的超出這個範圍，Preact 的 API 與 React 幾乎相容，遷移到完整 React + Vite 的成本很低。

## Considered Options

- 維持 vanilla JS，把共用邏輯抽成 shared.js/shared.css——不需要框架，但清單渲染/資料綁定的手寫成本會隨功能增加而變高
- Alpine.js——寫法貼近現有靜態 HTML、學習曲線低，但「清單資料綁定 Firestore + 動態增減項目」這種場景語法較繞
- 完整 React + Vite——元件生態系最完整，最像正規產品開發方式，但需要 npm install + build step，會打斷目前「Claude 直接改檔案立即生效」的工作模式
