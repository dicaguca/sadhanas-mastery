import React from "react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { to: "/", label: "Dashboard" },
  { to: "/practices", label: "Practices" },
  { to: "/experience", label: "Experience" },
  { to: "/obstacles", label: "Obstacles" },
  { to: "/interventions", label: "Interventions" },
  { to: "/experiments", label: "Experiments" },
  { to: "/import", label: "Import" },
  { to: "/settings", label: "Settings" },
];

export function AppShell({ children }) {
  const location = useLocation();
  const [now, setNow] = React.useState(new Date());

  React.useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30000);
    return () => window.clearInterval(timer);
  }, []);

  const dateText = now.toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const timeText = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand-column">
            <div className="eyebrow">sadhanas.app</div>
            <div className="brand-line">
              <div>
                <h1>Sadhanas Mastery</h1>
                <p className="subtitle">Ongoing practice and adaptation space</p>
              </div>
            </div>
          </div>

          <div className="topbar-actions">
            <div className="datetime-pill" aria-label="Current date and time">
              <span>{dateText}</span>
              <span className="datetime-divider" aria-hidden="true">|</span>
              <span>{timeText}</span>
            </div>

            <Link
              to="/settings"
              className={location.pathname === "/settings" ? "settings-link active" : "settings-link"}
              aria-label="Open settings"
              title="Settings"
            >
              Settings
            </Link>
          </div>
        </div>

        <nav className="topnav" aria-label="Primary">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={isActive ? "nav-link active" : "nav-link"}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>

      <main className="page">{children}</main>
    </div>
  );
}
