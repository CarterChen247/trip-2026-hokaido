---
status: accepted
---

# 前端改用 React + Vite（單一 app，非 monorepo），取代 Preact + htm

Supersedes [[0001-preact-htm-no-build]]。

長期目標（[[0004-poc-before-framework-extraction]]）是把這個做法發展成一個 agent-driven 的框架，參考模型 [open-slide](https://github.com/1weiho/open-slide) 的核心賣點是「agent 只需要專注在內容（React 元件），框架處理其他一切」。這代表這次 POC 不只是要做出一個能用的網站，還要驗證「agent 該用什麼寫法產生內容」——如果 POC 用 htm 寫、未來框架卻是標準 JSX，POC 就沒驗證到真正要的東西，將來還要把授權模式整批重寫一次。

另外，ADR 0001 當時對「build step 會拖慢開發回饋循環」的顧慮，重新評估後不成立：一旦網站有 Firestore 監聽、auth 狀態這類真正的 client state，Vite 的 dev server + HMR（改元件、保留 state、自動更新畫面）體驗優於「手動整頁 refresh」，這也是 open-slide 自己把 hot reload 列為賣點、而非妥協的原因。build 失敗會擋部署是新增的風險，但屬於任何真實 web app 的標準風險，不是本專案特有的問題。

決定改用 React + Vite，維持單一 app（不建立 monorepo/package 邊界，[[0004-poc-before-framework-extraction]] 的立場不變）。這連帶代表：
- `CLAUDE.md` 目前「無 build system」的原則需要在實際導入 Vite 時一併更新
- 部署（Firebase Hosting，[[0002-firebase-shared-state-and-access-control]]）前需要先跑 `npm run build`

## Considered Options

- 維持 Preact + htm（ADR 0001 原決定）——保留零 build 的簡單性，但 POC 驗證到的授權模式跟目標框架不一致，之後要重寫
