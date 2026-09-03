import { Fragment } from "react";
import Nav from "../components/Nav";
import { trip, CATEGORIES, SLOTS, days } from "../data/itinerary";
import "./DayBoardPage.css";

function scheduledCount(day) {
  return day.groups["早"].length + day.groups["午"].length + day.groups["晚"].length;
}

export default function DayBoardPage() {
  return (
    <div className="board-wrap">
      <Nav />
      <header className="hero">
        <h1>{trip.title}</h1>
        <p>Carter &amp; Rola</p>
        <span className="draft-badge">草稿版・資料來源：itinerary/outline.md</span>
      </header>

      <div className="info-row-wrap">
        <section className="info-card">
          <h2>航班</h2>
          {trip.flights.map((f) => (
            <div className="info-line" key={f.label}>
              <span>{f.label}</span>
              <span>{f.value}</span>
            </div>
          ))}
        </section>
        <section className="info-card">
          <h2>住宿</h2>
          {trip.hotel.map((h) => (
            <div className="info-line" key={h.label}>
              <span>{h.label}</span>
              <span>{h.value}</span>
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
                <span className="day-num">{day.num}</span>
                <span className="day-date">{day.date}</span>
                <span className="count">{scheduledCount(day)}</span>
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
                    day.groups[slot].map((item, i) => (
                      <div className={`item-card${item.cat ? ` cat-${item.cat}` : ""}`} key={i}>
                        {item.text}
                        {item.sub && <div className="sub">{item.sub}</div>}
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
