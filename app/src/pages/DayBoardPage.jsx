import { Fragment, useEffect, useState } from "react";
import Nav from "../components/Nav";
import { trip, CATEGORIES, SLOTS, days } from "../data/itinerary";
import "./DayBoardPage.css";

const STORAGE_KEY = "itinerary-done-v1";

function loadDone() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function scheduledCount(day) {
  return day.groups["早"].length + day.groups["午"].length + day.groups["晚"].length;
}

export default function DayBoardPage() {
  const [done, setDone] = useState(loadDone);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...done]));
  }, [done]);

  function toggleDone(id) {
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  return (
    <div className="board-wrap">
      <Nav />
      <header className="hero">
        <span className="eyebrow">草稿版・資料來源：itinerary/outline.md</span>
        <h1>
          {trip.name} <span className="num">{trip.dateRange}</span>
        </h1>
        <p className="sub">Carter &amp; Rola</p>
      </header>

      <div className="info-row-wrap">
        <section className="info-card">
          <h2>航班</h2>
          {trip.flights.map((f) => (
            <div className="info-line" key={f.label}>
              <span>{f.label}</span>
              <span className="num">{f.value}</span>
            </div>
          ))}
        </section>
        <section className="info-card">
          <h2>住宿</h2>
          {trip.hotel.map((h) => (
            <div className="info-line" key={h.label}>
              <span>{h.label}</span>
              <span className="num">{h.value}</span>
            </div>
          ))}
        </section>
      </div>

      <div className="legend">
        {CATEGORIES.map((c) => (
          <span key={c.key}>
            <span className={`dot cat-${c.key}`} />
            {c.label}
          </span>
        ))}
      </div>

      <div className="board-scroll">
        <div className="board">
          {days.map((day) => (
            <div className="day-header" key={day.num}>
              <span className="day-badge">
                <span className="day-num num">{day.num}</span>
                <span className="day-date num">{day.date}</span>
                <span className="count num">{scheduledCount(day)}</span>
              </span>
              <div className="day-theme">{day.theme}</div>
            </div>
          ))}

          {SLOTS.map((slot) => (
            <Fragment key={slot}>
              <div className="group-label">
                <span>▾</span>
                <span className="chip">{slot}</span>
              </div>
              {days.map((day) => (
                <div className="cell" key={`${day.num}-${slot}`}>
                  {day.groups[slot].length === 0 ? (
                    <div className="empty-slot">尚未安排</div>
                  ) : (
                    day.groups[slot].map((item) => (
                      <div
                        className={`item-card${item.cat ? ` cat-${item.cat}` : ""}${done.has(item.id) ? " done" : ""}`}
                        key={item.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => toggleDone(item.id)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            toggleDone(item.id);
                          }
                        }}
                      >
                        <span className="done-mark">{done.has(item.id) ? "✅" : "☐"}</span>
                        {item.text}
                        {item.sub && <div className="sub num">{item.sub}</div>}
                      </div>
                    ))
                  )}
                </div>
              ))}
            </Fragment>
          ))}
        </div>
      </div>

      <footer>由 itinerary/outline.md 產生的草稿預覽，之後 itinerary/detailed.md 排定實際時間後會重新產生。左右滑動看更多天。</footer>
    </div>
  );
}
