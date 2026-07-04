import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ScanSearch,
  History,
  TrendingUp,
  User,
  Settings,
  ScanLine,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import "./Sidebar.css";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/analyze", label: "Code Analyzer", icon: ScanSearch },
  { to: "/history", label: "History", icon: History },
  { to: "/progress", label: "Progress", icon: TrendingUp },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <ScanLine size={22} className="sidebar-logo-icon" />
        <span>
          LogicLens <em>AI</em>
        </span>
      </div>

      <nav className="sidebar-nav">
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "sidebar-link-active" : ""}`
            }
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-foot">
        <div className="sidebar-user">
          <div className="sidebar-avatar">
            {(user?.name || "D").charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="sidebar-user-name">{user?.name || "Developer"}</p>
            <p className="sidebar-user-email">{user?.email || ""}</p>
          </div>
        </div>
        <button
          className="sidebar-logout"
          onClick={() => {
            logout();
            navigate("/", { replace: true });
          }}
        >
          <LogOut size={16} /> Log out
          
        </button>
      </div>
    </aside>
  );
}
