import React, { useState } from "react";
import { Download, Plus, Pencil, Trash2, X } from "../components/Icons";
import { getData, saveData, newId, exportCSV } from "../services/storage";
import { Card, Header, Button, SearchBox, Status } from "../components/UI";

export default function Users() {
  const [rows, setRows] = useState(getData("users"));
  const [q, setQ] = useState("");
  const [edit, setEdit] = useState(null);
  const [f, setF] = useState({
    name: "",
    email: "",
    role: "Student",
    status: "Active",
  });

  const list = rows.filter((x) =>
    Object.values(x).join(" ").toLowerCase().includes(q.toLowerCase())
  );

  function save(e) {
    e.preventDefault();
    const n =
      edit && !edit.new
        ? rows.map((x) => (x.id === edit.id ? { ...f, id: x.id } : x))
        : [...rows, { ...f, id: newId("U") }];
    setRows(n);
    saveData("users", n);
    setEdit(null);
  }

  return (
    <Card>
      <Header
        title="User Management"
        subtitle={`${rows.length} registered users`}
        action={
          <div className="actions">
            <Button
              variant="ghost"
              icon={<Download size={15} />}
              onClick={() => exportCSV("netflow-users.csv", list)}
            >
              Export CSV
            </Button>
            <Button
              icon={<Plus size={15} />}
              onClick={() => {
                setF({
                  name: "",
                  email: "",
                  role: "Student",
                  status: "Active",
                });
                setEdit({ new: true });
              }}
            >
              Add User
            </Button>
          </div>
        }
      />
      <SearchBox value={q} onChange={setQ} placeholder="Search users..." />
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map((u) => (
              <tr key={u.id}>
                <td>
                  <div className="user-cell">
                    <div className="table-avatar">
                      {u.name
                        .split(" ")
                        .map((x) => x[0])
                        .slice(0, 2)
                        .join("")}
                    </div>
                    <div>
                      <b>{u.name}</b>
                      <small>{u.id}</small>
                    </div>
                  </div>
                </td>
                <td>{u.email}</td>
                <td>
                  <span className="role">{u.role}</span>
                </td>
                <td>
                  <Status value={u.status} />
                </td>
                <td>
                  <button
                    className="icon-btn sm"
                    onClick={() => {
                      setEdit(u);
                      setF(u);
                    }}
                    aria-label="Edit user"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    className="icon-btn sm"
                    onClick={() => {
                      if (confirm("Delete this user?")) {
                        const n = rows.filter((x) => x.id !== u.id);
                        setRows(n);
                        saveData("users", n);
                      }
                    }}
                    aria-label="Delete user"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {edit && (
        <div className="modal-bg">
          <form className="modal" onSubmit={save}>
            <div className="modal-head">
              <h2>{edit.new ? "Add user" : "Edit user"}</h2>
              <button
                type="button"
                className="icon-btn"
                onClick={() => setEdit(null)}
                aria-label="Close modal"
              >
                <X size={17} />
              </button>
            </div>
            <div className="form-group">
              <label>Full Name</label>
              <input
                required
                value={f.name}
                onChange={(e) => setF({ ...f, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                required
                type="email"
                value={f.email}
                onChange={(e) => setF({ ...f, email: e.target.value })}
              />
            </div>
            <div className="two-col">
              <div className="form-group">
                <label>Role</label>
                <select
                  value={f.role}
                  onChange={(e) => setF({ ...f, role: e.target.value })}
                >
                  <option>Student</option>
                  <option>Faculty</option>
                  <option>Administrator</option>
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={f.status}
                  onChange={(e) => setF({ ...f, status: e.target.value })}
                >
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>
            </div>
            <div className="modal-actions">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setEdit(null)}
              >
                Cancel
              </Button>
              <Button type="submit">Save User</Button>
            </div>
          </form>
        </div>
      )}
    </Card>
  );
}

export { Users, Users as UsersPage };
