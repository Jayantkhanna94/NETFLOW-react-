import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Download,
  Plus,
  Pencil,
  Trash2,
  X,
  Terminal,
  Power,
  RotateCcw,
  Activity,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { exportCSV } from "../services/storage";
import { useData } from "../contexts/DataContext";
import { Card, Header, Button, SearchBox, Status } from "../components/UI";

export function DeviceModal({ form, setForm, save, close, editing }) {
  return (
    <div className="modal-bg">
      <form className="modal" onSubmit={save}>
        <div className="modal-head">
          <h2>{editing ? "Edit Device" : "Add Device"}</h2>
          <button type="button" className="icon-btn" onClick={close}>
            <X size={17} />
          </button>
        </div>

        {["name", "location", "ip"].map((k) => (
          <div className="form-group" key={k}>
            <label>
              {k === "ip" ? "IP Address" : k[0].toUpperCase() + k.slice(1)}
            </label>
            <input
              value={form[k]}
              onChange={(e) => setForm({ ...form, [k]: e.target.value })}
              required
            />
          </div>
        ))}

        <div className="two-col">
          <div className="form-group">
            <label>Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option>Switch</option>
              <option>Router</option>
              <option>Access Point</option>
              <option>Server</option>
              <option>Printer</option>
            </select>
          </div>
          <div className="form-group">
            <label>Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option>Online</option>
              <option>Offline</option>
            </select>
          </div>
        </div>

        <div className="modal-actions">
          <Button type="button" variant="ghost" onClick={close}>
            Cancel
          </Button>
          <Button type="submit">Save Device</Button>
        </div>
      </form>
    </div>
  );
}

// Live ICMP Ping Diagnostic Modal
function PingTerminalModal({ device, close, executePing }) {
  const [lines, setLines] = useState([]);
  const [running, setRunning] = useState(false);

  const startPing = async () => {
    setLines([
      `PING ${device.name} (${device.ip}): 32 data bytes`,
      "Simulating ICMP echo requests...",
    ]);
    setRunning(true);

    await executePing(device.ip, (newLine) => {
      setLines((prev) => [...prev, newLine]);
    });

    setRunning(false);
  };

  useEffect(() => {
    startPing();
  }, [device.ip]);

  return (
    <div className="modal-bg">
      <div className="modal" style={{ width: "min(600px, 95vw)" }}>
        <div className="modal-head">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Terminal size={20} color="var(--primary)" />
            <div>
              <h2 style={{ fontSize: "16px", margin: 0 }}>
                ICMP Ping Diagnostic — {device.name}
              </h2>
              <small style={{ color: "var(--muted)" }}>Target: {device.ip}</small>
            </div>
          </div>
          <button type="button" className="icon-btn" onClick={close}>
            <X size={17} />
          </button>
        </div>

        <div className="terminal-window">
          <div className="terminal-header">
            <span className="terminal-dot" style={{ background: "#ff5f56" }} />
            <span className="terminal-dot" style={{ background: "#ffbd2e" }} />
            <span className="terminal-dot" style={{ background: "#27c93f" }} />
            <span style={{ marginLeft: "6px" }}>netflow-diagnostics v2.4 (icmp)</span>
          </div>
          {lines.map((l, i) => (
            <div
              key={i}
              className={`terminal-line ${
                l.includes("timed out")
                  ? "err"
                  : l.includes("statistics")
                  ? "dim"
                  : ""
              }`}
            >
              {l}
            </div>
          ))}
          {running && (
            <div>
              <span>Transmitting packet...</span>
              <span className="terminal-cursor" />
            </div>
          )}
        </div>

        <div className="modal-actions">
          <Button
            type="button"
            variant="ghost"
            onClick={startPing}
            disabled={running}
            icon={<RotateCcw size={14} />}
          >
            {running ? "Pinging..." : "Re-run Test"}
          </Button>
          <Button type="button" onClick={close}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function Devices({ query = "" }) {
  const outletCtx = useOutletContext();
  const globalQuery = outletCtx?.query ?? query;

  const {
    devices,
    addDevice,
    updateDevice,
    deleteDevice,
    toggleDeviceStatus,
    rebootDevice,
    executePing,
  } = useData();

  const [q, setQ] = useState(globalQuery);
  const [activeFilter, setActiveFilter] = useState("All");
  const [edit, setEdit] = useState(null);
  const [pingTarget, setPingTarget] = useState(null);

  const [form, setForm] = useState({
    name: "",
    type: "Switch",
    location: "",
    ip: "",
    status: "Online",
    cpu: 20,
    uptime: "1d",
  });

  useEffect(() => {
    if (globalQuery !== undefined) {
      setQ(globalQuery);
    }
  }, [globalQuery]);

  // Filter chips logic
  const filteredList = devices.filter((d) => {
    const matchesSearch = Object.values(d)
      .join(" ")
      .toLowerCase()
      .includes(q.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilter === "All") return true;
    if (activeFilter === "Online") return d.status === "Online";
    if (activeFilter === "Offline") return d.status !== "Online";
    return d.type.toLowerCase() === activeFilter.toLowerCase();
  });

  const save = (e) => {
    e.preventDefault();
    if (edit?.new) {
      addDevice(form);
    } else if (edit) {
      updateDevice(edit.id, form);
    }
    setEdit(null);
  };

  const filterOptions = [
    { label: "All", count: devices.length },
    { label: "Online", count: devices.filter((d) => d.status === "Online").length },
    { label: "Offline", count: devices.filter((d) => d.status !== "Online").length },
    { label: "Switch", count: devices.filter((d) => d.type === "Switch").length },
    { label: "Router", count: devices.filter((d) => d.type === "Router").length },
    { label: "Access Point", count: devices.filter((d) => d.type === "Access Point").length },
    { label: "Server", count: devices.filter((d) => d.type === "Server").length },
  ];

  return (
    <Card>
      <Header
        title="Network Devices & Hardware"
        subtitle={`${devices.length} registered hardware nodes with real-time ping telemetry`}
        action={
          <div className="actions">
            <Button
              variant="ghost"
              icon={<Download size={15} />}
              onClick={() => exportCSV("netflow-devices.csv", filteredList)}
            >
              Export CSV
            </Button>
            <Button
              icon={<Plus size={15} />}
              onClick={() => {
                setForm({
                  name: "",
                  type: "Switch",
                  location: "",
                  ip: "10.10.",
                  status: "Online",
                  cpu: 20,
                  uptime: "1d",
                });
                setEdit({ new: true });
              }}
            >
              Add Device
            </Button>
          </div>
        }
      />

      {/* Filter Chips */}
      <div className="filter-pills">
        {filterOptions.map((opt) => (
          <button
            key={opt.label}
            className={`filter-pill ${activeFilter === opt.label ? "active" : ""}`}
            onClick={() => setActiveFilter(opt.label)}
          >
            {opt.label} ({opt.count})
          </button>
        ))}
      </div>

      <SearchBox
        value={q}
        onChange={setQ}
        placeholder="Search devices by name, IP, location, or type..."
      />

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Device</th>
              <th>Type</th>
              <th>Location</th>
              <th>IP Address</th>
              <th>CPU Load</th>
              <th>Status</th>
              <th>Interactive Operations</th>
            </tr>
          </thead>
          <tbody>
            {filteredList.map((d) => (
              <tr key={d.id}>
                <td>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span
                      className={`pulse-dot ${
                        d.status === "Online"
                          ? "online"
                          : d.status === "Rebooting"
                          ? "rebooting"
                          : "offline"
                      }`}
                    />
                    <div>
                      <b>{d.name}</b>
                      <small>{d.id} • Uptime: {d.uptime}</small>
                    </div>
                  </div>
                </td>
                <td>{d.type}</td>
                <td>{d.location}</td>
                <td className="mono">{d.ip}</td>
                <td>
                  <div className="progress">
                    <i
                      style={{
                        width: `${d.cpu}%`,
                        backgroundColor:
                          d.cpu > 80
                            ? "var(--danger)"
                            : d.cpu > 60
                            ? "var(--warning)"
                            : "var(--primary)",
                      }}
                    />
                  </div>{" "}
                  {d.cpu}%
                </td>
                <td>
                  <Status value={d.status} />
                </td>
                <td>
                  <div className="device-actions">
                    {/* Live Ping Test Action */}
                    <button
                      className="btn-action"
                      onClick={() => setPingTarget(d)}
                      title="Run Live ICMP Ping Diagnostic"
                    >
                      <Terminal size={13} /> Ping
                    </button>

                    {/* Quick Power Toggle */}
                    <button
                      className={`btn-action ${d.status === "Online" ? "danger" : "success"}`}
                      onClick={() => toggleDeviceStatus(d.id)}
                      title={d.status === "Online" ? "Turn Device Offline" : "Turn Device Online"}
                    >
                      <Power size={13} /> {d.status === "Online" ? "Stop" : "Start"}
                    </button>

                    {/* Reboot Action */}
                    <button
                      className="btn-action"
                      onClick={() => rebootDevice(d.id)}
                      disabled={d.status === "Rebooting"}
                      title="Simulate Device Reboot Cycle"
                    >
                      <RotateCcw size={13} />
                    </button>

                    {/* Edit */}
                    <button
                      className="icon-btn sm"
                      onClick={() => {
                        setEdit(d);
                        setForm(d);
                      }}
                      title="Edit Configuration"
                    >
                      <Pencil size={13} />
                    </button>

                    {/* Delete */}
                    <button
                      className="icon-btn sm"
                      onClick={() => {
                        if (confirm(`Remove ${d.name} from inventory?`)) {
                          deleteDevice(d.id);
                        }
                      }}
                      title="Delete Device"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit / Add Modal */}
      {edit && (
        <DeviceModal
          form={form}
          setForm={setForm}
          save={save}
          close={() => setEdit(null)}
          editing={!edit.new}
        />
      )}

      {/* Live ICMP Ping Modal */}
      {pingTarget && (
        <PingTerminalModal
          device={pingTarget}
          close={() => setPingTarget(null)}
          executePing={executePing}
        />
      )}
    </Card>
  );
}

export { Devices };
