import { NavLink } from 'react-router-dom';
import './DashboardLayout.css';

export default function DashboardLayout({ title, subtitle, navItems, children }) {
  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <label className="mono-label">NAVIGATION</label>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink 
              key={item.path} 
              to={item.path}
              className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      
      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1 className="dashboard-title">{title}</h1>
          {subtitle && <p className="dashboard-subtitle">{subtitle}</p>}
        </header>
        <div className="dashboard-content">
          {children}
        </div>
      </main>
    </div>
  );
}
