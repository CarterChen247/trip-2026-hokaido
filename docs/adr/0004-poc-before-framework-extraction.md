---
status: accepted
---

# 先把這趟行程當普通 repo 做完（POC），之後真的要抽框架時再重構

長期目標是把這個網站的做法發展成一個給其他人用的框架，參考模型是 [open-slide](https://github.com/1weiho/open-slide)——把通用 runtime（畫布/導覽/present mode）封裝成 package，agent 只需要寫內容，並內建 agent skills 當作標準互動介面。

但現階段只有北海道行程這一個實際案例，還不知道「通用 runtime」跟「trip 專屬內容」的正確邊界在哪裡。決定不現在就套 monorepo 結構（例如 `packages/core` + `apps/hokkaido-trip`），而是先把這個 repo 當成一個普通、獨立的行程網站做完、做好；寫程式碼時保持「盡量把通用邏輯獨立成檔案」的輕量紀律即可，不刻意設計 package 邊界或抽象介面。等這個案例跑順了、甚至有第二個案例出現後，再回頭抽成真正的框架——那時候邊界會比現在猜的準很多。open-slide 自己現在的 `packages/core` 結構，也是等抽象成熟後才長出來的，不是一開始就那樣設計。

## Considered Options

- 現在就上 monorepo 框架結構（一開始就分 `packages/core` + `apps/hokkaido-trip`）——好處是從第一天就逼自己想清楚通用介面；風險是現在只有一個案例，很容易把「北海道行程剛好長這樣」的偶然決定，誤判成「所有 trip 都該長這樣」的通用規則，之後要重構抽象邊界的成本可能比現在直接做 POC 更高
