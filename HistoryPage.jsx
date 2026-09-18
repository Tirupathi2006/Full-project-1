import React, { useEffect, useState } from "react";
import TopBar from "../components/TopBar.jsx";
import BottomNav from "../components/BottomNav.jsx";
import { listRides } from "../api/rides.js";
import { fmtMoney, modeIcon } from "../utils/format.js";

function shortLabel(label) {
  if (!label) return "";
  return label.split(",").slice(0, 2).join(",").trim();
}

export default function HistoryPage() {
  const [rides, setRides] = useState(null);

  useEffect(() => {
    listRides()
      .then(setRides)
      .catch(() => setRides([]));
  }, []);

  return (
    <>
      <TopBar title="Your trips" />
      <main className="app-main">
        <section className="screen">
          <div className="section-label">Your trips</div>

          {rides === null && <p className="text-muted">Loading…</p>}

          {rides && rides.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                  <path d="M3 12h4l3 8 4-16 3 8h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="empty-state-title">No trips yet</div>
              <p className="empty-state-desc">Compare a route and take your first ride — it'll show up here.</p>
            </div>
          )}

          {rides && rides.length > 0 && (
            <div className="history-list">
              {rides.map((r) => (
                <div key={r.id} className="history-card">
                  <div className="history-top">
                    <span className="history-route">
                      {shortLabel(r.pickupLabel)} → {shortLabel(r.dropLabel)}
                    </span>
                    <span className="history-price">{r.status === "cancelled" ? "—" : fmtMoney(r.price)}</span>
                  </div>
                  <div className="history-meta">
                    <span className={`badge badge-${r.mode}`}>
                      {modeIcon(r.mode)} {r.mode}
                    </span>
                    <span className={`badge badge-${r.status}`}>{r.status}</span>
                    <span>{new Date(r.createdAt).toLocaleDateString(undefined, { day: "numeric", month: "short" })}</span>
                    <span>{r.distanceKm.toFixed(1)} km</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      <BottomNav />
    </>
  );
}
