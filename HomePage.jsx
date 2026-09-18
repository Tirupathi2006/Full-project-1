import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../components/TopBar.jsx";
import BottomNav from "../components/BottomNav.jsx";
import { useRide } from "../context/RideContext.jsx";
import { useToast } from "../components/Toast.jsx";
import { getCurrentPosition, reverseGeocode, searchPlaces, buildRoute } from "../utils/geo.js";
import { getFareQuote } from "../api/fare.js";
import { listRides } from "../api/rides.js";
import { shortLabel, modeIcon } from "../utils/format.js";

const QUICK_CHIPS = ["Airport", "Railway Station", "City Center", "Bus Stand"];

export default function HomePage() {
  const navigate = useNavigate();
  const toast = useToast();
  const { pickup, setPickup, drop, setDrop, setRoute, setOptions, setSelected } = useRide();

  const [pickupText, setPickupText] = useState("");
  const [dropText, setDropText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [suggestTarget, setSuggestTarget] = useState("drop");
  const [comparing, setComparing] = useState(false);
  const [recent, setRecent] = useState([]);
  const debounceRef = useRef(null);

  useEffect(() => {
    locate(true);
    listRides()
      .then((rides) => setRecent(rides.slice(0, 3)))
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function locate(silent) {
    try {
      const pos = await getCurrentPosition();
      const label = await reverseGeocode(pos.lat, pos.lng);
      setPickup({ ...pos, label });
      setPickupText(shortLabel(label));
    } catch {
      if (!silent) toast("Couldn't access your location — type it manually.", "error");
    }
  }

  function runSearch(query, target) {
    setSuggestTarget(target);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      const results = await searchPlaces(query);
      setSuggestions(results);
    }, 400);
  }

  function pickSuggestion(r) {
    const target = { lat: parseFloat(r.lat), lng: parseFloat(r.lon), label: r.display_name };
    if (suggestTarget === "pickup") {
      setPickup(target);
      setPickupText(shortLabel(r.display_name));
    } else {
      setDrop(target);
      setDropText(shortLabel(r.display_name));
    }
    setSuggestions([]);
  }

  async function handleCompare() {
    if (!pickup || !drop) return;
    setComparing(true);
    try {
      const routeData = await buildRoute(pickup, drop);
      const fareOptions = await getFareQuote({
        pickupLat: pickup.lat,
        pickupLng: pickup.lng,
        pickupLabel: pickup.label,
        dropLat: drop.lat,
        dropLng: drop.lng,
        dropLabel: drop.label,
        distanceKm: routeData.driving.distanceKm,
        drivingMin: routeData.driving.durationMin,
        cyclingMin: routeData.cycling.durationMin,
      });
      setRoute(routeData);
      setOptions(fareOptions);
      setSelected(null);
      navigate("/results");
    } catch (err) {
      toast("Couldn't calculate routes. Check your connection and try again.", "error");
    } finally {
      setComparing(false);
    }
  }

  function repeatTrip(ride) {
    const p = { lat: ride.pickupLat, lng: ride.pickupLng, label: ride.pickupLabel };
    const d = { lat: ride.dropLat, lng: ride.dropLng, label: ride.dropLabel };
    setPickup(p);
    setDrop(d);
    setPickupText(shortLabel(p.label));
    setDropText(shortLabel(d.label));
  }

  return (
    <>
      <TopBar title="RouteWise" />
      <main className="app-main">
        <section className="screen">
          <div className="location-card">
            <div className="location-row">
              <span className="dot dot-pickup" aria-hidden="true"></span>
              <input
                type="text"
                placeholder="Detecting your location…"
                value={pickupText}
                onChange={(e) => {
                  setPickupText(e.target.value);
                  setPickup(null);
                  runSearch(e.target.value, "pickup");
                }}
              />
              <button type="button" className="link-btn" onClick={() => locate(false)}>
                Locate
              </button>
            </div>
            <div className="location-divider">
              <span></span>
            </div>
            <div className="location-row">
              <span className="dot dot-drop" aria-hidden="true"></span>
              <input
                type="text"
                placeholder="Where are you headed?"
                value={dropText}
                onChange={(e) => {
                  setDropText(e.target.value);
                  setDrop(null);
                  runSearch(e.target.value, "drop");
                }}
              />
            </div>

            {suggestions.length > 0 && (
              <ul className="suggestion-list">
                {suggestions.map((r, i) => (
                  <li key={i} className="suggestion-item" onClick={() => pickSuggestion(r)}>
                    <span className="suggestion-title">{r.display_name.split(",")[0]}</span>
                    <span className="suggestion-sub">{shortLabel(r.display_name)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="quick-chips">
            {QUICK_CHIPS.map((chip) => (
              <button
                key={chip}
                type="button"
                className="chip"
                onClick={() => {
                  setDropText(chip);
                  setDrop(null);
                  runSearch(chip, "drop");
                }}
              >
                {chip}
              </button>
            ))}
          </div>

          <button
            className="btn btn-primary btn-block btn-lg"
            style={{ marginTop: "1.5rem" }}
            disabled={!pickup || !drop || comparing}
            onClick={handleCompare}
          >
            {comparing ? "Finding routes…" : "Compare fares"}
          </button>

          {recent.length > 0 && (
            <div className="recent-block" style={{ marginTop: "1.75rem" }}>
              <div className="section-label">Recent trips</div>
              <div className="recent-list">
                {recent.map((r) => (
                  <div key={r.id} className="recent-item" onClick={() => repeatTrip(r)}>
                    <span className="recent-icon">{modeIcon(r.mode)}</span>
                    <div className="recent-text">
                      <div className="recent-title">{shortLabel(r.dropLabel)}</div>
                      <div className="recent-sub">from {shortLabel(r.pickupLabel)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>
      <BottomNav />
    </>
  );
}
