import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import { useRide } from "../context/RideContext.jsx";
import { useToast } from "../components/Toast.jsx";
import { createRide } from "../api/rides.js";
import { fmtMoney } from "../utils/format.js";

const STATUS_STEPS = ["Requested", "Driver assigned", "Arriving", "On trip", "Completed"];

const DRIVERS = [
  { name: "Arun Kumar", rating: 4.8, plateSuffix: "3311" },
  { name: "Priya Sharma", rating: 4.9, plateSuffix: "7742" },
  { name: "Rahul Verma", rating: 4.7, plateSuffix: "1098" },
  { name: "Sneha Iyer", rating: 4.85, plateSuffix: "5567" },
  { name: "Vikram Singh", rating: 4.6, plateSuffix: "2290" },
  { name: "Meera Nair", rating: 4.95, plateSuffix: "8814" },
];

const VEHICLES = {
  bike: ["Honda Activa", "TVS Jupiter", "Bajaj Pulsar"],
  car: ["Suzuki Dzire", "Hyundai i20", "Toyota Etios"],
  bus: ["Volvo City Bus", "Ashok Leyland Bus", "Tata Starbus"],
};

function pinIcon(cls) {
  return L.divIcon({ className: "", html: `<div class="rw-marker ${cls}"></div>`, iconSize: [16, 16] });
}

function FitBounds({ positions }) {
  const map = useMap();
  useEffect(() => {
    if (positions.length >= 2) map.fitBounds(L.latLngBounds(positions), { padding: [30, 30] });
  }, [positions, map]);
  return null;
}

export default function TrackingPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const { pickup, drop, route, selected, reset } = useRide();

  const [step, setStep] = useState(0);
  const [caption, setCaption] = useState("Finding a nearby driver…");
  const [driver, setDriver] = useState(null);
  const [driverPos, setDriverPos] = useState(null);
  const [finished, setFinished] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const timers = useRef([]);
  const persisted = useRef(false);

  useEffect(() => {
    if (!pickup || !drop || !route || !selected) {
      navigate("/home", { replace: true });
      return;
    }

    const coords = route[selected.mode === "bike" ? "cycling" : "driving"].coords;
    setDriverPos(coords[0]);

    const pickedDriver = DRIVERS[Math.floor(Math.random() * DRIVERS.length)];
    const vehicle = VEHICLES[selected.mode][Math.floor(Math.random() * VEHICLES[selected.mode].length)];
    const plate = `KA ${Math.floor(Math.random() * 90 + 10)} ${pickedDriver.plateSuffix}`;

    // Phase 1: matching
    timers.current.push(
      setTimeout(() => {
        setStep(1);
        setCaption(`${pickedDriver.name} is heading your way`);
        setDriver({ ...pickedDriver, vehicle, plate });
        toast(`${pickedDriver.name} accepted your ride`, "success");
      }, 2500)
    );

    // Phase 2: arriving to pickup
    timers.current.push(
      setTimeout(() => {
        setStep(2);
        let t = 0;
        const arriveDur = 5000;
        const arriveTimer = setInterval(() => {
          t += 200;
          const pct = Math.min(1, t / arriveDur);
          const remain = Math.max(1, Math.round((1 - pct) * 3) + 1);
          setCaption(`${pickedDriver.name} arrives in ${remain} min`);
          if (pct >= 1) {
            clearInterval(arriveTimer);
            beginTrip(coords);
          }
        }, 200);
        timers.current.push(arriveTimer);
      }, 3200)
    );

    function beginTrip(routeCoords) {
      setStep(3);
      setDriverPos(routeCoords[0]);
      const totalSteps = routeCoords.length;
      const demoDurationMs = Math.min(22000, Math.max(9000, selected.etaMin * 550));
      const stepInterval = demoDurationMs / totalSteps;
      let idx = 0;

      const tripTimer = setInterval(() => {
        idx += 1;
        if (idx >= totalSteps) {
          clearInterval(tripTimer);
          setDriverPos(routeCoords[totalSteps - 1]);
          finishTrip(pickedDriver);
          return;
        }
        setDriverPos(routeCoords[idx]);
        const remainMin = Math.max(1, Math.round(((totalSteps - idx) / totalSteps) * selected.etaMin));
        setCaption(`On the way — ${remainMin} min left`);
      }, stepInterval);
      timers.current.push(tripTimer);
    }

    function finishTrip(pickedDriver) {
      setStep(4);
      setCaption("You've arrived! 🎉");
      setFinished(true);
      if (!persisted.current) {
        persisted.current = true;
        createRide({
          mode: selected.mode,
          pickupLabel: pickup.label,
          pickupLat: pickup.lat,
          pickupLng: pickup.lng,
          dropLabel: drop.label,
          dropLat: drop.lat,
          dropLng: drop.lng,
          distanceKm: selected.distanceKm,
          etaMin: selected.etaMin,
          price: selected.price,
          status: "completed",
          driverName: pickedDriver.name,
        }).catch(() => toast("Ride finished but couldn't save to history.", "error"));
      }
    }

    return () => timers.current.forEach((t) => (typeof t === "number" ? clearTimeout(t) : clearInterval(t)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleCancel() {
    if (!confirm("Cancel this ride?")) return;
    setCancelled(true);
    timers.current.forEach((t) => (typeof t === "number" ? clearTimeout(t) : clearInterval(t)));
    createRide({
      mode: selected.mode,
      pickupLabel: pickup.label,
      pickupLat: pickup.lat,
      pickupLng: pickup.lng,
      dropLabel: drop.label,
      dropLat: drop.lat,
      dropLng: drop.lng,
      distanceKm: selected.distanceKm,
      etaMin: selected.etaMin,
      price: 0,
      status: "cancelled",
      driverName: driver?.name || null,
    }).catch(() => {});
    toast("Ride cancelled.", "error");
    reset();
    navigate("/home");
  }

  function handleDone() {
    toast("Ride completed. Thanks for riding with RouteWise!", "success");
    reset();
    navigate("/history");
  }

  if (!pickup || !drop || !route || !selected) return null;

  const coords = route[selected.mode === "bike" ? "cycling" : "driving"].coords;
  const baseFare = selected.price * 0.82;
  const distanceFare = selected.price - baseFare;

  return (
    <>
      <main className="app-main" style={{ overflowY: "hidden" }}>
        <div className="tracking-map">
          <MapContainer center={coords[0]} zoom={13} zoomControl={false} attributionControl={false} style={{ height: "100%", width: "100%" }}>
            <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
            <Marker position={[pickup.lat, pickup.lng]} icon={pinIcon("pickup")} />
            <Marker position={[drop.lat, drop.lng]} icon={pinIcon("drop")} />
            <Polyline positions={coords} pathOptions={{ color: "#ffb020", weight: 4, opacity: 0.85 }} />
            {driverPos && (
              <Marker
                position={driverPos}
                icon={L.divIcon({
                  className: "",
                  html: `<div class="rw-driver-marker">${selected.mode === "bike" ? "🏍️" : selected.mode === "bus" ? "🚌" : "🚗"}</div>`,
                  iconSize: [22, 22],
                })}
              />
            )}
            <FitBounds positions={coords} />
          </MapContainer>
        </div>

        <div className="tracking-sheet">
          <div className="status-track">
            {STATUS_STEPS.map((_, i) => (
              <div key={i} className={`status-step ${i < step ? "is-done" : i === step ? "is-active" : ""}`}></div>
            ))}
          </div>
          <p className="status-caption">{caption}</p>

          {driver && (
            <div className="driver-card">
              <img className="driver-avatar" src={`https://i.pravatar.cc/80?u=${encodeURIComponent(driver.name)}`} alt="" />
              <div className="driver-info">
                <div className="driver-name-row">
                  <span className="driver-name">{driver.name}</span>
                  <span className="driver-rating">★ {driver.rating}</span>
                </div>
                <div className="driver-vehicle">
                  {driver.vehicle} • {driver.plate}
                </div>
              </div>
              <a className="icon-btn icon-btn-accent" href="tel:+910000000000" aria-label="Call driver">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.5 2.1L7.9 9.9a16 16 0 0 0 6 6l1.4-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.9 2.2Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>
          )}

          {finished && (
            <div className="fare-summary">
              <div className="fare-row">
                <span>Base fare</span>
                <span>{fmtMoney(baseFare)}</span>
              </div>
              <div className="fare-row">
                <span>Distance &amp; time ({selected.distanceKm.toFixed(1)} km)</span>
                <span>{fmtMoney(distanceFare)}</span>
              </div>
              <div className="fare-row total">
                <span>Total paid</span>
                <span>{fmtMoney(selected.price)}</span>
              </div>
            </div>
          )}

          {!finished && !cancelled && (
            <button className="btn btn-outline btn-block" onClick={handleCancel}>
              Cancel ride
            </button>
          )}
          {finished && (
            <button className="btn btn-primary btn-block" onClick={handleDone}>
              Done
            </button>
          )}
        </div>
      </main>
    </>
  );
}
