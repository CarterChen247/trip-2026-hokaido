import { useEffect, useState } from "react";
import Nav from "../components/Nav";
import { packingItems, CATEGORIES } from "../data/packing";
import "./PackingPage.css";

const STORAGE_KEY = "packing-checked-v1";

function loadChecked() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

export default function PackingPage() {
  const [checked, setChecked] = useState(loadChecked);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...checked]));
  }, [checked]);

  function toggleItem(id) {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const total = packingItems.length;
  const done = checked.size;

  return (
    <div className="packing-wrap">
      <Nav />
      <header className="hero">
        <span className="eyebrow">草稿版・資料來源：itinerary/packing.md</span>
        <h1>打包清單</h1>
        <p className="sub num">
          {done} / {total} 已打包 ・ 存在這台裝置，不會跨裝置同步
        </p>
      </header>

      {CATEGORIES.map((category) => {
        const items = packingItems.filter((i) => i.category === category);
        if (items.length === 0) return null;
        return (
          <section className="category-section" key={category}>
            <h2>{category}</h2>
            <ul className="item-list">
              {items.map((item) => (
                <li key={item.id}>
                  <label className={`packing-item${checked.has(item.id) ? " checked" : ""}`}>
                    <input
                      type="checkbox"
                      checked={checked.has(item.id)}
                      onChange={() => toggleItem(item.id)}
                    />
                    <span className="name">{item.name}</span>
                    {item.note && <span className="note">{item.note}</span>}
                  </label>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
