import React, { useState, useEffect } from 'react';
import { initDB, getCurrentUser, logoutUser, getActiveShift, openShift } from './utils/db';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import POS from './components/POS';
import Stock from './components/Stock';
import CerrarCaja from './components/CerrarCaja';
import Dashboard from './components/Dashboard';
import Boletas from './components/Boletas';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentTab, setCurrentTab] = useState('pos');
  const [activeShift, setActiveShift] = useState(null);
  const [dataTrigger, setDataTrigger] = useState(0); // Dummy state to trigger redraws
  
  // Opening Caja balance state
  const [openingAmount, setOpeningAmount] = useState('100000');

  useEffect(() => {
    // Initialize Local DB
    initDB();
    
    // Check active login session
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setActiveShift(getActiveShift());
    }
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
    setActiveShift(getActiveShift());
    setCurrentTab('pos');
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    setActiveShift(null);
  };

  // Re-fetch data trigger for siblings
  const handleDataChange = () => {
    setDataTrigger(prev => prev + 1);
  };

  const handleShiftUpdate = () => {
    const shift = getActiveShift();
    setActiveShift(shift);
    if (!shift || shift.estado === 'Cerrado') {
      // If the shift is closed, automatically log the user out!
      handleLogout();
    } else {
      handleDataChange();
    }
  };

  const handleOpenCajaOnLogin = (e) => {
    e.preventDefault();
    if (!openingAmount || Number(openingAmount) < 0) {
      alert('Monto de apertura inválido.');
      return;
    }
    const newShift = openShift(openingAmount);
    setActiveShift(newShift);
    handleDataChange();
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  // Si la caja está cerrada, forzar ingreso del monto de apertura (Bloqueante)
  if (!activeShift || activeShift.estado !== 'Abierto') {
    return (
      <div className="caja-open-fullscreen">
        <div className="caja-open-card fade-in">
          <div className="caja-card-header">
            <div className="lock-icon-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
            <h2>Apertura de Caja Obligatoria</h2>
            <p>Debe registrar el monto inicial en efectivo de la gaveta para iniciar operaciones.</p>
          </div>

          <form onSubmit={handleOpenCajaOnLogin} className="caja-open-form">
            <div className="form-group">
              <label>Monto de Apertura ($)</label>
              <input
                type="number"
                value={openingAmount}
                onChange={(e) => setOpeningAmount(e.target.value)}
                placeholder="Ej: 100000"
                className="caja-input"
                required
                autoFocus
              />
              <span className="input-help-text">Efectivo base disponible para dar vuelto.</span>
            </div>

            <button type="submit" className="open-caja-btn">
              Iniciar Turno y Abrir Caja
            </button>
            
            <button type="button" onClick={handleLogout} className="exit-btn-on-caja">
              Salir / Cerrar Sesión
            </button>
          </form>
        </div>

        <style>{`
          .caja-open-fullscreen {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100vw;
            height: 100vh;
            background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
          }
          .caja-open-card {
            width: 420px;
            padding: 40px;
            background: var(--bg-card);
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-lg);
            border-top: 6px solid var(--primary);
            text-align: center;
          }
          .lock-icon-wrapper {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 60px;
            height: 60px;
            background-color: var(--primary-light);
            color: var(--primary);
            border-radius: 50%;
            margin-bottom: 16px;
          }
          .caja-card-header h2 {
            font-size: 20px;
            color: var(--primary-dark);
            font-weight: 700;
            margin-bottom: 8px;
          }
          .caja-card-header p {
            font-size: 13px;
            color: var(--text-secondary);
            margin-bottom: 24px;
            line-height: 1.4;
          }
          .caja-open-form {
            text-align: left;
            display: flex;
            flex-direction: column;
            gap: 16px;
          }
          .form-group {
            display: flex;
            flex-direction: column;
            gap: 6px;
          }
          .form-group label {
            font-size: 12px;
            font-weight: 600;
            color: var(--text-secondary);
            text-transform: uppercase;
          }
          .caja-input {
            padding: 12px;
            border: 1px solid var(--border);
            border-radius: var(--radius-sm);
            font-size: 14px;
            outline: none;
            background-color: #fcfcfc;
            transition: var(--transition);
          }
          .caja-input:focus {
            border-color: var(--primary);
            background-color: white;
            box-shadow: 0 0 0 3px rgba(138, 21, 21, 0.1);
          }
          .input-help-text {
            font-size: 11px;
            color: var(--text-light);
          }
          .open-caja-btn {
            padding: 14px;
            background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
            color: white;
            border: none;
            border-radius: var(--radius-sm);
            font-size: 14px;
            font-weight: 700;
            cursor: pointer;
            transition: var(--transition);
            box-shadow: var(--shadow-sm);
          }
          .open-caja-btn:hover {
            background: var(--primary-hover);
            transform: translateY(-1px);
            box-shadow: var(--shadow-md);
          }
          .exit-btn-on-caja {
            padding: 10px;
            background: transparent;
            border: none;
            color: var(--text-secondary);
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
            text-decoration: underline;
          }
          .exit-btn-on-caja:hover {
            color: var(--danger);
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="app-shell-layout">
      {/* Sidebar Navigation */}
      <Sidebar 
        currentTab={currentTab} 
        onTabChange={setCurrentTab} 
        currentUser={currentUser} 
        onLogout={handleLogout} 
      />

      {/* Main Content Area */}
      <main className="main-content-window">
        {currentTab === 'pos' && (
          <POS key={`pos-${dataTrigger}`} onSaleCompleted={handleDataChange} />
        )}
        {currentTab === 'stock' && (
          <Stock key={`stock-${dataTrigger}`} onProductChange={handleDataChange} />
        )}
        {currentTab === 'caja' && (
          <CerrarCaja key={`caja-${dataTrigger}`} onShiftChange={handleShiftUpdate} />
        )}
        {currentTab === 'resumen' && (
          <Dashboard key={`dashboard-${dataTrigger}`} />
        )}
        {currentTab === 'boletas' && (
          <Boletas key={`boletas-${dataTrigger}`} />
        )}
      </main>

      <style>{`
        .app-shell-layout {
          display: flex;
          width: 100vw;
          min-height: 100vh;
          overflow-x: hidden;
        }

        .main-content-window {
          flex-grow: 1;
          min-height: 100vh;
          width: 100%;
        }

        @media (max-width: 1024px) {
          .app-shell-layout {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
