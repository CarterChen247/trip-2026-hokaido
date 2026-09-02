# 行動版網頁

`index.html` 是由 Claude 根據 [../itinerary/outline.md](../itinerary/outline.md)（未來會改用 [../itinerary/detailed.md](../itinerary/detailed.md)）產生的行程看板，手機和電腦瀏覽都要能正常顯示（響應式設計）。

`map.html` 是由 Claude 根據 [../interests/shared.md](../interests/shared.md)（各地點的座標欄）和 [../itinerary/logistics.md](../itinerary/logistics.md)（飯店座標）產生的地點地圖，用 Leaflet + OpenStreetMap。

**請不要手動修改這兩個檔案**——改資料來源（`outline.md` / `detailed.md` / `interests/*.md` 的座標欄），再請 Claude 重新產生，避免資料不同步。
