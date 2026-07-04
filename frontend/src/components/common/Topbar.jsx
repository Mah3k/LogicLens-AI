import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Menu,
  X,
  ScanLine,
  LayoutDashboard,
  ScanSearch,
  History,
  TrendingUp,
  User,
  Settings,
} from "lucide-react";

import "./Topbar.css";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/analyze", label: "Code Analyzer", icon: ScanSearch },
  { to: "/history", label: "History", icon: History },
  { to: "/progress", label: "Progress", icon: TrendingUp },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function Topbar({ title }) {
  const [drawer, setDrawer] = useState(false);

  return (
    <>
      <header className="topbar">
        <div className="topbar-left">
          <button
            className="topbar-burger"
            onClick={() => setDrawer(true)}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>

          <h1 className="topbar-title">{title}</h1>
        </div>

        
      </header>

      {drawer && (
        <div
          className="topbar-drawer-backdrop"
          onClick={() => setDrawer(false)}
        >
          <div
            className="topbar-drawer"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="topbar-drawer-head">
              <span className="sidebar-logo">
                <ScanLine
                  size={20}
                  className="sidebar-logo-icon"
                />
                {" "}LogicLens <em>AI</em>
              </span>

              <button
                onClick={() => setDrawer(false)}
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="sidebar-nav">
              {NAV.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `sidebar-link ${
                      isActive ? "sidebar-link-active" : ""
                    }`
                  }
                  onClick={() => setDrawer(false)}
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}