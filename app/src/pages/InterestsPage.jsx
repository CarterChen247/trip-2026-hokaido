import { useMemo, useState } from "react";
import Nav from "../components/Nav";
import { interests, CATEGORIES, SOURCES } from "../data/interests";
import "./InterestsPage.css";

function toggle(set, value) {
  const next = new Set(set);
  next.has(value) ? next.delete(value) : next.add(value);
  return next;
}

export default function InterestsPage() {
  const [sourceFilter, setSourceFilter] = useState(new Set());
  const [categoryFilter, setCategoryFilter] = useState(new Set());

  const filtered = useMemo(
    () =>
      interests.filter(
        (i) =>
          (sourceFilter.size === 0 || sourceFilter.has(i.source)) &&
          (categoryFilter.size === 0 || categoryFilter.has(i.category))
      ),
    [sourceFilter, categoryFilter]
  );

  return (
    <div className="interests-wrap">
      <Nav />
      <header className="hero">
        <span className="eyebrow">草稿版・資料來源：interests/carter.md、rola.md、shared.md</span>
        <h1>興趣清單</h1>
        <p className="sub">Carter &amp; Rola</p>
      </header>

      <div className="filter-row">
        <div className="filter-group">
          <span className="filter-label">來源</span>
          {SOURCES.map((s) => (
            <button
              key={s.key}
              className={`chip${sourceFilter.has(s.key) ? " active" : ""}`}
              onClick={() => setSourceFilter((prev) => toggle(prev, s.key))}
            >
              {s.label}
            </button>
          ))}
        </div>
        <div className="filter-group">
          <span className="filter-label">分類</span>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              className={`chip${categoryFilter.has(c) ? " active" : ""}`}
              onClick={() => setCategoryFilter((prev) => toggle(prev, c))}
            >
              {c}
            </button>
          ))}
        </div>
        {(sourceFilter.size > 0 || categoryFilter.size > 0) && (
          <button
            className="chip clear"
            onClick={() => {
              setSourceFilter(new Set());
              setCategoryFilter(new Set());
            }}
          >
            清除篩選
          </button>
        )}
      </div>

      <p className="result-count num">{filtered.length} / {interests.length} 個地點</p>

      <div className="place-grid">
        {filtered.map((place) => (
          <article className="place-card" key={place.name}>
            <h2>{place.name}</h2>
            <div className="place-meta">
              <span className="tag">{place.category}</span>
              <span className="tag">{SOURCES.find((s) => s.key === place.source)?.label}</span>
              <span className="priority">{place.priority}</span>
            </div>
            {place.note && <p className="note">{place.note}</p>}
          </article>
        ))}
        {filtered.length === 0 && <p className="empty-note">沒有符合篩選條件的地點</p>}
      </div>
    </div>
  );
}
