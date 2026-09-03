import { useEffect, useRef, useState } from "react";
import Nav from "../components/Nav";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { places, CAT_COLORS_LIGHT, CAT_COLORS_DARK } from "../data/places";
import "./MapPage.css";

const LEGEND_CATEGORIES = ["景點", "活動", "購物", "住宿"];

function useCatColors() {
  const [dark, setDark] = useState(
    () => window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false
  );

  useEffect(() => {
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e) => setDark(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return dark ? CAT_COLORS_DARK : CAT_COLORS_LIGHT;
}

export default function MapPage() {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [selected, setSelected] = useState(null);
  const catColors = useCatColors();

  useEffect(() => {
    const map = L.map(mapContainerRef.current, { scrollWheelZoom: true });
    mapRef.current = map;
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    const markers = places.map((p) => {
      const color = catColors[p.cat] || "#888888";
      const marker = L.circleMarker([p.lat, p.lng], {
        radius: p.cat === "住宿" ? 9 : 7,
        color,
        fillColor: color,
        fillOpacity: 0.85,
        weight: 2,
      }).addTo(map);
      marker.on("click", () => setSelected(p));
      return marker;
    });

    const group = L.featureGroup(markers);
    map.fitBounds(group.getBounds().pad(0.15));

    return () => map.remove();
    // catColors intentionally excluded: markers are re-colored via re-render, not by re-running this effect
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedColor = selected ? catColors[selected.cat] || "#888888" : null;

  return (
    <div className="map-wrap">
      <Nav />
      <header className="hero">
        <h1>北海道 2026/12 地點地圖</h1>
        <p>Carter &amp; Rola</p>
        <span className="draft-badge">草稿版・資料來源：interests/shared.md、itinerary/logistics.md</span>
      </header>

      <div className="legend">
        {LEGEND_CATEGORIES.map((cat) => (
          <span key={cat}>
            <span className="dot" style={{ background: catColors[cat] }} />
            {cat}
          </span>
        ))}
      </div>

      <div className="map-row">
        <aside className="sidebar">
          {selected ? (
            <>
              <h2>{selected.name}</h2>
              <div className="meta">
                <span className="dot" style={{ background: selectedColor }} />
                {selected.cat} ・ {selected.priority}
              </div>
              {selected.note && <div className="note">{selected.note}</div>}
            </>
          ) : (
            <div className="placeholder">點地圖上的標記查看詳細資訊</div>
          )}
        </aside>
        <div id="map" ref={mapContainerRef} />
      </div>
    </div>
  );
}
