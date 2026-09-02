# Trip 2026 Hokkaido

規劃 Carter 和 Rola 2026 年 12 月北海道行程的網站專案。目前是單一行程的具體實作（POC），資料本身仍以 markdown 為主，網站是疊加在其上的互動層。

## Language

**興趣清單 (Interest List)**:
`interests/carter.md`、`interests/rola.md`、`interests/shared.md` 裡個人或雙方共同想去的地點清單，每筆帶座標（座標欄）。唯讀資料，v1 只能篩選不能編輯。
_Avoid_: wishlist, bucket list

**打包清單 (Packing List)**:
出發前要準備的物品清單。清單「項目」是 markdown SSOT（例如 `itinerary/packing.md`），但「勾選狀態」是執行期產生的資料，存在 Firestore、兩人共享但不即時同步。
_Avoid_: checklist（太泛用，這個詞在本專案專指打包用途的清單）

**行程進度 (Itinerary Progress)**:
標記 `itinerary/detailed.md` 裡某個行程項目「已完成/已去過」的狀態。附著在行程項目上，不改變行程內容本身，狀態存在 Firestore、兩人共享。
_Avoid_: progress tracker, status

**共享清單 (Shared List)**:
旅途中臨時產生、不對應任何 markdown 來源的清單（例如伴手禮採買清單）。項目本身也是執行期新增的，完全存在 Firestore，沒有 markdown SSOT。跟「打包清單」的差別在於：打包清單的項目是規劃期定案的（markdown SSOT + Firestore 疊加狀態），共享清單的項目本身就是動態的（純 Firestore）。
_Avoid_: dynamic list

**標籤 (Label)**:
興趣清單/物流資訊卡上用來篩選的分類標記。v1 是 markdown 資料的一部分、唯讀；未來可能開放使用者自訂與編輯（屆時會疊加一份獨立的 Firestore collection，不寫回 markdown）。
_Avoid_: tag, category
