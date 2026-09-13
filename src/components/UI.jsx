import React from "react";
import {
  CheckCircle2,
  XCircle,
  Clock3,
  Activity,
  Search,
  Wifi,
} from "./Icons";

export function Card({ children, className = "" }) {
  return <section className={`card ${className}`}>{children}</section>;
}

export function Button({ children, variant = "primary", icon, ...p }) {
  return (
    <button className={`btn btn-${variant}`} {...p}>
      {icon}
      {children}
    </button>
  );
}

export function Status({ value }) {
  const good = [
    "Online",
    "Active",
    "Available",
    "Resolved",
    "Approved",
  ].includes(value);
  const bad = ["Offline", "Inactive", "Cancelled"].includes(value);
  const warn = [
    "Open",
    "Investigating",
    "Maintenance",
    "Occupied",
    "Pending",
  ].includes(value);

  return (
    <span
      className={`status ${
        good ? "success" : bad ? "danger" : warn ? "warning" : "info"
      }`}
    >
      {good ? (
        <CheckCircle2 size={14} />
      ) : bad ? (
        <XCircle size={14} />
      ) : warn ? (
        <Clock3 size={14} />
      ) : (
        <Activity size={14} />
      )}{" "}
      {value}
    </span>
  );
}

export function Stat({ label, value, icon: Icon, trend, danger }) {
  return (
    <Card className="stat-card">
      <div>
        <b className="stat-value">{value}</b>
        <span className="stat-label">{label}</span>
        <small className={danger ? "trend danger" : "trend"}>{trend}</small>
      </div>
      <div className="stat-icon">
        <Icon size={25} />
      </div>
    </Card>
  );
}

export function Header({ title, subtitle, action }) {
  return (
    <div className="section-head">
      <div>
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function SearchBox({ value, onChange, placeholder = "Search..." }) {
  return (
    <div className="table-search">
      <Search size={16} />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

export function Input({ icon, value, onChange, type = "text", placeholder }) {
  return (
    <div className="input-wrap">
      {icon}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required
      />
    </div>
  );
}

export function AuthHead({ title, desc }) {
  return (
    <div className="auth-head">
      <div className="mobile-auth-logo">
        <Wifi size={21} />
      </div>
      <h2>{title}</h2>
      <p>{desc}</p>
    </div>
  );
}

export function AuthLayout({ children, title, desc, features = [] }) {
  return (
    <div className="auth-page">
      <div className="auth-glow one" />
      <div className="auth-glow two" />
      <aside className="auth-brand">
        <div className="brand">
          <div className="brand-mark">
            <Wifi size={24} />
          </div>
          NetFlow
        </div>
        <div className="auth-hero">
          <div className="auth-symbol">
            <Activity size={27} />
          </div>
          <h1>{title}</h1>
          <p>{desc}</p>
          {features.map((f, i) => (
            <div className="auth-feature" key={i}>
              <CheckCircle2 size={18} />
              {f}
            </div>
          ))}
        </div>
        <small>NetFlow • Major Project Edition</small>
      </aside>
      <main className="auth-form">{children}</main>
    </div>
  );
}
