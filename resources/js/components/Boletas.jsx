import React, { useState, useEffect } from 'react';
import { getSales, getWithdrawals, transmitSalesToSII } from '../utils/db';

export default function Boletas() {
  const [sales, setSales] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [activeTab, setActiveTab] = useState('ventas'); // 'ventas' | 'retiros'
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Selection states
  const [selectedSaleIds, setSelectedSaleIds] = useState([]);
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [transmissionStep, setTransmissionStep] = useState(0); // 0: Idle, 1: Connecting, 2: Transmitting, 3: Completed

  // Modal details states
  const [selectedSale, setSelectedSale] = useState(null);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    // Get sales and sort by date descending
    const allSales = getSales().sort((a, b) => new Date(b.fecha_hora) - new Date(a.fecha_hora));
    setSales(allSales);

    // Get withdrawals and sort by date descending
    const allWithdrawals = getWithdrawals().sort((a, b) => new Date(b.fecha_hora) - new Date(a.fecha_hora));
    setWithdrawals(allWithdrawals);
  };

  // Filter sales for the selected date
  const filteredSales = sales.filter(s => {
    const saleDate = s.fecha_hora.split('T')[0];
    return saleDate === selectedDate;
  });

  // Filter withdrawals for the selected date
  const filteredWithdrawals = withdrawals.filter(w => {
    const wDate = w.fecha_hora.split('T')[0];
    return wDate === selectedDate;
  });

  // Checkbox functions
  const handleSelectSale = (id) => {
    setSelectedSaleIds(prev =>
      prev.includes(id) ? prev.filter(saleId => saleId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      // Select all visible sales that are currently 'Pendiente'
      const pendingIds = filteredSales
        .filter(s => s.estado_sii !== 'Enviada')
        .map(s => s.id_venta);
      setSelectedSaleIds(pendingIds);
    } else {
      setSelectedSaleIds([]);
    }
  };

  const handleTransmit = () => {
    if (selectedSaleIds.length === 0) return;

    setIsTransmitting(true);
    setTransmissionStep(1); // Connecting

    // Step 1: Connecting to SII (1s)
    setTimeout(() => {
      setTransmissionStep(2); // Transmitting

      // Step 2: Sending data (1.2s)
      setTimeout(() => {
        // Update database
        transmitSalesToSII(selectedSaleIds);

        // Reload local data
        loadHistory();
        setSelectedSaleIds([]);
        setTransmissionStep(3); // Completed

        // Step 3: Success message and close (0.8s)
        setTimeout(() => {
          setIsTransmitting(false);
          setTransmissionStep(0);
        }, 1200);

      }, 1500);

    }, 1200);
  };

  const handleViewDetails = (sale) => {
    setSelectedSale(sale);
    setShowDetailModal(true);
  };

  const handleViewWithdrawalDetails = (withdrawal) => {
    setSelectedWithdrawal(withdrawal);
    setShowWithdrawalModal(true);
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(val);
  };

  const allPendingTransmitted = filteredSales
    .filter(s => s.estado_sii !== 'Enviada').length > 0 &&
    selectedSaleIds.length === filteredSales.filter(s => s.estado_sii !== 'Enviada').length;

  return (
    <div className="historial-container fade-in">
      {/* Header section */}
      <div className="historial-header">
        <div className="historial-title-info">
          <h2>Boletas Emitidas</h2>
          <p>Consulte y gestione la transmisión de boletas al SII.</p>
        </div>

        <div className="historial-actions">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="date-picker-input"
          />
        </div>
      </div>

      {/* Segmented control tabs */}
      <div className="historial-tabs">
        <button
          onClick={() => setActiveTab('ventas')}
          className={`history-tab-btn ${activeTab === 'ventas' ? 'active' : ''}`}
        >
          Boletas de Ventas ({filteredSales.length})
        </button>
        <button
          onClick={() => setActiveTab('retiros')}
          className={`history-tab-btn ${activeTab === 'retiros' ? 'active' : ''}`}
        >
          Retiros Dueños ({filteredWithdrawals.length})
        </button>
      </div>

      {/* Main Table card */}
      <div className="historial-table-card bg-white-card">
        <div className="table-responsive">
          {activeTab === 'ventas' ? (
            <>
              <table className="historial-table">
                <thead>
                  <tr>
                    <th>FOLIO / ID</th>
                    <th>HORA</th>
                    <th>MÉTODO DE PAGO</th>
                    <th className="text-right">TOTAL</th>
                    <th className="text-center">ESTADO SII</th>
                    <th className="text-center">ACCIONES</th>
                    <th className="text-center" style={{ width: '120px' }}>
                      <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: '800' }}>
                        <input
                          type="checkbox"
                          checked={allPendingTransmitted}
                          onChange={handleSelectAll}
                          disabled={filteredSales.filter(s => s.estado_sii !== 'Enviada').length === 0}
                        />
                        TODOS
                      </label>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSales.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="table-empty-row">
                        No hay boletas registradas en esta fecha.
                      </td>
                    </tr>
                  ) : (
                    filteredSales.map(sale => {
                      const isPending = (sale.estado_sii || 'Pendiente') === 'Pendiente';
                      const isSelected = selectedSaleIds.includes(sale.id_venta);
                      return (
                        <tr key={sale.id_venta}>
                          <td className="font-bold text-mono">#{String(sale.id_venta).slice(-6)}</td>
                          <td>{new Date(sale.fecha_hora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                          <td>
                            <span className={`payment-badge ${sale.metodo_pago.replace(/\s+/g, '-').toLowerCase()}`}>
                              {sale.metodo_pago}
                            </span>
                          </td>
                          <td className="text-right font-bold text-primary">{formatCurrency(sale.total_venta)}</td>
                          <td className="text-center">
                            <span className={`sii-status-badge ${isPending ? 'pending' : 'sent'}`}>
                              {isPending ? '⚠️ Pendiente' : '☁️ Enviada'}
                            </span>
                          </td>
                          <td className="text-center">
                            <button
                              onClick={() => handleViewDetails(sale)}
                              className="view-details-btn"
                              title="Ver detalle del ticket"
                            >
                              Detalle
                            </button>
                          </td>
                          <td className="text-center">
                            {isPending ? (
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleSelectSale(sale.id_venta)}
                                style={{ transform: 'scale(1.2)', cursor: 'pointer' }}
                              />
                            ) : (
                              <span style={{ color: 'var(--success)', fontWeight: 'bold', fontSize: '13px' }}>✓ Enviada</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>

              {/* Botón enviar boletas */}
              {filteredSales.length > 0 && (
                <div className="boletas-bottom-toolbar">
                  <div className="selection-info">
                    {selectedSaleIds.length > 0 ? (
                      <span><strong>{selectedSaleIds.length}</strong> boletas seleccionadas para transmisión.</span>
                    ) : (
                      <span>Seleccione boletas pendientes para enviar al SII.</span>
                    )}
                  </div>
                  <button
                    onClick={handleTransmit}
                    disabled={selectedSaleIds.length === 0}
                    className="transmit-btn-primary"
                  >
                    Enviar Boletas seleccionadas al SII
                  </button>
                </div>
              )}
            </>
          ) : (
            <table className="historial-table">
              <thead>
                <tr>
                  <th>RET. / ID</th>
                  <th>HORA</th>
                  <th>PRODUCTOS RETIRADOS</th>
                  <th className="text-center">ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {filteredWithdrawals.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="table-empty-row">
                      No hay retiros registrados en esta fecha.
                    </td>
                  </tr>
                ) : (
                  filteredWithdrawals.map(w => (
                    <tr key={w.id_retiro}>
                      <td className="font-bold text-mono">#{String(w.id_retiro).slice(-6)}</td>
                      <td>{new Date(w.fecha_hora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                      <td>
                        <span style={{ fontSize: '13px', fontWeight: '500' }}>
                          {w.items.map(i => `${i.nombre} (${i.cantidad} ${i.presentacion})`).join(', ')}
                        </span>
                      </td>
                      <td className="text-center">
                        <button
                          onClick={() => handleViewWithdrawalDetails(w)}
                          className="view-details-btn"
                          title="Ver detalle del retiro"
                        >
                          Detalle
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* SII Transmission Loader Overlay */}
      {isTransmitting && (
        <div className="modal-overlay" style={{ zIndex: 300 }}>
          <div className="sii-loading-modal">
            {transmissionStep === 1 && (
              <>
                <div className="sii-spinner"></div>
                <h3>Conectando al SII...</h3>
                <p>Estableciendo canal de transmisión seguro con el Servicio de Impuestos Internos de Chile.</p>
              </>
            )}
            {transmissionStep === 2 && (
              <>
                <div className="sii-spinner transmitting"></div>
                <h3>Transmitiendo Boletas...</h3>
                <p>Enviando {selectedSaleIds.length} folios y firmas electrónicas. Por favor, no cierre el navegador.</p>
              </>
            )}
            {transmissionStep === 3 && (
              <>
                <div className="sii-success-check">
                  <svg xmlns="http://www.w3.org/2000/svg" width="54" height="54" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <h3>¡Transmisión Exitosa!</h3>
                <p>Boletas recibidas y validadas por el SII. Los folios correspondientes han sido marcados como Enviados.</p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Sale Detail Modal Overlay */}
      {showDetailModal && selectedSale && (
        <div className="modal-overlay">
          <div className="detail-modal fade-in">
            <div className="modal-header">
              <h3>Detalle de Venta #{String(selectedSale.id_venta).slice(-6)}</h3>
              <button onClick={() => { setShowDetailModal(false); setSelectedSale(null); }} className="close-btn">&times;</button>
            </div>

            <div className="sale-details-meta">
              <div><strong>Fecha:</strong> {new Date(selectedSale.fecha_hora).toLocaleDateString()}</div>
              <div><strong>Hora:</strong> {new Date(selectedSale.fecha_hora).toLocaleTimeString()}</div>
              <div><strong>Responsable:</strong> Dueño/Admin</div>
              <div><strong>Método de Pago:</strong> {selectedSale.metodo_pago}</div>
              <div style={{ gridColumn: 'span 2' }}>
                <strong>Estado Transmisión SII:</strong>{' '}
                <span className={`sii-status-badge ${(selectedSale.estado_sii || 'Pendiente') === 'Pendiente' ? 'pending' : 'sent'}`}>
                  {(selectedSale.estado_sii || 'Pendiente') === 'Pendiente' ? '⚠️ Pendiente' : '☁️ Enviada'}
                </span>
              </div>
            </div>

            <div className="detail-items-table-wrapper">
              <table className="items-detail-table">
                <thead>
                  <tr>
                    <th>PRODUCTO</th>
                    <th className="text-right">CANTIDAD / PESO</th>
                    <th className="text-right">PRECIO UNIT.</th>
                    <th className="text-right">SUBTOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedSale.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="font-semibold">{item.nombre}</td>
                      <td className="text-right">{item.cantidad}</td>
                      <td className="text-right">{formatCurrency(item.precio_unitario)}</td>
                      <td className="text-right font-bold">{formatCurrency(item.subtotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="detail-totals-box">
              <div className="detail-totals-row">
                <span>Subtotal:</span>
                <span>{formatCurrency(selectedSale.subtotal)}</span>
              </div>
              <div className="detail-totals-row text-red">
                <span>Descuento:</span>
                <span>-{formatCurrency(selectedSale.descuento)}</span>
              </div>
              <div className="detail-totals-row total-highlight">
                <span>TOTAL NETO:</span>
                <span>{formatCurrency(selectedSale.total_venta)}</span>
              </div>
            </div>

            <div className="modal-footer">
              <button onClick={() => { setShowDetailModal(false); setSelectedSale(null); }} className="modal-btn-confirm">
                Cerrar Detalle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Withdrawal Detail Modal Overlay */}
      {showWithdrawalModal && selectedWithdrawal && (
        <div className="modal-overlay">
          <div className="detail-modal fade-in" style={{ borderTopColor: '#4b5563' }}>
            <div className="modal-header">
              <h3>Detalle de Retiro Dueño #{String(selectedWithdrawal.id_retiro).slice(-6)}</h3>
              <button onClick={() => { setShowWithdrawalModal(false); setSelectedWithdrawal(null); }} className="close-btn">&times;</button>
            </div>

            <div className="sale-details-meta" style={{ gridTemplateColumns: '1fr' }}>
              <div><strong>Fecha y Hora:</strong> {new Date(selectedWithdrawal.fecha_hora).toLocaleString()}</div>
              <div><strong>Tipo de Operación:</strong> Retiro Dueño / Autoconsumo (Sin Costo)</div>
              <div><strong>Destino:</strong> Consumo familiar o ajuste de stock</div>
            </div>

            <div className="detail-items-table-wrapper" style={{ marginBottom: '10px' }}>
              <table className="items-detail-table">
                <thead>
                  <tr style={{ background: '#f3f4f6' }}>
                    <th>PRODUCTO RETIRADO</th>
                    <th className="text-right">CANTIDAD / PESO RETIRADO</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedWithdrawal.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="font-semibold">{item.nombre}</td>
                      <td className="text-right font-bold">{item.cantidad} {item.presentacion}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ padding: '12px', background: '#fcfcfc', border: '1px dashed var(--border)', borderRadius: '6px', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: '1.4' }}>
              Este movimiento descontó stock del inventario pero no generó ingresos en efectivo ni transacciones financieras en el balance de caja.
            </div>

            <div className="modal-footer">
              <button onClick={() => { setShowWithdrawalModal(false); setSelectedWithdrawal(null); }} className="modal-btn-confirm" style={{ background: '#4b5563', color: 'white' }}>
                Cerrar Detalle
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .historial-container {
          padding: 24px;
          padding-left: 284px; /* Sidebar offset + padding */
          background-color: var(--bg-main);
          width: 100%;
          min-height: 100vh;
        }

        .historial-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .historial-title-info h2 {
          font-size: 22px;
          color: var(--secondary);
          font-weight: 700;
        }

        .historial-title-info p {
          font-size: 13px;
          color: var(--text-secondary);
        }

        .date-picker-input {
          padding: 8px 12px;
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          font-size: 13px;
          outline: none;
          background-color: var(--bg-card);
        }

        .historial-tabs {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
          border-bottom: 1px solid var(--border);
          padding-bottom: 10px;
        }

        .history-tab-btn {
          padding: 10px 16px;
          background-color: transparent;
          border: none;
          font-size: 13px;
          font-weight: 600;
          color: var(--text-secondary);
          cursor: pointer;
          border-radius: 4px;
          transition: var(--transition);
        }

        .history-tab-btn:hover {
          background-color: var(--border);
          color: var(--text-primary);
        }

        .history-tab-btn.active {
          background-color: var(--primary-light);
          color: var(--primary);
        }

        .historial-table-card {
          padding: 20px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border);
          box-shadow: var(--shadow-sm);
        }

        .table-responsive {
          width: 100%;
          overflow-x: auto;
        }

        .historial-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .historial-table th {
          padding: 12px 16px;
          border-bottom: 2px solid var(--border);
          color: var(--text-secondary);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .historial-table td {
          padding: 14px 16px;
          border-bottom: 1px solid var(--border);
          font-size: 13.5px;
        }

        .historial-table tbody tr:hover {
          background-color: var(--bg-main);
        }

        .table-empty-row {
          text-align: center;
          color: var(--text-light);
          padding: 40px !important;
        }

        .text-mono {
          font-family: monospace;
          font-size: 13px;
        }

        .text-right { text-align: right !important; }
        .text-center { text-align: center !important; }
        .font-semibold { font-weight: 600; }
        .font-bold { font-weight: 700; }
        .text-red { color: var(--danger); }
        .text-primary { color: var(--primary-dark); }

        .payment-badge {
          display: inline-block;
          font-size: 10px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 12px;
          text-transform: uppercase;
        }

        .payment-badge.efectivo {
          background-color: var(--success-light);
          color: var(--success);
        }

        .payment-badge.tarjeta-de-débito,
        .payment-badge.tarjeta-de-crédito {
          background-color: #eff6ff;
          color: #2563eb;
        }

        .payment-badge.transferencia {
          background-color: #fff7ed;
          color: #d97706;
        }

        .sii-status-badge {
          display: inline-block;
          font-size: 11px;
          font-weight: 600;
          padding: 3px 8px;
          border-radius: 4px;
        }

        .sii-status-badge.pending {
          background-color: var(--warning-light);
          color: var(--warning);
        }

        .sii-status-badge.sent {
          background-color: var(--success-light);
          color: var(--success);
        }

        .view-details-btn {
          padding: 6px 12px;
          background-color: var(--bg-main);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          font-size: 12px;
          font-weight: 600;
          color: var(--text-secondary);
          cursor: pointer;
          transition: var(--transition);
        }

        .view-details-btn:hover {
          border-color: var(--primary);
          color: var(--primary);
          background-color: var(--primary-light);
        }

        .boletas-bottom-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: #fafafa;
          border: 1px solid var(--border);
          padding: 16px 20px;
          border-radius: var(--radius-sm);
          margin-top: 20px;
        }

        .selection-info {
          font-size: 13px;
          color: var(--text-secondary);
        }

        .transmit-btn-primary {
          padding: 10px 18px;
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
          color: white;
          border: none;
          font-weight: 700;
          font-size: 13px;
          border-radius: var(--radius-sm);
          cursor: pointer;
          box-shadow: var(--shadow-sm);
          transition: var(--transition);
        }

        .transmit-btn-primary:hover:not(:disabled) {
          background: var(--primary-hover);
          transform: translateY(-1px);
        }

        .transmit-btn-primary:disabled {
          background: var(--border);
          color: var(--text-light);
          cursor: not-allowed;
          box-shadow: none;
        }

        /* Loading modal for SII */
        .sii-loading-modal {
          width: 380px;
          background-color: var(--bg-card);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-lg);
          padding: 30px;
          text-align: center;
        }

        .sii-loading-modal h3 {
          font-size: 17px;
          font-weight: 700;
          color: var(--primary-dark);
          margin-top: 16px;
        }

        .sii-loading-modal p {
          font-size: 12.5px;
          color: var(--text-secondary);
          margin-top: 6px;
          line-height: 1.4;
        }

        .sii-spinner {
          display: inline-block;
          width: 48px;
          height: 48px;
          border: 4px solid var(--border);
          border-top: 4px solid var(--primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .sii-spinner.transmitting {
          border-top-color: #2563eb;
        }

        .sii-success-check {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 64px;
          height: 64px;
          background-color: var(--success-light);
          color: var(--success);
          border-radius: 50%;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Detail Modal */
        .detail-modal {
          width: 520px;
          background-color: var(--bg-card);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-lg);
          padding: 24px;
          border-top: 6px solid var(--primary);
        }

        .sale-details-meta {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          background-color: var(--bg-main);
          padding: 12px;
          border-radius: var(--radius-sm);
          font-size: 13px;
          margin-bottom: 20px;
        }

        .detail-items-table-wrapper {
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          overflow: hidden;
          margin-bottom: 20px;
        }

        .items-detail-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .items-detail-table th {
          background-color: var(--bg-main);
          padding: 10px 14px;
          font-size: 10px;
          font-weight: 700;
          color: var(--text-secondary);
          text-transform: uppercase;
        }

        .items-detail-table td {
          padding: 10px 14px;
          border-bottom: 1px solid var(--border);
          font-size: 13px;
        }

        .items-detail-table tr:last-child td {
          border-bottom: none;
        }

        .detail-totals-box {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 14px;
          background-color: #fafafa;
          border-radius: var(--radius-sm);
          margin-bottom: 20px;
        }

        .detail-totals-row {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          color: var(--text-secondary);
        }

        .total-highlight {
          border-top: 1px solid var(--border);
          padding-top: 6px;
          font-size: 15px;
          font-weight: 800;
          color: var(--primary-dark);
        }

        /* Responsive styling */
        @media (max-width: 768px) {
          .historial-container {
            padding: 16px;
            padding-bottom: 80px;
            padding-top: 72px;
          }

          .historial-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
        }
      `}</style>
    </div>
  );
}
