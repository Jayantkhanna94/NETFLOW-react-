import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Save,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  LogOut,
} from "../components/Icons";
import { useAuth } from "../contexts/AuthContext";
import { Card, Header, Button, Status } from "../components/UI";

// Helper to intelligently map a designation to a platform role
export const deriveRoleFromDesignation = (designation, currentRole = "Student") => {
  if (!designation) return currentRole;
  const d = designation.trim().toLowerCase();

  // Administrative / engineering / management keywords
  if (
    d.includes("admin") ||
    d.includes("director") ||
    d.includes("manager") ||
    d.includes("head") ||
    d.includes("lead") ||
    d.includes("engineer") ||
    d.includes("sysadmin") ||
    d.includes("architect") ||
    d.includes("officer")
  ) {
    return "Administrator";
  }

  // Academic staff / faculty keywords
  if (
    d.includes("faculty") ||
    d.includes("prof") ||
    d.includes("teacher") ||
    d.includes("staff") ||
    d.includes("lecturer") ||
    d.includes("instructor") ||
    d.includes("dean") ||
    d.includes("mentor")
  ) {
    return "Faculty";
  }

  // Student / learner / scholar keywords
  if (
    d.includes("student") ||
    d.includes("scholar") ||
    d.includes("intern") ||
    d.includes("learner") ||
    d.includes("trainee") ||
    d.includes("candidate") ||
    d.includes("undergraduate") ||
    d.includes("postgraduate")
  ) {
    return "Student";
  }

  return currentRole;
};

// Access permissions description based on role
export const getAccessDescription = (role) => {
  switch (role) {
    case "Administrator":
      return "Full administrative access (Complete device controls, inventory CRUD, incident resolution & system preferences)";
    case "Faculty":
      return "Faculty access permissions (Resource bookings, incident reporting, operational reports & device telemetry)";
    case "Student":
    default:
      return "Student access permissions (Campus resource reservations, ticket viewing & infrastructure health monitoring)";
  }
};

export default function Profile() {
  const navigate = useNavigate();
  const { currentUser, updateProfile, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const [f, setF] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    phone: currentUser?.phone || "",
    role: currentUser?.role || "Student",
    designation: currentUser?.designation || currentUser?.role || "Student",
    location: currentUser?.location || "",
    bio: currentUser?.bio || "",
  });

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setF({
        name: currentUser.name || "",
        email: currentUser.email || "",
        phone: currentUser.phone || "",
        role: currentUser.role || "Student",
        designation: currentUser.designation || currentUser.role || "Student",
        location: currentUser.location || "",
        bio: currentUser.bio || "",
      });
    }
  }, [currentUser]);

  // When designation changes, automatically derive and update role & access
  const handleDesignationChange = (newDesignation) => {
    const updatedRole = deriveRoleFromDesignation(newDesignation, f.role);
    setF((prev) => ({
      ...prev,
      designation: newDesignation,
      role: updatedRole,
    }));
  };

  // When role dropdown changes, update role and access immediately
  const handleRoleChange = (newRole) => {
    setF((prev) => ({
      ...prev,
      role: newRole,
      // If designation was same as previous role or empty, update it too
      designation:
        !prev.designation || prev.designation === prev.role
          ? newRole
          : prev.designation,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updated = {
      name: f.name,
      email: f.email,
      phone: f.phone,
      role: f.role,
      designation: f.designation,
      location: f.location,
      bio: f.bio,
    };

    if (updateProfile) {
      updateProfile(updated);
    } else {
      localStorage.setItem(
        "netflowCurrentUser",
        JSON.stringify({ ...(currentUser || {}), ...updated })
      );
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="profile-grid">
      {/* Left Profile Card */}
      <Card className="profile-card">
        <div className="profile-avatar">
          {getInitials(f.name)}
        </div>
        <h2>{f.name || "User"}</h2>
        <p>{f.designation || f.role}</p>
        <div style={{ margin: "6px 0 12px" }}>
          <span className="role">{f.role}</span>
        </div>
        <Status value="Active" />

        <div className="profile-contact">
          <span>
            <Mail size={14} />
            {f.email || "No email provided"}
          </span>
          <span>
            <Phone size={14} />
            {f.phone ? (
              f.phone
            ) : (
              <span style={{ color: "var(--muted)", fontStyle: "italic" }}>
                Not provided
              </span>
            )}
          </span>
          <span>
            <MapPin size={14} />
            {f.location ? (
              f.location
            ) : (
              <span style={{ color: "var(--muted)", fontStyle: "italic" }}>
                Location not set
              </span>
            )}
          </span>
        </div>
      </Card>

      {/* Edit Profile Card */}
      <Card>
        <Header
          title="Edit Profile"
          subtitle="Update your account information, designation and access tier"
        />
        <form onSubmit={handleSubmit}>
          <div className="two-col">
            <div className="form-group">
              <label>Full Name</label>
              <input
                value={f.name}
                onChange={(e) => setF({ ...f, name: e.target.value })}
                placeholder="Enter your full name"
                required
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                value={f.email}
                onChange={(e) => setF({ ...f, email: e.target.value })}
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div className="two-col">
            <div className="form-group">
              <label>Designation / Title</label>
              <input
                value={f.designation}
                onChange={(e) => handleDesignationChange(e.target.value)}
                placeholder="e.g. Student, Professor, Network Administrator"
                required
              />
            </div>
            <div className="form-group">
              <label>Assigned Role & Access Tier</label>
              <select
                value={f.role}
                onChange={(e) => handleRoleChange(e.target.value)}
                style={{
                  width: "100%",
                  background: "var(--panel)",
                  border: "1px solid var(--border)",
                  borderRadius: "9px",
                  color: "var(--text)",
                  padding: "11px",
                  fontSize: "11px",
                  outline: "0",
                }}
              >
                <option value="Student">Student (Standard Access)</option>
                <option value="Faculty">Faculty (Elevated Access)</option>
                <option value="Administrator">Administrator (Full Access)</option>
              </select>
            </div>
          </div>

          <div className="two-col">
            <div className="form-group">
              <label>Phone Number</label>
              <input
                value={f.phone}
                onChange={(e) => setF({ ...f, phone: e.target.value })}
                placeholder="e.g. +91 9876543210"
              />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input
                value={f.location}
                onChange={(e) => setF({ ...f, location: e.target.value })}
                placeholder="e.g. Chandigarh, India"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Bio</label>
            <textarea
              rows="4"
              value={f.bio}
              onChange={(e) => setF({ ...f, bio: e.target.value })}
              placeholder="Write a brief bio about yourself or your department..."
            />
          </div>

          <Button icon={<Save size={15} />} type="submit">
            {saved ? "Profile & Access Updated" : "Save Profile"}
          </Button>
        </form>
      </Card>

      {/* Account Security Card with Dynamic Role & Access */}
      <Card>
        <Header
          title="Account Security"
          subtitle="Password and live access permissions"
        />
        <div className="security-box">
          <KeyRound size={20} />
          <div>
            <b>Password</b>
            <small>Active session password</small>
          </div>
          <Button
            variant="ghost"
            onClick={() =>
              alert("Password update requested for " + f.email)
            }
          >
            Change Password
          </Button>
        </div>

        <div className="security-box">
          <ShieldCheck size={20} />
          <div>
            <b>Role & Access Level</b>
            <small style={{ color: "var(--primary)" }}>
              {getAccessDescription(f.role)}
            </small>
          </div>
          <span className="role">{f.role}</span>
        </div>

        <div className="security-box" style={{ borderBottom: 0 }}>
          <LogOut size={20} color="var(--danger)" />
          <div>
            <b>Active Session</b>
            <small>Logged in as {f.name || "User"} ({f.email})</small>
          </div>
          <Button
            variant="ghost"
            onClick={handleLogout}
            style={{
              color: "var(--danger)",
              borderColor: "rgba(255, 92, 101, 0.3)",
              background: "rgba(255, 92, 101, 0.06)",
            }}
          >
            Logout
          </Button>
        </div>
      </Card>
    </div>
  );
}

export { Profile };
