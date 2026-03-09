import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  CalendarCheck2,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', hint: 'Overview and activity' },
  { to: '/employees', icon: Users, label: 'Employees', hint: 'Directory and records' },
  { to: '/attendance', icon: CalendarCheck2, label: 'Attendance', hint: 'Daily register' },
];

const Sidebar = ({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) => {
  return (
    <>
      {mobileOpen && <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />}

      <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-top">
          <div className="sidebar-brand">
            <div className="sidebar-brand-icon">
              <Briefcase size={17} color="#fff" strokeWidth={2.2} />
            </div>
            <div className="sidebar-brand-copy">
              <span className="sidebar-brand-title">HRMS</span>
              <span className="sidebar-brand-subtitle">People operations</span>
            </div>
          </div>

          <button
            type="button"
            className="sidebar-close-btn"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        </div>

        <div className="sidebar-divider" />

        <div className="sidebar-nav-shell">
          <span className="sidebar-section-label">Workspace</span>

          <nav className="sidebar-nav">
            {navItems.map((item) => {
              const NavIcon = item.icon;

              return (
                <div key={item.to} className="nav-item-wrapper">
                  <NavLink
                    to={item.to}
                    end={item.to === '/'}
                  className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => setMobileOpen(false)}
                  >
                    <span className="nav-item-icon">
                      <NavIcon size={18} />
                    </span>
                    <span className="nav-item-copy">
                      <span className="nav-item-label">{item.label}</span>
                      <span className="nav-item-hint">{item.hint}</span>
                    </span>
                  </NavLink>
                  {collapsed && <div className="tooltip">{item.label}</div>}
                </div>
              );
            })}
          </nav>
        </div>

        <div className="sidebar-footer">
          <div className="sidebar-note">
            <span className="sidebar-note-label">Daily operations</span>
            <p>Roster updates and attendance records stay aligned in one flow.</p>
          </div>
        </div>

        <button
          type="button"
          className="sidebar-dock-btn"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          {collapsed ? <ChevronRight size={13} strokeWidth={2.5} /> : <ChevronLeft size={13} strokeWidth={2.5} />}
        </button>
      </aside>
    </>
  );
};

export default Sidebar;
