import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { initials } from "../utils/format.js";

export default function TopBar({ title, showBack = false, onBack }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <header className="topbar">
      {showBack ? (
        <button className="icon-btn" aria-label="Go back" onClick={onBack || (() => navigate(-1))}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      ) : (
        <span style={{ width: 38 }} />
      )}
      <div className="topbar-title">{title}</div>
      <button className="icon-btn" aria-label="Account" onClick={() => navigate("/profile")}>
        <span className="avatar-dot">{initials(user?.name)}</span>
      </button>
    </header>
  );
}
