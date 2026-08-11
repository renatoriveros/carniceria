import React from 'react';

export default function Sidebar({ currentTab, onTabChange, currentUser, onLogout }) {
  const menuItems = [
    {
      id: 'pos',
      label: 'Nueva Venta',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
      )
    },
    {
      id: 'stock',
      label: 'Stock Disponible',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
          <line x1="12" y1="22.08" x2="12" y2="12"></line>
        </svg>
      )
    },
    {
      id: 'caja',
      label: 'Cerrar Caja',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
          <line x1="12" y1="10" x2="12" y2="10"></line>
          <line x1="12" y1="14" x2="12" y2="14"></line>
        </svg>
      )
    },
    {
      id: 'resumen',
      label: 'Resumen',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10"></line>
          <line x1="12" y1="20" x2="12" y2="4"></line>
          <line x1="6" y1="20" x2="6" y2="14"></line>
        </svg>
      )
    },
    {
      id: 'boletas',
      label: 'Boletas',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
      )
    }
  ];

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="mobile-top-bar">
        <div className="mobile-brand">
          <span className="mobile-logo">SE</span>
          <span className="mobile-title">Santa Elena</span>
        </div>
        <button onClick={onLogout} className="mobile-logout" title="Cerrar sesión">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="sidebar-container">
        <div className="sidebar-header">
          <div className="brand-logo">SE</div>
          <div className="brand-info">
            <h1 className="brand-name">Santa Elena</h1>
            <span className="brand-tagline">Butcher Management</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`nav-item ${isActive ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
                {isActive && <span className="active-indicator" />}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile-card">
            <div className="user-avatar">
              {currentUser?.name?.substring(0, 2).toUpperCase() || 'AD'}
            </div>
            <div className="user-details">
              <span className="user-name">{currentUser?.name || 'Admin'}</span>
              <span className="user-role">
                Administrador - Caja 1
              </span>
            </div>
            <button onClick={onLogout} className="logout-btn" title="Cerrar Sesión">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-bottom-nav">
        {menuItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`mobile-nav-item ${isActive ? 'active' : ''}`}
            >
              <span className="mobile-nav-icon">{item.icon}</span>
              <span className="mobile-nav-label">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <style>{`
        /* Sidebar desktop styles */
        .sidebar-container {
          display: flex;
          flex-direction: column;
          width: 260px;
          height: 100vh;
          background-color: var(--bg-sidebar);
          border-right: 1px solid var(--border);
          position: fixed;
          top: 0;
          left: 0;
          z-index: 100;
          padding: 24px 16px;
        }

        .sidebar-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 36px;
          padding: 0 8px;
        }

        .brand-logo {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 42px;
          height: 42px;
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
          color: white;
          font-weight: 700;
          font-size: 18px;
          border-radius: var(--radius-sm);
          box-shadow: var(--shadow-sm);
        }

        .brand-info {
          display: flex;
          flex-direction: column;
        }

        .brand-name {
          font-size: 16px;
          font-weight: 700;
          color: var(--primary-dark);
          line-height: 1.2;
          margin: 0;
        }

        .brand-tagline {
          font-size: 10px;
          color: var(--text-light);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex-grow: 1;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border: none;
          background: transparent;
          border-radius: var(--radius-sm);
          color: var(--text-secondary);
          font-size: 14px;
          font-weight: 500;
          text-align: left;
          cursor: pointer;
          position: relative;
          transition: var(--transition);
        }

        .nav-item:hover {
          background-color: var(--primary-light);
          color: var(--primary);
        }

        .nav-item.active {
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
          color: white;
          font-weight: 600;
          box-shadow: var(--shadow-md);
        }

        .nav-icon {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .active-indicator {
          position: absolute;
          right: 0;
          top: 25%;
          height: 50%;
          width: 4px;
          background-color: white;
          border-radius: 2px 0 0 2px;
        }

        .sidebar-footer {
          border-top: 1px solid var(--border);
          padding-top: 16px;
        }

        .user-profile-card {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px;
          background-color: var(--bg-main);
          border-radius: var(--radius-sm);
          border: 1px solid var(--border);
        }

        .user-avatar {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          background-color: var(--primary-light);
          color: var(--primary);
          font-weight: 700;
          font-size: 14px;
          border-radius: 50%;
        }

        .user-details {
          display: flex;
          flex-direction: column;
          flex-grow: 1;
          overflow: hidden;
        }

        .user-name {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .user-role {
          font-size: 11px;
          color: var(--text-light);
        }

        .logout-btn {
          background: transparent;
          border: none;
          color: var(--text-light);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          border-radius: 4px;
          transition: var(--transition);
        }

        .logout-btn:hover {
          color: var(--danger);
          background-color: var(--danger-light);
        }

        /* Mobile View Styles */
        .mobile-top-bar,
        .mobile-bottom-nav {
          display: none;
        }

        @media (max-width: 768px) {
          .sidebar-container {
            display: none;
          }

          .mobile-top-bar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 56px;
            background-color: var(--bg-sidebar);
            border-bottom: 1px solid var(--border);
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 100;
            padding: 0 16px;
          }

          .mobile-brand {
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .mobile-logo {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
            background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
            color: white;
            font-weight: 700;
            font-size: 14px;
            border-radius: var(--radius-sm);
          }

          .mobile-title {
            font-size: 15px;
            font-weight: 700;
            color: var(--primary-dark);
          }

          .mobile-logout {
            background: transparent;
            border: none;
            color: var(--text-secondary);
            padding: 8px;
          }

          .mobile-bottom-nav {
            display: flex;
            justify-content: space-around;
            align-items: center;
            height: 64px;
            background-color: var(--bg-sidebar);
            border-top: 1px solid var(--border);
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 100;
            padding-bottom: env(safe-area-inset-bottom);
          }

          .mobile-nav-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            flex-grow: 1;
            border: none;
            background: transparent;
            color: var(--text-light);
            cursor: pointer;
            gap: 4px;
          }

          .mobile-nav-item.active {
            color: var(--primary);
          }

          .mobile-nav-label {
            font-size: 10px;
            font-weight: 500;
          }
        }
      `}</style>
    </>
  );
}
