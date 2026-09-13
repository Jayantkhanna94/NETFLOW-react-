import React, { useState } from "react";
import { Plus, TriangleAlert, X, CheckCircle2 } from "../components/Icons";
import { useData } from "../contexts/DataContext";
import { Card, Header, Button, SearchBox, Status } from "../components/UI";

export default function Incidents() {
  const { incidents, resolveIncident, addIncident } = useData();

  const [q, setQ] = useState("");
  const [add, setAdd] = useState(false);
  const [filter, setFilter] = useState("All");

  const [f, setF] = useState({
    title: "",
    severity: "Medium",
    status: "Open",
    device: "",
  });

  const list = incidents.filter((i) => {
    const matchesSearch = Object.values(i)
      .join(" ")
      .toLowerCase()
      .includes(q.toLowerCase());

    if (!matchesSearch) return false;
    if (filter === "All") return true;
    if (filter === "Open") return i.status !== "Resolved";
    if (filter === "Resolved") return i.status === "Resolved";
    return i.severity.toLowerCase() === filter.toLowerCase();
  });

  function submit(e) {
    e.preventDefault();
    addIncident({
      title: f.title,
      severity: f.severity,
      status: "Open",
      device: f.device || "General Network",
    });
    setAdd(false);
    setF({
      title: "",
      severity: "Medium",
      status: "Open",
      device: "",
    });
  }

  const filterOptions = [
    { label: "All", count: incidents.length },
    { label: "Open", count: incidents.filter((i) => i.status !== "Resolved").length },
    { label: "Resolved", count: incidents.filter((i) => i.status === "Resolved").length },
    { label: "High", count: incidents.filter((i) => i.severity === "High").length },
    { label: "Medium", count: incidents.filter((i) => i.severity === "Medium").length },
    { label: "Low", count: incidents.filter((i) => i.severity === "Low").length },
  ];

  return (
    <Card>
      <Header
        title="Incident & Alert Management"
        subtitle={`${incidents.length} logged incidents • Auto-correlated with device status telemetry`}
        action={
          <Button icon={<Plus size={15} />} onClick={() => setAdd(true)}>
            Report Incident
          </Button>
        }
      />

      <div className="filter-pills">
        {filterOptions.map((opt) => (
          <button
            key={opt.label}
            className={`filter-pill ${filter === opt.label ? "active" : ""}`}
            onClick={() => setFilter(opt.label)}
          >
            {opt.label} ({opt.count})
          </button>
        ))}
      </div>

      <SearchBox value={q} onChange={setQ} placeholder="Search incidents, devices..." />

      <div className="incident-list">
        {list.length === 0 ? (
          <div style={{ textAlign: "center", padding: "30px", color: "var(--muted)" }}>
            No incidents found matching current filter.
          </div>
        ) : (
          list.map((i) => (
            <div className="incident" key={i.id}>
              <div className={`incident-icon ${i.severity.toLowerCase()}`}>
                <TriangleAlert size={19} />
              </div>
              <div className="incident-main">
                <b>{i.title}</b>
                <small>
                  {i.id} • Target: {i.device} • {i.time}
                </small>
              </div>
              <strong className={`severity ${i.severity.toLowerCase()}`}>
                {i.severity}
              </strong>
              <Status value={i.status} />
              {i.status !== "Resolved" ? (
                <Button variant="ghost" onClick={() => resolveIncident(i.id)}>
                  Resolve
                </Button>
              ) : (
                <span style={{ color: "var(--success)", fontSize: "11px", display: "flex", alignItems: "center", gap: "4px" }}>
                  <CheckCircle2 size={14} /> Closed
                </span>
              )}
            </div>
          ))
        )}
      </div>

      {add && (
        <div className="modal-bg">
          <form className="modal" onSubmit={submit}>
            <div className="modal-head">
              <h2>Report Incident</h2>
              <button
                type="button"
                className="icon-btn"
                onClick={() => setAdd(false)}
              >
                <X size={17} />
              </button>
            </div>
            <div className="form-group">
              <label>Incident Title</label>
              <input
                required
                value={f.title}
                onChange={(e) => setF({ ...f, title: e.target.value })}
                placeholder="e.g. Core Switch link flapping"
              />
            </div>
            <div className="two-col">
              <div className="form-group">
                <label>Severity</label>
                <select
                  value={f.severity}
                  onChange={(e) => setF({ ...f, severity: e.target.value })}
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Critical</option>
                </select>
              </div>
              <div className="form-group">
                <label>Affected Device</label>
                <input
                  value={f.device}
                  onChange={(e) => setF({ ...f, device: e.target.value })}
                  placeholder="e.g. AP-118 or SW-001"
                />
              </div>
            </div>
            <div className="modal-actions">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setAdd(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Log Incident</Button>
            </div>
          </form>
        </div>
      )}
    </Card>
  );
}

export { Incidents };
