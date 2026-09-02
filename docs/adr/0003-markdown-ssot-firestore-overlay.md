---
status: accepted
---

# Markdown 維持靜態內容的唯一 SSOT；互動產生的狀態一律存 Firestore，不寫回 markdown

> 範圍已由 [[0006-zero-backend-core-optional-sharing-layer]] 收斂：這裡描述的是「共享狀態層」啟用時的資料模型。核心層（零後端）的 checklist/行程進度預設存 localStorage，不涉及 Firestore；只有使用者主動開啟共享狀態層時，才會照這份 ADR 的方式用 Firestore 疊加。

新增的互動功能（[[CONTEXT#打包清單-packing-list]]勾選、[[CONTEXT#行程進度-itinerary-progress]]標記、[[CONTEXT#共享清單-shared-list]]、未來的自訂[[CONTEXT#標籤-label]]）都會產生「使用中生成」的狀態。決定這些狀態一律以 Firestore 文件的形式，用穩定的 item id 關聯回 markdown 來源資料，而不是讓網頁寫回 `interests/*.md`、`itinerary/*.md` 等檔案。

Markdown 檔案繼續只承載「規劃階段就定案」的靜態內容（地點、座標、行程本身、清單項目），Claude 依然是唯一的寫入者；Firestore 只承載「執行期才產生」的個人化/共享狀態。這個切分讓 `CLAUDE.md` 既有的「`web/` 是 source 的直接渲染」原則得以延伸到互動層，不需要處理「網頁如何安全地寫回版本控制的檔案」這個更棘手的問題。

## Considered Options

- 讓打包清單/標籤等功能也能編輯 markdown source 並寫回檔案——需要處理 git 寫入、合併衝突、格式驗證，複雜度高，且與現有「Claude 是唯一寫入者」的模式衝突，故排除，留給更長期的規劃（如果真的要做，屆時應該重新開一次 ADR 討論）
