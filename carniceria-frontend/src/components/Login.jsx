import React, { useState } from 'react';
import { loginUser } from '../utils/db';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Por favor, complete todos los campos.');
      return;
    }
    const result = loginUser(email, password);
    if (result.success) {
      onLogin(result.user);
    } else {
      setError(result.message || 'Usuario o contraseña incorrectos.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card fade-in">
        <div className="login-header">
          <div className="brand-logo-circle">SE</div>
          <h2>Santa Elena</h2>
          <p className="login-subtitle">Sistema POS y Control de Inventario</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="login-error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="email">Usuario</label>
            <input
              type="text"
              id="email"
              placeholder="Usuario (admin)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              placeholder="Contraseña (admin)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
            />
          </div>

          <div className="login-options">
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span className="checkmark"></span>
              Recordarme
            </label>
          </div>

          <button type="submit" className="login-button">
            Entrar al Sistema
          </button>
        </form>

        <div className="login-footer">
          <span className="status-dot"></span>
          Servidor local - Conectado
        </div>
      </div>

      <style>{`
        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100vw;
          height: 100vh;
          background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
        }
        .login-card {
          width: 420px;
          padding: 40px;
          background: var(--bg-card);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-lg);
          border-top: 6px solid var(--primary);
        }
        .login-header {
          text-align: center;
          margin-bottom: 30px;
        }
        .brand-logo-circle {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
          color: white;
          font-weight: 700;
          font-size: 24px;
          border-radius: 50%;
          margin-bottom: 12px;
          box-shadow: var(--shadow-md);
        }
        .login-header h2 {
          font-size: 24px;
          color: var(--primary-dark);
          margin-bottom: 4px;
          font-weight: 700;
        }
        .login-subtitle {
          font-size: 13px;
          color: var(--text-secondary);
        }
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .login-error-message {
          padding: 10px 14px;
          background-color: var(--danger-light);
          color: var(--danger);
          border-radius: var(--radius-sm);
          font-size: 13px;
          font-weight: 500;
          border-left: 3px solid var(--danger);
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
          letter-spacing: 0.5px;
        }
        .login-input {
          padding: 12px 16px;
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          font-size: 14px;
          background-color: #fcfcfc;
          transition: var(--transition);
        }
        .login-input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(138, 21, 21, 0.1);
          background-color: #ffffff;
        }
        .login-options {
          display: flex;
          align-items: center;
          font-size: 13px;
          color: var(--text-secondary);
        }
        .checkbox-container {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          user-select: none;
        }
        .login-button {
          padding: 14px;
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
          color: white;
          border: none;
          border-radius: var(--radius-sm);
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition);
          box-shadow: var(--shadow-sm);
          margin-top: 10px;
        }
        .login-button:hover {
          background: var(--primary-hover);
          transform: translateY(-1px);
          box-shadow: var(--shadow-md);
        }
        .login-button:active {
          transform: translateY(0);
        }
        .login-footer {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 30px;
          font-size: 12px;
          color: var(--text-light);
          border-top: 1px solid var(--border);
          padding-top: 20px;
        }
        .status-dot {
          width: 8px;
          height: 8px;
          background-color: var(--success);
          border-radius: 50%;
          display: inline-block;
          box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
        }
      `}</style>
    </div>
  );
}
