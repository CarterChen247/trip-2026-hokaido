import Nav from "../components/Nav";
import { dates, flights, lodging, localTransport, other } from "../data/logistics";
import "./LogisticsPage.css";

export default function LogisticsPage() {
  return (
    <div className="logistics-wrap">
      <Nav />
      <header className="hero">
        <span className="eyebrow">草稿版・資料來源：itinerary/logistics.md</span>
        <h1>航班/交通/住宿</h1>
        <p className="sub num">
          {dates.depart} → {dates.return}
        </p>
      </header>

      <section className="section">
        <h2>航班</h2>
        <div className="card-grid">
          {flights.map((f) => (
            <article className="info-card" key={f.segment + f.date}>
              <div className="card-title">{f.segment}</div>
              <div className="info-line">
                <span>日期</span>
                <span className="num">{f.date}</span>
              </div>
              <div className="info-line">
                <span>航班編號</span>
                <span className="num">{f.flightNo}</span>
              </div>
              <div className="info-line">
                <span>起飛 → 抵達</span>
                <span className="num">
                  {f.depart} → {f.arrive}
                </span>
              </div>
              <div className="info-line">
                <span>備註</span>
                <span>{f.note}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>住宿</h2>
        <div className="card-grid">
          {lodging.map((l) => (
            <article className="info-card" key={l.place}>
              <div className="card-title">{l.place}</div>
              <div className="info-line">
                <span>Day</span>
                <span className="num">{l.day}</span>
              </div>
              <div className="info-line">
                <span>日期</span>
                <span className="num">{l.date}</span>
              </div>
              <div className="info-line">
                <span>地區</span>
                <span>{l.area}</span>
              </div>
              <div className="info-line">
                <span>訂房狀態</span>
                <span>{l.bookingStatus}</span>
              </div>
              <div className="info-line">
                <span>座標</span>
                <span className="num">{l.coord}</span>
              </div>
              {l.note && <p className="note">{l.note}</p>}
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>市內交通 / 租車</h2>
        <article className="info-card">
          <ul className="plain-list">
            {localTransport.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="section">
        <h2>其他</h2>
        <article className="info-card">
          {other.map((o) => (
            <div className="info-line" key={o.label}>
              <span>{o.label}</span>
              <span>{o.value}</span>
            </div>
          ))}
        </article>
      </section>
    </div>
  );
}
