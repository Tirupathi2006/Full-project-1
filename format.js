export function fmtMin(min) {
  if (min < 60) return `${Math.round(min)} min`;
  const h = Math.floor(min / 60);
  const m = Math.round(min % 60);
  return `${h}h ${m}m`;
}

export function fmtMoney(v) {
  return `₹${Math.round(v)}`;
}

export function shortLabel(label) {
  if (!label) return "";
  return label.split(",").slice(0, 2).join(",").trim();
}

export function initials(name) {
  return (
    (name || "?")
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join("") || "?"
  );
}

export function modeIcon(mode) {
  if (mode === "bike") return "🏍️";
  if (mode === "bus") return "🚌";
  return "🚗";
}
