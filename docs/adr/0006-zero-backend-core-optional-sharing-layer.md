---
status: accepted
---

# 核心永遠零後端；共享狀態是可選加值層，不是必要條件

重新檢視「快速產出行程表 + checklist」這個核心目標，對照 [open-slide](https://github.com/1weiho/open-slide) 完全沒有 auth/backend、純靜態產出 + 匯出的模式，發現 [[0002-firebase-shared-state-and-access-control]] 和 [[0003-markdown-ssot-firestore-overlay]] 原本被當成這個專案的必要基礎設施，會讓「快速產出」這個核心價值，被綁架成必須先設定 Firebase 專案、跑通 Google OAuth 才能開始用——這跟長期想做成框架（[[0004-poc-before-framework-extraction]]）的定位衝突：別人拿去用時，不該被強迫弄一個 Firebase 專案才能看到第一個結果。

決定把系統拆成兩層：

- **核心層（永遠存在，零後端）**：markdown → 行程表 + checklist，純靜態產出，開啟即用、可匯出成自包含 HTML，不需要任何帳號或雲端服務設定。checklist 勾選狀態預設存 localStorage，各自裝置各自記，不跨裝置同步。
- **共享狀態層（可選、opt-in）**：[[0002-firebase-shared-state-and-access-control]] 與 [[0003-markdown-ssot-firestore-overlay]] 描述的 Firebase Auth + Firestore 機制內容不變，但降級為使用者主動開啟的加值功能，不是專案的必要條件。

這趟北海道行程實際需求（兩人共享打包進度/行程進度）沒有變，所以最終還是會開啟共享層——但實作順序上，**核心層先獨立做完、可用，共享層是疊加上去的第二階段**，不是同一批必須綁在一起交付的東西。這也符合 CLAUDE.md 慣例的分段推進節奏：核心層完成即可先提交一次。

## Considered Options

- 維持共享狀態為必要基礎設施（原 0002/0003 的預設）——對這趟行程本身沒差，反正最終都會設定；但會讓框架的「第一次使用體驗」變重，且把「產生內容」跟「後端基礎設施」兩件本質不同的事綁死在一起，不利於之後抽框架時把兩者拆開
