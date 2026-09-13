export const seeds = {
  devices: [
    {
      id: "SW-001",
      name: "Core Switch",
      type: "Switch",
      location: "Main Server Room",
      ip: "10.10.0.1",
      status: "Online",
      cpu: 42,
      uptime: "18d 04h",
    },
    {
      id: "RTR-002",
      name: "Gateway Router",
      type: "Router",
      location: "Network Operations",
      ip: "10.10.0.254",
      status: "Online",
      cpu: 58,
      uptime: "32d 11h",
    },
    {
      id: "AP-103",
      name: "Library AP",
      type: "Access Point",
      location: "Central Library",
      ip: "10.10.3.21",
      status: "Online",
      cpu: 31,
      uptime: "7d 09h",
    },
    {
      id: "AP-118",
      name: "Lab AP",
      type: "Access Point",
      location: "Computer Lab 2",
      ip: "10.10.4.18",
      status: "Offline",
      cpu: 0,
      uptime: "—",
    },
    {
      id: "SRV-011",
      name: "ERP Server",
      type: "Server",
      location: "Data Center",
      ip: "10.10.5.11",
      status: "Online",
      cpu: 67,
      uptime: "54d 02h",
    },
    {
      id: "PRN-014",
      name: "Admin Printer",
      type: "Printer",
      location: "Admin Block",
      ip: "10.10.6.14",
      status: "Online",
      cpu: 12,
      uptime: "12d 07h",
    },
  ],
  resources: [
    {
      id: "LAB-01",
      name: "Computer Lab 1",
      category: "Lab",
      capacity: 60,
      location: "Block A",
      status: "Available",
    },
    {
      id: "LAB-02",
      name: "Computer Lab 2",
      category: "Lab",
      capacity: 45,
      location: "Block A",
      status: "Occupied",
    },
    {
      id: "MR-03",
      name: "Meeting Room 3",
      category: "Meeting Room",
      capacity: 12,
      location: "Admin Block",
      status: "Available",
    },
    {
      id: "AUD-01",
      name: "Main Auditorium",
      category: "Auditorium",
      capacity: 500,
      location: "Academic Block",
      status: "Available",
    },
    {
      id: "PR-02",
      name: "Printing Station 2",
      category: "Printer",
      capacity: 4,
      location: "Library",
      status: "Maintenance",
    },
  ],
  users: [
    {
      id: "U001",
      name: "System Administrator",
      email: "admin@netflow.com",
      role: "Administrator",
      status: "Active",
    },
    {
      id: "U002",
      name: "Priya Singh",
      email: "priya@college.edu",
      role: "Faculty",
      status: "Active",
    },
    {
      id: "U003",
      name: "Aman Gupta",
      email: "aman@college.edu",
      role: "Student",
      status: "Active",
    },
    {
      id: "U004",
      name: "Riya Sharma",
      email: "riya@college.edu",
      role: "Student",
      status: "Inactive",
    },
  ],
  incidents: [
    {
      id: "INC-1042",
      title: "Lab AP disconnected",
      severity: "High",
      status: "Open",
      device: "AP-118",
      time: "10 min ago",
    },
    {
      id: "INC-1041",
      title: "High CPU on ERP server",
      severity: "Medium",
      status: "Investigating",
      device: "SRV-011",
      time: "38 min ago",
    },
    {
      id: "INC-1040",
      title: "Printer unavailable",
      severity: "Low",
      status: "Resolved",
      device: "PRN-014",
      time: "2 hr ago",
    },
    {
      id: "INC-1039",
      title: "Gateway latency spike",
      severity: "Medium",
      status: "Resolved",
      device: "RTR-002",
      time: "4 hr ago",
    },
  ],
};

export const getData = (key) => {
  try {
    const x = localStorage.getItem("netflow_" + key);
    if (x) return JSON.parse(x);
  } catch {}
  localStorage.setItem("netflow_" + key, JSON.stringify(seeds[key] || []));
  return seeds[key] || [];
};

export const saveData = (key, v) =>
  localStorage.setItem("netflow_" + key, JSON.stringify(v));

export const newId = (p) => `${p}-${Date.now().toString().slice(-6)}`;

export const readJSON = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};

export const writeJSON = (key, value) =>
  localStorage.setItem(key, JSON.stringify(value));

export const removeJSON = (key) => localStorage.removeItem(key);

export function exportCSV(filename, rows) {
  if (!rows || !rows.length) return;
  const keys = Object.keys(rows[0]);
  const csv = [
    keys.join(","),
    ...rows.map((r) =>
      keys.map((k) => `"${String(r[k] ?? "").replaceAll('"', '""')}"`).join(",")
    ),
  ].join("\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  a.download = filename;
  a.click();
}
