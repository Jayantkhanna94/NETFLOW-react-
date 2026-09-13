import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Wifi,
  X,
  LayoutDashboard,
  Server,
  Building2,
  CalendarCheck2,
  TriangleAlert,
  FileText,
  Users,
  Settings,
  UserCircle,
  LogOut,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export const navItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/devices", label: "Devices", icon: Server },
  { path: "/network", label: "Network", icon: Wifi },
  { path: "/resources", label: "Resources", icon: Building2 },
  { path: "/bookings", label: "Bookings", icon: CalendarCheck2 },
  { path: "/incidents", label: "Incidents", icon: TriangleAlert },
  { path: "/reports", label: "Reports", icon: FileText },
  { path: "/users", label: "Users", icon: Users },
  { path: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ mobile, setMobile }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleNav = (path) => {
    navigate(path);
    if (setMobile) setMobile(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <aside className={`sidebar ${mobile ? "mobile" : ""}`}>
      <div className="brand">
        <div className="brand-mark">
          <Wifi size={24} />
        </div>
        <span>NetFlow</span>
        <button className="mobile-x" onClick={() => setMobile && setMobile(false)}>
          <X />
        </button>
      </div>

      <nav>
        {navItems.map(({ path, label, icon: Icon }) => {
          const isActive =
            location.pathname === path ||
            (path !== "/" && location.pathname.startsWith(path));
          return (
            <button
              key={path}
              className={`nav-item ${isActive ? "active" : ""}`}
              onClick={() => handleNav(path)}
            >
              <Icon size={20} />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>

      <div className="side-bottom">
        <button
          className={`nav-item ${
            location.pathname === "/profile" ? "active" : ""
          }`}
          onClick={() => handleNav("/profile")}
        >
          <UserCircle size={20} />
          <span>Profile</span>
        </button>
        <button
          className="nav-item nav-logout"
          onClick={handleLogout}
          title="Sign Out of NetFlow"
          style={{ color: "var(--danger)" }}
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export { Sidebar };
