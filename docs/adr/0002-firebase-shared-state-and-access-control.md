---
status: superseded
---

# Firebase（Auth + Firestore + Hosting）作為共享狀態與部署平台，用 Google 登入限制存取

> **Superseded by [[0007-local-sync-supersedes-firebase]]**：共享狀態層改用裝置端手動同步（匯出/匯入檔 + 雲端硬碟 + QR），不再用 Firebase。本文保留作為歷史紀錄。
>
> 範圍已由 [[0006-zero-backend-core-optional-sharing-layer]] 收斂：這裡描述的機制仍然是共享狀態層要用的做法，但這一整層現在是**可選加值功能**，不是專案的必要條件。核心的行程表 + checklist 不依賴這裡任何東西。

部分功能（打包清單勾選、行程進度標記、途中共享清單）需要在 Carter 與 Rola 兩人裝置間共享狀態；同時旅遊日期/地點一旦外流有實體安全疑慮（等於公開「這幾天不在家」），所以需要真正的存取控制，不能只靠網址難猜。

選定 Firebase：Firestore 存共享狀態、Firebase Authentication 用 Google 登入限制僅兩組 email 可存取（Firestore 安全規則綁同一組 email）、Firebase Hosting 部署靜態站。三者同一專案、同一 CLI，免費額度對個人專案綽綽有餘，且 SDK 可透過 CDN 直接在瀏覽器使用，不需要伺服器端程式碼，跟 [[0001-preact-htm-no-build]] 的「不上 build」原則一致。

## Considered Options

- Git-based 手動同步（狀態存 localStorage，提供匯出/匯入 JSON）——零基礎設施，但「共享」變成手動動作，容易漏同步
- 接既有的 Notion API 當後端——但 Notion API 的 token 不適合前端直接暴露，需要額外的 proxy 服務
- 純網址保密（不做真正登入，只靠一組亂數 token）——連結一旦外流（截圖、轉傳、跨裝置瀏覽紀錄同步）就完全沒有防護，不足以應對外洩與竄改兩種疑慮，故排除
