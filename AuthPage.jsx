import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../components/Toast.jsx";

export default function AuthPage() {
  const [tab, setTab] = useState("login");
  const { login, signup } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({ name: "", email: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [signupError, setSignupError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setLoginError("");
    setBusy(true);
    try {
      await login(loginForm);
      navigate("/home");
    } catch (err) {
      setLoginError(err.response?.data?.message || "Couldn't log in. Check your details.");
    } finally {
      setBusy(false);
    }
  }

  async function handleSignup(e) {
    e.preventDefault();
    setSignupError("");
    setBusy(true);
    try {
      const user = await signup(signupForm);
      toast(`Welcome to RouteWise, ${user.name.split(" ")[0]}!`, "success");
      navigate("/home");
    } catch (err) {
      setSignupError(err.response?.data?.message || "Couldn't create your account.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="screen screen-auth">
      <div className="auth-hero">
        <div className="auth-logo">
          <span className="logo-mark" aria-hidden="true">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M3 17l4-8 4 5 3-4 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="logo-word">RouteWise</span>
        </div>
        <h1>
          Every route.
          <br />
          Every ride. <span className="accent-underline">One fare check.</span>
        </h1>
        <p className="auth-sub">Compare live bike, car and bus fares between any two points before you book a thing.</p>
      </div>

      <div className="auth-card">
        <div className="auth-tabs" role="tablist">
          <button className={`auth-tab${tab === "login" ? " is-active" : ""}`} onClick={() => setTab("login")}>
            Log in
          </button>
          <button className={`auth-tab${tab === "signup" ? " is-active" : ""}`} onClick={() => setTab("signup")}>
            Sign up
          </button>
        </div>

        {tab === "login" ? (
          <form className="auth-form" onSubmit={handleLogin}>
            <div className="field">
              <label htmlFor="login-email">Email</label>
              <input
                id="login-email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
              />
            </div>
            <div className="field">
              <label htmlFor="login-password">Password</label>
              <input
                id="login-password"
                type="password"
                required
                minLength={4}
                autoComplete="current-password"
                placeholder="••••••••"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              />
            </div>
            {loginError && <p className="field-error">{loginError}</p>}
            <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
              {busy ? "Logging in…" : "Log in"}
            </button>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleSignup}>
            <div className="field">
              <label htmlFor="signup-name">Full name</label>
              <input
                id="signup-name"
                type="text"
                required
                autoComplete="name"
                placeholder="Alex Morgan"
                value={signupForm.name}
                onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
              />
            </div>
            <div className="field">
              <label htmlFor="signup-email">Email</label>
              <input
                id="signup-email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                value={signupForm.email}
                onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
              />
            </div>
            <div className="field">
              <label htmlFor="signup-password">Password</label>
              <input
                id="signup-password"
                type="password"
                required
                minLength={4}
                autoComplete="new-password"
                placeholder="At least 4 characters"
                value={signupForm.password}
                onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
              />
            </div>
            {signupError && <p className="field-error">{signupError}</p>}
            <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
              {busy ? "Creating account…" : "Create account"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
