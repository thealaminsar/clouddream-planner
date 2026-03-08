import { useState } from "react";

const BASE = { units: 346, cogs: 1870, adSpend: 437880, revenue: 1601279 };

const fmt = n => "৳" + Math.round(n).toLocaleString("en-IN");
const fmtX = n => n.toFixed(2) + "x";
const fmtPct = n => n.toFixed(1) + "%";

function calc({ units, cogs, adSpend, revenue }) {
  const totalCOGS = units * cogs;
  const grossProfit = revenue - totalCOGS;
  const netProfit = grossProfit - adSpend;
  return {
    totalCOGS, grossProfit, netProfit,
    netMargin: (netProfit / revenue) * 100,
    roas: revenue / adSpend,
    cpa: adSpend / units,
    profitPerUnit: netProfit / units,
  };
}

const base = calc(BASE);

function MetricCard({ label, baseVal, current, format, highlight }) {
  const diff = current - baseVal;
  const hasChange = Math.abs(diff) > 0.01;
  const positive = diff > 0;
  const pctChange = baseVal !== 0 ? ((diff / Math.abs(baseVal)) * 100).toFixed(1) : 0;

  return (
    <div style={{
      background: highlight ? "linear-gradient(135deg, rgba(37,99,235,0.2), rgba(96,165,250,0.08))" : "rgba(255,255,255,0.03)",
      border: `1px solid ${highlight ? "rgba(37,99,235,0.5)" : "rgba(255,255,255,0.07)"}`,
      borderRadius: 12,
      padding: "14px 16px",
      position: "relative",
      overflow: "hidden",
    }}>
      {highlight && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, #1d4ed8, #60a5fa)" }} />}
      <div style={{ fontSize: 9, color: "#4b5563", textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 700, marginBottom: 8 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        <span style={{ fontSize: 20, fontWeight: 800, color: highlight ? "#93c5fd" : "#e5e7eb", letterSpacing: "-0.02em" }}>{format(current)}</span>
        {hasChange && (
          <span style={{
            fontSize: 10, fontWeight: 700,
            color: positive ? "#4ade80" : "#f87171",
            background: positive ? "rgba(74,222,128,0.1)" : "rgba(248,113,113,0.1)",
            padding: "2px 7px", borderRadius: 20,
            border: `1px solid ${positive ? "rgba(74,222,128,0.25)" : "rgba(248,113,113,0.25)"}`,
          }}>
            {positive ? "▲" : "▼"} {Math.abs(pctChange)}%
          </span>
        )}
      </div>
    </div>
  );
}

function Slider({ label, value, min, max, step, onChange, format, icon }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <span style={{ fontSize: 16 }}>{icon}</span>
          <span style={{ fontSize: 12, color: "#9ca3af", fontWeight: 500 }}>{label}</span>
        </div>
        <span style={{ fontSize: 13, fontWeight: 800, color: "#60a5fa", letterSpacing: "-0.01em" }}>{format(value)}</span>
      </div>
      <div style={{ position: "relative", height: 6, borderRadius: 4, background: "rgba(255,255,255,0.07)" }}>
        <div style={{
          position: "absolute", left: 0, top: 0, height: "100%",
          width: `${pct}%`,
          background: "linear-gradient(90deg, #1e3a8a, #2563eb, #60a5fa)",
          borderRadius: 4,
        }} />
        <div style={{
          position: "absolute", top: "50%", left: `${pct}%`,
          transform: "translate(-50%, -50%)",
          width: 14, height: 14, borderRadius: "50%",
          background: "#60a5fa",
          border: "2px solid #1e3a8a",
          boxShadow: "0 0 8px rgba(96,165,250,0.6)",
          pointerEvents: "none",
        }} />
        <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(+e.target.value)}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0, cursor: "pointer", margin: 0 }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
        <span style={{ fontSize: 9, color: "#374151" }}>{format(min)}</span>
        <span style={{ fontSize: 9, color: "#374151" }}>{format(max)}</span>
      </div>
    </div>
  );
}

export default function App() {
  const [adSpend, setAdSpend] = useState(BASE.adSpend);
  const [cpa, setCpa] = useState(Math.round(BASE.adSpend / BASE.units));
  const [cogs, setCogs] = useState(BASE.cogs);

  const units = Math.max(1, Math.round(adSpend / cpa));
  const revenue = units * (BASE.revenue / BASE.units);
  const s = calc({ units, cogs, adSpend, revenue });

  return (
    <div style={{
      minHeight: "100vh",
      background: "#060b18",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      color: "#fff",
      padding: "28px 16px",
    }}>
      <div style={{
        position: "fixed", top: "-20%", left: "30%", width: 500, height: 500,
        background: "radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: 740, margin: "0 auto", position: "relative" }}>
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#2563eb", boxShadow: "0 0 8px #2563eb" }} />
            <span style={{ fontSize: 10, color: "#2563EB", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 700 }}>CloudDream · Live Scenario Planner</span>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 900, margin: "0 0 6px", letterSpacing: "-0.03em", color: "#f1f5f9" }}>P&L Modeler</h1>
          <p style={{ color: "#374151", fontSize: 12, margin: 0, lineHeight: 1.6 }}>
            Adjust levers below — metrics update live. <span style={{ color: "#4ade80" }}>Green</span> = improvement · <span style={{ color: "#f87171" }}>Red</span> = decline vs actual
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "22px 20px" }}>
            <div style={{ fontSize: 9, color: "#374151", textTransform: "uppercase", letterSpacing: "0.16em", fontWeight: 700, marginBottom: 22 }}>📐 Adjust Levers</div>
            <Slider label="Ad Spend" value={adSpend} min={100000} max={2000000} step={10000} onChange={setAdSpend} format={fmt} icon="📣" />
            <Slider label="CPA (Cost Per Sale)" value={cpa} min={400} max={3000} step={50} onChange={setCpa} format={fmt} icon="🎯" />
            <Slider label="Unit COGS" value={cogs} min={800} max={3000} step={50} onChange={setCogs} format={fmt} icon="📦" />
            <div style={{ marginTop: 18, paddingTop: 18, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ fontSize: 9, color: "#374151", textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 700, marginBottom: 12 }}>Derived</div>
              {[
                ["Units Sold", units.toLocaleString() + " pcs"],
                ["Revenue", fmt(revenue)],
                ["Total COGS", fmt(s.totalCOGS)],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 9 }}>
                  <span style={{ fontSize: 11, color: "#4b5563" }}>{k}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#60a5fa" }}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ fontSize: 9, color: "#374151", textTransform: "uppercase", letterSpacing: "0.16em", fontWeight: 700, marginBottom: 2 }}>📊 Results vs Actual</div>
            <MetricCard label="Net Profit" baseVal={base.netProfit} current={s.netProfit} format={fmt} highlight />
            <MetricCard label="Net Margin" baseVal={base.netMargin} current={s.netMargin} format={fmtPct} />
            <MetricCard label="ROAS" baseVal={base.roas} current={s.roas} format={fmtX} />
            <MetricCard label="Gross Profit" baseVal={base.grossProfit} current={s.grossProfit} format={fmt} />
            <MetricCard label="Profit / Unit" baseVal={base.profitPerUnit} current={s.profitPerUnit} format={fmt} />
          </div>
        </div>

        <div style={{ marginTop: 14, background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 12, padding: "14px 20px" }}>
          <div style={{ fontSize: 9, color: "#374151", textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 700, marginBottom: 12 }}>Actual Baseline · April Batch</div>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {[
              ["Units", "346 pcs"],
              ["Ad Spend", fmt(BASE.adSpend)],
              ["Revenue", fmt(BASE.revenue)],
              ["Net Profit", fmt(base.netProfit)],
              ["ROAS", fmtX(base.roas)],
              ["CPA", fmt(base.cpa)],
              ["Net Margin", fmtPct(base.netMargin)],
            ].map(([k, v], i, arr) => (
              <div key={k} style={{ flex: "1 1 auto", textAlign: "center", padding: "0 12px", borderRight: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                <div style={{ fontSize: 9, color: "#374151", marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.1em" }}>{k}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#4b5563" }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
