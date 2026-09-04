import { useEffect, useState } from "react";
import Nav from "../components/Nav";
import "./SharedListPage.css";

const STORAGE_KEY = "shared-list-v1";

function loadItems() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function SharedListPage() {
  const [items, setItems] = useState(loadItems);
  const [text, setText] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  function addItem(e) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    setItems((prev) => [
      ...prev,
      { id: crypto.randomUUID(), text: trimmed, removed: false, updatedAt: Date.now() },
    ]);
    setText("");
  }

  function toggleRemoved(id) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, removed: !item.removed, updatedAt: Date.now() } : item
      )
    );
  }

  const active = items.filter((item) => !item.removed);
  const bought = items.filter((item) => item.removed);

  return (
    <div className="shared-list-wrap">
      <Nav />
      <header className="hero">
        <span className="eyebrow">草稿版・雙方各自維護，透過「同步」頁面交換進度</span>
        <h1>共享清單</h1>
        <p className="sub">臨時項目（例如伴手禮），新增或劃掉之後到「同步」頁面匯出/匯入跟對方交換</p>
      </header>

      <form className="add-row" onSubmit={addItem}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="新增項目，例如：白色戀人"
        />
        <button type="submit" className="add-btn">
          新增
        </button>
      </form>

      <section className="list-section">
        <h2>待買 ({active.length})</h2>
        {active.length === 0 && <p className="empty-note">目前沒有項目</p>}
        <ul className="item-list">
          {active.map((item) => (
            <li key={item.id}>
              <label className="shared-item">
                <input type="checkbox" checked={false} onChange={() => toggleRemoved(item.id)} />
                <span className="name">{item.text}</span>
              </label>
            </li>
          ))}
        </ul>
      </section>

      {bought.length > 0 && (
        <section className="list-section">
          <h2>已買 ({bought.length})</h2>
          <ul className="item-list">
            {bought.map((item) => (
              <li key={item.id}>
                <label className="shared-item checked">
                  <input type="checkbox" checked={true} onChange={() => toggleRemoved(item.id)} />
                  <span className="name">{item.text}</span>
                </label>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
