import React, { useState } from "react";
import { Plus, MapPin, Users, CalendarCheck2, X } from "../components/Icons";
import { getData, saveData, newId } from "../services/storage";
import { Card, Header, Button, SearchBox, Status } from "../components/UI";

export default function Resources() {
  const [rows, setRows] = useState(getData("resources"));
  const [q, setQ] = useState("");
  const [add, setAdd] = useState(false);
  const [f, setF] = useState({
    name: "",
    category: "Lab",
    capacity: 30,
    location: "",
    status: "Available",
  });

  const list = rows.filter((x) =>
    Object.values(x).join(" ").toLowerCase().includes(q.toLowerCase())
  );

  function submit(e) {
    e.preventDefault();
    const n = [
      ...rows,
      { ...f, id: newId("RES"), capacity: Number(f.capacity) },
    ];
    setRows(n);
    saveData("resources", n);
    setAdd(false);
    setF({
      name: "",
      category: "Lab",
      capacity: 30,
      location: "",
      status: "Available",
    });
  }

  return (
    <Card>
      <Header
        title="Campus Resources"
        subtitle="Labs, rooms, halls and shared IT resources"
        action={
          <Button icon={<Plus size={15} />} onClick={() => setAdd(true)}>
            Add Resource
          </Button>
        }
      />
      <SearchBox value={q} onChange={setQ} placeholder="Search resources..." />
      <div className="resource-grid">
        {list.map((r) => (
          <div className="resource-card" key={r.id}>
            <div className="resource-top">
              <small>{r.id}</small>
              <Status value={r.status} />
            </div>
            <h3>{r.name}</h3>
            <p>{r.category}</p>
            <div className="resource-meta">
              <span>
                <MapPin size={13} />
                {r.location}
              </span>
              <span>
                <Users size={13} />
                {r.capacity}
              </span>
            </div>
            <button onClick={() => alert(`${r.name} selected for booking`)}>
              <CalendarCheck2 size={14} /> Book resource
            </button>
          </div>
        ))}
      </div>

      {add && (
        <div className="modal-bg">
          <form className="modal" onSubmit={submit}>
            <div className="modal-head">
              <h2>Add resource</h2>
              <button
                type="button"
                className="icon-btn"
                onClick={() => setAdd(false)}
              >
                <X size={17} />
              </button>
            </div>
            <div className="form-group">
              <label>Name</label>
              <input
                required
                value={f.name}
                onChange={(e) => setF({ ...f, name: e.target.value })}
              />
            </div>
            <div className="two-col">
              <div className="form-group">
                <label>Category</label>
                <select
                  value={f.category}
                  onChange={(e) => setF({ ...f, category: e.target.value })}
                >
                  <option>Lab</option>
                  <option>Meeting Room</option>
                  <option>Auditorium</option>
                  <option>Printer</option>
                </select>
              </div>
              <div className="form-group">
                <label>Capacity</label>
                <input
                  type="number"
                  value={f.capacity}
                  onChange={(e) => setF({ ...f, capacity: e.target.value })}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Location</label>
              <input
                required
                value={f.location}
                onChange={(e) => setF({ ...f, location: e.target.value })}
              />
            </div>
            <div className="modal-actions">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setAdd(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Add Resource</Button>
            </div>
          </form>
        </div>
      )}
    </Card>
  );
}

export { Resources };
