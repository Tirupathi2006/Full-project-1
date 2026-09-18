import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import TopBar from "../components/TopBar.jsx";
import { useRide } from "../context/RideContext.jsx";
import { fmtMin, fmtMoney, shortLabel } from "../utils/format.js";

function pinIcon(cls) {
  return L.divIcon({ className: "", html: `<div class="rw-marker ${cls}"></div>`, iconSize: [16, 16] });
}

function FitBounds({ positions }) {
  const map = useMap();
  useEffect(() => {
    if (positions.length >= 2) {
      map.fitBounds(L.latLngBounds(positions), { padding: [24, 24] });
    }
  }, [positions, map]);
  return null;
}

export default function ResultsPage() {
  const navigate = useNavigate();
  const { pickup, drop, route, options, selected, setSelected } = useRide();
  const [sort, setSort] = useState("recommended");

  useEffect(() => {
    if (!pickup || !drop || !route) navigate("/home", { replace: true });
  }, [pickup, drop, route, navigate]);

  if (!pickup || !drop || !route) return null;

  const coords = route.driving.coords;

  let sorted = [...options];
  if (sort === "cheapest") sorted.sort((a, b) => a.price - b.price);
  else if (sort === "fastest") sorted.sort((a, b) => a.etaMin - b.etaMin);
  else sorted.sort((a, b) => (a.recommended === b.recommended ? 0 : a.recommended ? -1 : 1));

  return (
    <>
      <TopBar title="Compare rides" showBack onBack={() => navigate("/home")} />
      <main className="app-main">
        <section className="screen">
          <div className="route-summary">
            <span>
              <b>{route.driving.distanceKm.toFixed(1)} km</b> route
            </span>
            <span>
              {shortLabel(pickup.label)} → {shortLabel(drop.label)}
            </span>
          </div>

          <div className="mini-map">
            <MapContainer center={coords[0]} zoom={13} zoomControl={false} attributionControl={false} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
              <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
              <Marker position={[pickup.lat, pickup.lng]} icon={pinIcon("pickup")} />
              <Marker position={[drop.lat, drop.lng]} icon={pinIcon("drop")} />
              <Polyline positions={coords} pathOptions={{ color: "#ffb020", weight: 4, opacity: 0.85 }} />
              <FitBounds positions={coords} />
            </MapContainer>
          </div>

          <div className="sort-row">
            <span className="section-label">Choose a ride</span>
            <div className="sort-tabs">
              {["recommended", "cheapest", "fastest"].map((s) => (
                <button key={s} className={`sort-tab${sort === s ? " is-active" : ""}`} onClick={() => setSort(s)}>
                  {s === "recommended" ? "Best" : s === "cheapest" ? "Cheapest" : "Fastest"}
                </button>
              ))}
            </div>
          </div>

          <div className="ride-options">
            {sorted.map((o) => (
              <div
                key={o.mode}
                className={`ride-card${selected?.mode === o.mode ? " is-selected" : ""}`}
                onClick={() => setSelected(o)}
              >
                <span className={`ride-icon mode-${o.mode}`}>
                  {o.mode === "bike" ? "🏍️" : o.mode === "bus" ? "🚌" : "🚗"}
                </span>
                <div className="ride-info">
                  <div className="ride-title-row">
                    <span className="ride-name">{o.name}</span>
                    {o.recommended && <span className="ride-badge">Best</span>}
                  </div>
                  <div className="ride-meta">
                    {fmtMin(o.etaMin)} away • {o.description}
                  </div>
                </div>
                <div className="ride-price">
                  <div className="ride-price-value">{fmtMoney(o.price)}</div>
                  <div className="ride-price-note">{o.distanceKm.toFixed(1)} km</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {selected && (
          <div className="confirm-bar">
            <div className="confirm-bar-info">
              <span className="confirm-bar-price">{fmtMoney(selected.price)}</span>
              <span className="confirm-bar-mode">
                {selected.name} • {fmtMin(selected.etaMin)}
              </span>
            </div>
            <button className="btn btn-primary" onClick={() => navigate("/tracking")}>
              Confirm ride
            </button>
          </div>
        )}
      </main>
    </>
  );
}
