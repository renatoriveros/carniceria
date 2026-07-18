import React, { useState, useEffect } from 'react';
import {
  getActiveShift,
  openShift,
  closeShift,
  getCashMoves,
  addCashMove,
  getSales
} from '../utils/db';

export default function CerrarCaja({ onShiftChange }) {
  const [activeShift, setActiveShift] = useState(null);
  const [cashMoves, setCashMoves] = useState([]);
  const [sales, setSales] = useState([]);

  // Open Shift Form State
  const [openAmount, setOpenAmount] = useState('100000');

  // Add Cash Move State
  const [moveType, setMoveType] = useState('Ingreso');
  const [moveAmount, setMoveAmount] = useState('');
  const [moveConcept, setMoveConcept] = useState('');

  // Close Shift State
  const [realCloseAmount, setRealCloseAmount] = useState('');
  const [showCloseSummary, setShowCloseSummary] = useState(false);
  const [closeReport, setCloseReport] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const shift = getActiveShift();
    setActiveShift(shift);
    setCashMoves(getCashMoves());

    // Filter sales belonging to current active shift
    if (shift && shift.estado === 'Abierto') {
      const allSales = getSales();
      const shiftSales = allSales.filter(s => s.id_turno === shift.id_turno);
      setSales(shiftSales);
    } else {
      setSales([]);
    }
  };

  const handleOpenShiftSubmit = (e) => {
    e.preventDefault();
    if (!openAmount || Number(openAmount) < 0) {
      alert('Monto de apertura inválido.');
      return;
    }
    const newShift = openShift(openAmount);
    setActiveShift(newShift);
    setCashMoves([]);
    setSales([]);
    if (onShiftChange) onShiftChange();
  };

  const handleAddMoveSubmit = (e) => {
    e.preventDefault();
    if (!moveAmount || Number(moveAmount) <= 0 || !moveConcept) {
      alert('Por favor, complete todos los campos correctamente.');
      return;
    }

    addCashMove(moveType, moveAmount, moveConcept);

    // Reset fields & reload
    setMoveAmount('');
    setMoveConcept('');
    loadData();
  };

  // Calculations for current shift cash balance
  const initialCash = activeShift?.monto_apertura || 0;

  // Only cash sales increase cash in drawer
  const cashSalesTotal = sales
    .filter(s => s.metodo_pago === 'Efectivo')
    .reduce((sum, s) => sum + s.total_venta, 0);

  // Card/Transfer sales are tracked separately
  const nonCashSalesTotal = sales
    .filter(s => s.metodo_pago !== 'Efectivo')
    .reduce((sum, s) => sum + s.total_venta, 0);

  // Manual movements calculations
  const inflowsTotal = cashMoves
    .filter(m => m.tipo_movimiento === 'Ingreso')
    .reduce((sum, m) => sum + m.monto, 0);

  const outflowsTotal = cashMoves
    .filter(m => m.tipo_movimiento === 'Egreso')
    .reduce((sum, m) => sum + m.monto, 0);

  // Expected Cash in Drawer
  const expectedCash = initialCash + cashSalesTotal + inflowsTotal - outflowsTotal;
  const totalShiftSales = cashSalesTotal + nonCashSalesTotal;

  const handleCloseShiftSubmit = (e) => {
    e.preventDefault();
    if (!realCloseAmount || Number(realCloseAmount) < 0) {
      alert('Por favor, ingrese el monto final contado.');
      return;
    }

    const real = Number(realCloseAmount);
    const diff = real - expectedCash;

    const report = {
      montoApertura: initialCash,
      ventasEfectivo: cashSalesTotal,
      ventasTarjetas: nonCashSalesTotal,
      ingresosManuales: inflowsTotal,
      egresosManuales: outflowsTotal,
      efectivoEsperado: expectedCash,
      efectivoReal: real,
      diferencia: diff,
      estadoDiferencia: diff === 0 ? 'Cuadrado' : diff > 0 ? 'Sobrante' : 'Faltante',
      fechaCierre: new Date().toISOString()
    };

    closeShift(real);
    setCloseReport(report);
    setShowCloseSummary(true);

    // Reset forms
    setRealCloseAmount('');
    if (onShiftChange) onShiftChange();
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(val);
  };

  if (showCloseSummary && closeReport) {
    return (
      <div className="caja-main-container fade-in">
        <div className="caja-close-report-card bg-white-card">
          <div className="report-header">
            <div className="report-success-icon">✓</div>
            <h2>Arqueo de Caja Exitoso</h2>
            <p>El turno de caja ha sido cerrado correctamente.</p>
          </div>

          <div className="report-details-grid">
            <div className="detail-row">
              <span>Monto Apertura:</span>
              <span className="font-semibold">{formatCurrency(closeReport.montoApertura)}</span>
            </div>
            <div className="detail-row">
              <span>Ventas en Efectivo:</span>
              <span className="font-semibold">{formatCurrency(closeReport.ventasEfectivo)}</span>
            </div>
            <div className="detail-row">
              <span>Ventas Tarjetas/Transferencias:</span>
              <span className="font-semibold">{formatCurrency(closeReport.ventasTarjetas)}</span>
            </div>
            <div className="detail-row">
              <span>Ingresos Manuales (+):</span>
              <span className="font-semibold text-green">+{formatCurrency(closeReport.ingresosManuales)}</span>
            </div>
            <div className="detail-row">
              <span>Retiros/Egresos Manuales (-):</span>
              <span className="font-semibold text-red">-{formatCurrency(closeReport.egresosManuales)}</span>
            </div>
            <div className="detail-row total-highlight">
              <span>Efectivo Esperado:</span>
              <span className="font-bold">{formatCurrency(closeReport.efectivoEsperado)}</span>
            </div>
            <div className="detail-row total-highlight">
              <span>Efectivo Real Contado:</span>
              <span className="font-bold">{formatCurrency(closeReport.efectivoReal)}</span>
            </div>
            <div className={`detail-row diff-row ${closeReport.diferencia === 0 ? 'diff-ok' : closeReport.diferencia > 0 ? 'diff-pos' : 'diff-neg'}`}>
              <span>Diferencia ({closeReport.estadoDiferencia}):</span>
              <span className="font-bold">
                {closeReport.diferencia > 0 ? '+' : ''}{formatCurrency(closeReport.diferencia)}
              </span>
            </div>
          </div>

          <div className="report-footer">
            <button onClick={() => { setShowCloseSummary(false); setCloseReport(null); loadData(); }} className="report-btn">
              Aceptar y Continuar
            </button>
          </div>
        </div>

        <style>{`
          .caja-close-report-card {
            max-width: 500px;
            margin: 40px auto;
            padding: 30px;
            border-radius: var(--radius-lg);
            border: 1px solid var(--border);
            box-shadow: var(--shadow-lg);
            text-align: center;
          }
          .report-header {
            margin-bottom: 24px;
          }
          .report-success-icon {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 56px;
            height: 56px;
            background-color: var(--success-light);
            color: var(--success);
            font-size: 28px;
            border-radius: 50%;
            margin-bottom: 12px;
          }
          .report-header h2 {
            font-size: 20px;
            color: var(--secondary);
          }
          .report-header p {
            font-size: 13px;
            color: var(--text-light);
          }
          .report-details-grid {
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-bottom: 24px;
            background-color: var(--bg-main);
            padding: 16px;
            border-radius: var(--radius-md);
            text-align: left;
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            font-size: 13.5px;
            color: var(--text-secondary);
          }
          .total-highlight {
            border-top: 1px solid var(--border);
            padding-top: 8px;
            font-size: 14px;
            color: var(--text-primary);
          }
          .diff-row {
            border-top: 1.5px dashed var(--border);
            padding-top: 10px;
            font-size: 15px;
          }
          .diff-ok { color: var(--success); }
          .diff-pos { color: var(--warning); }
          .diff-neg { color: var(--danger); }
          
          .report-btn {
            width: 100%;
            padding: 12px;
            background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
            color: white;
            border: none;
            border-radius: var(--radius-sm);
            font-weight: 700;
            cursor: pointer;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="caja-main-container fade-in">
      {!activeShift || activeShift.estado === 'Cerrado' ? (
        /* Box is Closed, prompt to Open Box */
        <div className="caja-open-card bg-white-card">
          <div className="caja-card-header">
            <div className="lock-icon-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
            <h2>Caja Cerrada</h2>
            <p>Para operar en el punto de venta, debe aperturar un turno de caja.</p>
          </div>

          <form onSubmit={handleOpenShiftSubmit} className="caja-open-form">
            <div className="form-group">
              <label htmlFor="openAmount">Monto Inicial de Apertura ($)</label>
              <input
                type="number"
                id="openAmount"
                value={openAmount}
                onChange={(e) => setOpenAmount(e.target.value)}
                placeholder="Ej: 100000"
                className="caja-input"
                required
              />
              <span className="input-help-text">Efectivo inicial disponible en la gaveta.</span>
            </div>

            <button type="submit" className="open-caja-btn">
              Abrir Caja y Turno
            </button>
          </form>
        </div>
      ) : (
        /* Box is Open: Show Shift Status & Close actions */
        <div className="caja-active-panel-grid">
          {/* Left Side: Statistics & Shift summaries */}
          <div className="caja-summary-card bg-white-card">
            <div className="caja-card-title-section">
              <h2>Control de Turno Activo</h2>
              <span className="badge-active">TURNO ABIERTO</span>
            </div>

            <div className="caja-shift-meta">
              <div className="meta-item">
                <span className="meta-label">Apertura:</span>
                <span className="meta-val">{new Date(activeShift.fecha_apertura).toLocaleString()}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Usuario:</span>
                <span className="meta-val">Admin</span>
              </div>
            </div>

            <div className="caja-balance-list">
              <div className="balance-item">
                <span>Monto Inicial (Caja Chica)</span>
                <span className="font-semibold">{formatCurrency(initialCash)}</span>
              </div>
              <div className="balance-item">
                <span>Ventas registradas en Efectivo (+)</span>
                <span className="font-semibold text-green">+{formatCurrency(cashSalesTotal)}</span>
              </div>
              <div className="balance-item">
                <span>Ingresos Manuales (+)</span>
                <span className="font-semibold text-green">+{formatCurrency(inflowsTotal)}</span>
              </div>
              <div className="balance-item">
                <span>Retiros/Egresos Manuales (-)</span>
                <span className="font-semibold text-red">-{formatCurrency(outflowsTotal)}</span>
              </div>

              <div className="balance-item expected-cash-row">
                <span>Efectivo Estimado en Caja</span>
                <span className="font-bold">{formatCurrency(expectedCash)}</span>
              </div>

              <div className="balance-item non-cash-row">
                <span>Ventas Tarjeta / Transf. (Virtual)</span>
                <span className="font-semibold text-secondary">{formatCurrency(nonCashSalesTotal)}</span>
              </div>

              <div className="balance-item total-sales-row">
                <span>Ventas Totales del Turno</span>
                <span className="font-bold">{formatCurrency(totalShiftSales)}</span>
              </div>
            </div>

            {/* Close Form */}
            <form onSubmit={handleCloseShiftSubmit} className="caja-close-form">
              <div className="form-group">
                <label>Arqueo: Efectivo Real Contado ($)</label>
                <input
                  type="number"
                  placeholder="Ingrese el monto físico contado"
                  value={realCloseAmount}
                  onChange={(e) => setRealCloseAmount(e.target.value)}
                  className="caja-input"
                  required
                />
                <span className="input-help-text">Cuente todo el dinero físico en la gaveta y digítelo aquí.</span>
              </div>
              <button type="submit" className="close-caja-btn">
                Cerrar Caja y Registrar Arqueo
              </button>
            </form>
          </div>

          {/* Right Side: Adjustments (Cash moves) */}
          <div className="caja-moves-panel bg-white-card">
            <h3>Registrar Movimiento de Efectivo (Ajuste)</h3>

            <form onSubmit={handleAddMoveSubmit} className="caja-move-form">
              <div className="form-row-grid">
                <div className="form-group">
                  <label>Tipo de Ajuste</label>
                  <select
                    value={moveType}
                    onChange={(e) => setMoveType(e.target.value)}
                    className="caja-select"
                  >
                    <option value="Ingreso">Ingreso de Caja (Entrada)</option>
                    <option value="Egreso">Egreso de Caja (Retiro/Pago)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Monto ($)</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="Monto"
                    value={moveAmount}
                    onChange={(e) => setMoveAmount(e.target.value)}
                    className="caja-input"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Concepto / Detalle</label>
                <input
                  type="text"
                  placeholder="Ej: Pago de pan/insumos, Sencillo cambio"
                  value={moveConcept}
                  onChange={(e) => setMoveConcept(e.target.value)}
                  className="caja-input"
                  required
                />
              </div>

              <button type="submit" className="caja-btn-secondary">
                Registrar Movimiento
              </button>
            </form>

            <div className="moves-history-section">
              <h4>Historial del Turno ({cashMoves.length})</h4>
              {cashMoves.length === 0 ? (
                <div className="moves-empty">No se han registrado ajustes en este turno.</div>
              ) : (
                <div className="moves-list-scroll">
                  {cashMoves.map(move => (
                    <div key={move.id_movimiento} className="move-item-row">
                      <div className="move-item-left">
                        <span className={`move-badge ${move.tipo_movimiento === 'Ingreso' ? 'badge-in' : 'badge-out'}`}>
                          {move.tipo_movimiento === 'Ingreso' ? 'IN' : 'OUT'}
                        </span>
                        <div className="move-item-info">
                          <span className="move-concept">{move.concepto}</span>
                          <span className="move-time">{new Date(move.fecha_hora).toLocaleTimeString()}</span>
                        </div>
                      </div>
                      <span className={`move-amount ${move.tipo_movimiento === 'Ingreso' ? 'text-green' : 'text-red'}`}>
                        {move.tipo_movimiento === 'Ingreso' ? '+' : '-'}{formatCurrency(move.monto)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .caja-main-container {
          padding: 24px;
          padding-left: 284px; /* Sidebar offset */
          background-color: var(--bg-main);
          width: 100%;
          min-height: 100vh;
        }

        /* Closed Box Card */
        .caja-open-card {
          max-width: 480px;
          margin: 60px auto;
          padding: 40px;
          border-radius: var(--radius-lg);
          border: 1px solid var(--border);
          box-shadow: var(--shadow-lg);
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
          color: var(--secondary);
          margin-bottom: 4px;
        }

        .caja-card-header p {
          font-size: 13.5px;
          color: var(--text-secondary);
          margin-bottom: 24px;
        }

        .caja-open-form {
          text-align: left;
        }

        .caja-input,
        .caja-select {
          padding: 10px 14px;
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          font-size: 13.5px;
          width: 100%;
          outline: none;
          background-color: #fcfcfc;
          transition: var(--transition);
        }

        .caja-input:focus,
        .caja-select:focus {
          border-color: var(--primary);
          background-color: white;
        }

        .input-help-text {
          display: block;
          font-size: 11px;
          color: var(--text-light);
          margin-top: 4px;
        }

        .open-caja-btn {
          width: 100%;
          padding: 12px;
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
          color: white;
          border: none;
          border-radius: var(--radius-sm);
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          margin-top: 18px;
          box-shadow: var(--shadow-sm);
          transition: var(--transition);
        }

        .open-caja-btn:hover {
          background: var(--primary-hover);
          transform: translateY(-1px);
        }

        /* Active Grid Layout */
        .caja-active-panel-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .caja-summary-card,
        .caja-moves-panel {
          padding: 24px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border);
          box-shadow: var(--shadow-sm);
        }

        .caja-card-title-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .caja-card-title-section h2 {
          font-size: 18px;
          color: var(--secondary);
          font-weight: 700;
        }

        .badge-active {
          font-size: 10px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 12px;
          background-color: var(--success-light);
          color: var(--success);
        }

        .caja-shift-meta {
          background-color: var(--bg-main);
          border-radius: var(--radius-sm);
          padding: 10px 14px;
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          margin-bottom: 18px;
        }

        .meta-label {
          color: var(--text-light);
          margin-right: 4px;
        }

        .meta-val {
          font-weight: 600;
          color: var(--text-secondary);
        }

        .caja-balance-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 24px;
        }

        .balance-item {
          display: flex;
          justify-content: space-between;
          font-size: 13.5px;
          color: var(--text-secondary);
        }

        .expected-cash-row {
          border-top: 1.5px solid var(--border);
          border-bottom: 1.5px solid var(--border);
          padding: 8px 0;
          font-size: 14.5px;
          color: var(--text-primary);
        }

        .non-cash-row {
          font-size: 12.5px;
          color: var(--text-light);
        }

        .total-sales-row {
          border-bottom: 2px double var(--border);
          padding-bottom: 8px;
          font-size: 15px;
          color: var(--primary-dark);
        }

        .caja-close-form {
          border-top: 1px solid var(--border);
          padding-top: 18px;
        }

        .close-caja-btn {
          width: 100%;
          padding: 12px;
          background-color: var(--primary-dark);
          color: white;
          border: none;
          border-radius: var(--radius-sm);
          font-weight: 700;
          font-size: 13.5px;
          cursor: pointer;
          margin-top: 12px;
          transition: var(--transition);
        }

        .close-caja-btn:hover {
          background-color: var(--primary);
        }

        /* Moves adjusting panel (Right side) */
        .caja-moves-panel h3 {
          font-size: 16px;
          color: var(--secondary);
          font-weight: 700;
          margin-bottom: 16px;
        }

        .caja-move-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
          border-bottom: 1px solid var(--border);
          padding-bottom: 20px;
          margin-bottom: 20px;
        }

        .caja-btn-secondary {
          padding: 10px 14px;
          background-color: var(--bg-main);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          color: var(--text-primary);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition);
        }

        .caja-btn-secondary:hover {
          background-color: var(--border);
        }

        .moves-history-section h4 {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-secondary);
          margin-bottom: 10px;
        }

        .moves-empty {
          text-align: center;
          padding: 30px;
          font-size: 13px;
          color: var(--text-light);
        }

        .moves-list-scroll {
          max-height: 220px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .move-item-row {
          padding: 10px;
          background-color: var(--bg-main);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .move-item-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .move-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 22px;
          font-size: 9px;
          font-weight: 700;
          border-radius: 4px;
        }

        .move-badge.badge-in {
          background-color: var(--success-light);
          color: var(--success);
        }

        .move-badge.badge-out {
          background-color: var(--danger-light);
          color: var(--danger);
        }

        .move-item-info {
          display: flex;
          flex-direction: column;
        }

        .move-concept {
          font-size: 12.5px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .move-time {
          font-size: 10px;
          color: var(--text-light);
        }

        .move-amount {
          font-size: 13px;
          font-weight: 700;
        }

        /* Responsive Layout for Mobile */
        @media (max-width: 768px) {
          .caja-main-container {
            padding: 16px;
            padding-bottom: 80px;
            padding-top: 72px;
          }

          .caja-active-panel-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
        }
      `}</style>
    </div>
  );
}
