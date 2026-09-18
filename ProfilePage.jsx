import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../components/TopBar.jsx";
import BottomNav from "../components/BottomNav.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { getStats } from "../api/rides.js";
import { fmtMoney, initials, modeIcon } from "../utils/format.js";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getStats()
      .then(setStats)
      .catch(() => setStats({ totalTrips: 0, totalSpent: 0, favoriteMode: null }));
  }, []);

  function handleLogout() {
    logout();
    navigate("/auth");
  }

  return (
    <>
      <TopBar title="Profile" />
      <main className="app-main">
        <section className="screen">
          <div className="profile-card">
            <span className="avatar-lg">{initials(user?.name)}</span>
            <div className="profile-name">{user?.name}</div>
            <div className="profile-email">{user?.email}</div>
          </div>

          <div className="profile-stats">
            <div className="profile-stat">
              <div className="profile-stat-value">{stats ? stats.totalTrips : "—"}</div>
              <div className="profile-stat-label">Trips</div>
            </div>
            <div className="profile-stat">
              <div className="profile-stat-value">{stats ? fmtMoney(stats.totalSpent) : "—"}</div>
              <div className="profile-stat-label">Spent</div>
            </div>
            <div className="profile-stat">
              <div className="profile-stat-value">{stats?.favoriteMode ? modeIcon(stats.favoriteMode) : "—"}</div>
              <div className="profile-stat-label">Top mode</div>
            </div>
          </div>

          <button className="btn btn-outline btn-block" onClick={handleLogout}>
            Log out
          </button>
        </section>
      </main>
      <BottomNav />
    </>
  );
}
