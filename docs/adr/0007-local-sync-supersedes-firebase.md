---
status: accepted
---

# 共享狀態層改用裝置端手動同步（匯出/匯入 + 雲端硬碟 + QR），取代 Firebase

> Supersedes [[0002-firebase-shared-state-and-access-control]]、[[0003-markdown-ssot-firestore-overlay]]。範圍仍在 [[0006-zero-backend-core-optional-sharing-layer]] 定義的「核心層零後端、共享層可選」框架內——這裡只是把共享層的實作方式從 Firebase 換成裝置端同步。

重新檢視 [[0002-firebase-shared-state-and-access-control]] 的決定，原本選 Firebase 是因為需要「兩人裝置間共享狀態」+「真正的存取控制」（怕行程日期外流有實體安全疑慮）。但實際上核心層（day board、地圖等，含完整行程日期）本來就設計成不需要登入即可使用（issue #1），所以 Firebase 的登入閘門從未真正保護到「行程外流」這件事，只保護了共享狀態本身（打包進度等）——而這些狀態的敏感度低，不值得為此背負「先在 Firebase console 手動建立專案、開通 Google 登入」這個人工門檻（[[0002-firebase-shared-state-and-access-control]] 提過這是唯一擋住「開箱即用」的步驟，跟 [[0006-zero-backend-core-optional-sharing-layer]] 想要的「別人拿去用不用被迫先設定雲端服務」精神衝突）。

決定改用裝置端手動同步，把「誰能看到/寫入共享狀態」這件事交給同步管道本身既有的機制（AirDrop 對象、雲端硬碟資料夾權限、QR 傳遞對象），App 不再需要自己做任何登入/權限判斷。

## 同步管道（最終三者並存，依此順序開發）

1. **手動匯出/匯入 JSON 檔**：核心，其他管道都是疊加在這之上的傳輸層。使用者手動觸發匯出，用既有管道（AirDrop、LINE 等）傳給對方，對方手動匯入。
2. ~~共用雲端硬碟檔案~~：**已取消，見下方「共用雲端硬碟：確認不做」**。
3. **QR code / 短連結**：把匯出內容編碼後用掃描/連結傳遞，適合面對面核對的情境。

### 共用雲端硬碟：確認不做（issue #10 關閉）

原本設想 App 自動讀寫放在 iCloud/Google Drive 共用資料夾裡的匯出檔，偵測到對方更新就自動觸發合併，不用手動按匯入。實作前查證：這需要 File System Access API（`showDirectoryPicker` 等），而 **Safari（含 iOS）完全不支援**，只有一個綁定 App 的私有沙盒儲存（OPFS），碰不到真正的 iCloud Drive 資料夾；只有 Chrome（桌面、部分 Android）能用，跟這個專案鎖定的「手機瀏覽器 `file://` 使用情境」直接衝突。

同時發現：「把匯出檔存進共用雲端硬碟資料夾」這件事本身**不需要額外開發**——手動匯出/匯入（管道 1）本來就能做到：匯出的檔案可以透過手機系統分享選單存進 iCloud Drive，匯入時的系統檔案選擇器本來就能瀏覽進 iCloud Drive 選檔案。#10 唯一想額外提供的價值（不用手動點匯入、自動偵測資料夾異動）在目標平台上不可行，故直接關閉此票，不做獨立實作。

## 合併規則

- **布林狀態**（打包清單勾選、行程進度標記）：OR 合併——任一邊勾了就算勾了，沒有真正的衝突可能。
- **清單類狀態**（共享清單，如伴手禮）：以時間戳記為主的聯集合併，正確處理新增與刪除的先後順序。
- 匯入預設**自動合併 + diff 預覽**（顯示這次動了什麼，不需互動）。
- 只有偵測到「同一個項目 id 在雙邊都被異動過」（編輯或刪除）才視為真衝突，切到手動逐項核准畫面——不信任裝置本地時間戳記做自動判定，因為兩支手機的時鐘可能沒對準。

## 資料模型

沿用 [[0003-markdown-ssot-firestore-overlay]]「markdown 是靜態內容的唯一 SSOT，互動狀態另外存」的切分，只是互動狀態的落地方式從 Firestore 文件換成本機 JSON（localStorage 常駐 + 匯出檔做同步載體），一樣用穩定的 item id 關聯回 markdown 來源。

## 部署與離線可用性

不再需要 Firebase Hosting，也不部署到任何雲端託管。`npm run build` 產出**單一自包含 `index.html`**（用 `vite-plugin-singlefile` 把 JS/CSS 全部 inline，並將路由從 `BrowserRouter` 換成 `HashRouter`），用 AirDrop/LINE 等既有管道傳進雙方手機，透過手機瀏覽器以 `file://` 開啟，全程離線可用，不依賴任何一方筆電開機或飯店 wifi。

實作前用 Playwright（WebKit + Chromium，分別接近 iOS Safari / Android Chrome 的引擎行為）驗證過技術可行性：

- Vite 預設輸出的多檔案 ES module（`<script type="module" src="...">`）在 `file://` 下會被 CORS 擋掉，完全無法渲染——這是比 localStorage 更根本的坑，兩個引擎都一樣。改用 `vite-plugin-singlefile` inline 成單一檔案後，兩個引擎都能正常渲染、hash routing 也正常。
- localStorage 在 `file://` 下可正常寫入並在同一瀏覽器 session 內持久化（reload 後還在）。
- **已知限制**：`file://` 的 localStorage 是整個瀏覽器共用（不依檔案路徑分隔），如果手機瀏覽器裡開過其他不相關的 `file://` 頁面，理論上會共用同一個 storage——目前用有前綴的 key 名稱降低碰撞風險，之後也不建議在同一支手機瀏覽器開其他 `file://` HTML。
- Playwright 的「全新 context」無法完全模擬「真的關閉手機 App 再打開」，建議正式開發前用實機（AirDrop 一份 build 到手機）再確認一次「關閉 App 重開」的持久性。

## Considered Options

- 維持 Firebase（[[0002-firebase-shared-state-and-access-control]] 原案）——不需要重新設計同步/合併邏輯，但保留了「先在 console 手動設定才能用」的門檻，且登入閘門從未真正防護到行程外流風險，防護的東西敏感度又低，成本效益不划算，故放棄
- 只做「手動匯出/匯入」一種管道，不做雲端硬碟/QR——實作最簡單，但沒有涵蓋原本 Firebase 想解決的「盡量不要手動想起來才同步」的體驗，故仍規劃三種管道並存，只是分票分階段做
- 合併衝突一律自動用時間戳記判定，不做手動核准 UI——省掉一個畫面，但裝置時鐘不可信，可能默默覆蓋掉正確的一邊，故排除
