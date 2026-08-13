import React, { useState, useEffect } from 'react';
import { getFacturasRecibidas, aceptarFactura, reclamarFactura, ingresarStockFactura } from '../utils/db';

export default function FacturasRecibidas() {
  const [facturas, setFacturas] = useState([]);
  const [selectedFactura, setSelectedFactura] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showReclamoModal, setShowReclamoModal] = useState(false);
  const [showStockResultModal, setShowStockResultModal] = useState(false);
  const [stockResult, setStockResult] = useState(null);
  const [tipoReclamo, setTipoReclamo] = useState('');
  const [motivoReclamo, setMotivoReclamo] = useState('');
  const [filterEstado, setFilterEstado] = useState('Todas');
  const [confirmAccept, setConfirmAccept] = useState(false);

  useEffect(() => {
    loadFacturas();
  }, []);

  const loadFacturas = () => {
    const all = getFacturasRecibidas().sort((a, b) =>
      new Date(b.fecha_recepcion_sii) - new Date(a.fecha_recepcion_sii)
    );
    setFacturas(all);
  };

  const filteredFacturas = facturas.filter(f => {
    if (filterEstado === 'Todas') return true;
    return f.estado === filterEstado;
  });

  const formatCurrency = (val) =>
    new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(val);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const formatDateTime = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const getEstadoBadge = (estado) => {
    switch (estado) {
      case 'Pendiente': return 'badge-pendiente';
      case 'Aceptada': return 'badge-aceptada';
      case 'Reclamada': return 'badge-reclamada';
      default: return '';
    }
  };

  const handleOpenDetail = (factura) => {
    setSelectedFactura(factura);
    setShowDetail(true);
    setConfirmAccept(false);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setSelectedFactura(null);
    setConfirmAccept(false);
  };

  const handleAceptar = () => {
    if (!confirmAccept) {
      setConfirmAccept(true);
      return;
    }
    aceptarFactura(selectedFactura.id_dte);
    // Si aún no se ingresó el stock, preguntar o procesar la carga automática de stock
    if (!selectedFactura.stock_ingresado) {
      try {
        const res = ingresarStockFactura(selectedFactura.id_dte);
        setStockResult(res);
        setShowStockResultModal(true);
      } catch (err) {
        console.warn('Auto stock error:', err);
      }
    }
    loadFacturas();
    setConfirmAccept(false);
    const updated = getFacturasRecibidas().find(f => f.id_dte === selectedFactura.id_dte);
    setSelectedFactura(updated);
  };

  const handleIngresarStockManual = () => {
    try {
      const res = ingresarStockFactura(selectedFactura.id_dte);
      loadFacturas();
      const updated = getFacturasRecibidas().find(f => f.id_dte === selectedFactura.id_dte);
      setSelectedFactura(updated);
      setStockResult(res);
      setShowStockResultModal(true);
    } catch (err) {
      alert(err.message || 'Error al ingresar el stock.');
    }
  };

  const handleOpenReclamo = () => {
    setShowReclamoModal(true);
    setTipoReclamo('');
    setMotivoReclamo('');
  };

  const handleSubmitReclamo = () => {
    if (!tipoReclamo || !motivoReclamo.trim()) return;
    reclamarFactura(selectedFactura.id_dte, tipoReclamo, motivoReclamo);
    loadFacturas();
    setShowReclamoModal(false);
    const updated = getFacturasRecibidas().find(f => f.id_dte === selectedFactura.id_dte);
    setSelectedFactura(updated);
  };

  const pendientesCount = facturas.filter(f => f.estado === 'Pendiente').length;
  const urgentesCount = facturas.filter(f => f.estado === 'Pendiente' && f.dias_restantes <= 2).length;

  return (
    <div className="facturas-container fade-in">
      {/* Header */}
      <div className="facturas-header">
        <div className="facturas-title-section">
          <h2 className="facturas-title">Facturas Recibidas</h2>
          <p className="facturas-subtitle">Documentos tributarios electrónicos recibidos de proveedores (DTE 33)</p>
        </div>
        <div className="facturas-stats">
          {pendientesCount > 0 && (
            <div className="stat-chip stat-pendiente">
              <span className="stat-dot dot-pendiente"></span>
              {pendientesCount} pendiente{pendientesCount > 1 ? 's' : ''}
            </div>
          )}
          {urgentesCount > 0 && (
            <div className="stat-chip stat-urgente">
              <span className="stat-dot dot-urgente"></span>
              {urgentesCount} urgente{urgentesCount > 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>

      {/* Filtros */}
      <div className="facturas-filters">
        {['Todas', 'Pendiente', 'Aceptada', 'Reclamada'].map(estado => (
          <button
            key={estado}
            onClick={() => setFilterEstado(estado)}
            className={`filter-btn ${filterEstado === estado ? 'active' : ''}`}
          >
            {estado === 'Todas' ? 'Todas' : estado + 's'}
            {estado !== 'Todas' && (
              <span className="filter-count">
                {facturas.filter(f => estado === 'Todas' ? true : f.estado === estado).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tabla/Listado */}
      <div className="facturas-table-wrapper">
        {filteredFacturas.length === 0 ? (
          <div className="facturas-empty">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
            </svg>
            <p>No hay facturas con el filtro seleccionado</p>
          </div>
        ) : (
          <table className="facturas-table">
            <thead>
              <tr>
                <th>Estado</th>
                <th>Folio</th>
                <th>Fecha Emisión</th>
                <th>Proveedor</th>
                <th>Total</th>
                <th>Plazo</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {filteredFacturas.map(f => (
                <tr key={f.id_dte} className={f.estado === 'Pendiente' && f.dias_restantes <= 2 ? 'row-urgente' : ''}>
                  <td>
                    <span className={`estado-badge ${getEstadoBadge(f.estado)}`}>
                      {f.estado}
                    </span>
                    {f.stock_ingresado && (
                      <span className="stock-ingresado-badge">
                        📦 Stock Cargado
                      </span>
                    )}
                  </td>
                  <td className="td-folio">N° {f.folio}</td>
                  <td>{formatDate(f.fecha_emision)}</td>
                  <td className="td-proveedor">
                    <span className="proveedor-nombre">{f.razon_social_emisor}</span>
                    <span className="proveedor-rut">{f.rut_emisor}</span>
                  </td>
                  <td className="td-total">{formatCurrency(f.monto_total)}</td>
                  <td>
                    {f.estado === 'Pendiente' ? (
                      <span className={`dias-badge ${f.dias_restantes <= 2 ? 'dias-urgente' : 'dias-normal'}`}>
                        {f.dias_restantes} día{f.dias_restantes !== 1 ? 's' : ''}
                      </span>
                    ) : (
                      <span className="dias-badge dias-procesada">—</span>
                    )}
                  </td>
                  <td>
                    <button onClick={() => handleOpenDetail(f)} className="btn-ver-detalle">
                      Ver Detalle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Info legal */}
      <div className="facturas-info-legal">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
        <span>Según la Ley 19.983, dispone de <strong>8 días corridos</strong> desde la recepción en el SII para aceptar o reclamar. Si no actúa, la factura se acepta automáticamente.</span>
      </div>

      {/* Modal de Detalle */}
      {showDetail && selectedFactura && (
        <div className="modal-overlay" onClick={handleCloseDetail}>
          <div className="modal-content factura-detail-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Factura Electrónica N° {selectedFactura.folio}</h3>
              <button onClick={handleCloseDetail} className="close-btn">&times;</button>
            </div>

            <div className="factura-detail-body">
              {/* Estado */}
              <div className="detail-estado-row">
                <span className={`estado-badge estado-badge-lg ${getEstadoBadge(selectedFactura.estado)}`}>
                  {selectedFactura.estado}
                </span>
                {selectedFactura.estado === 'Pendiente' && (
                  <span className={`dias-badge ${selectedFactura.dias_restantes <= 2 ? 'dias-urgente' : 'dias-normal'}`}>
                    {selectedFactura.dias_restantes} día{selectedFactura.dias_restantes !== 1 ? 's' : ''} restantes para actuar
                  </span>
                )}
                {selectedFactura.estado === 'Reclamada' && selectedFactura.tipo_reclamo && (
                  <span className="reclamo-tipo-badge">{selectedFactura.tipo_reclamo}</span>
                )}
              </div>

              {/* Datos del emisor */}
              <div className="detail-section">
                <h4 className="detail-section-title">Datos del Proveedor (Emisor)</h4>
                <div className="detail-grid">
                  <div className="detail-field">
                    <span className="detail-label">Razón Social</span>
                    <span className="detail-value">{selectedFactura.razon_social_emisor}</span>
                  </div>
                  <div className="detail-field">
                    <span className="detail-label">RUT</span>
                    <span className="detail-value">{selectedFactura.rut_emisor}</span>
                  </div>
                  <div className="detail-field">
                    <span className="detail-label">Giro</span>
                    <span className="detail-value">{selectedFactura.giro_emisor}</span>
                  </div>
                  <div className="detail-field">
                    <span className="detail-label">Tipo DTE</span>
                    <span className="detail-value">Factura Electrónica (Tipo {selectedFactura.tipo_dte})</span>
                  </div>
                  <div className="detail-field">
                    <span className="detail-label">Fecha Emisión</span>
                    <span className="detail-value">{formatDate(selectedFactura.fecha_emision)}</span>
                  </div>
                  <div className="detail-field">
                    <span className="detail-label">Recepción SII</span>
                    <span className="detail-value">{formatDateTime(selectedFactura.fecha_recepcion_sii)}</span>
                  </div>
                </div>
              </div>

              {/* Items de la factura */}
              <div className="detail-section">
                <h4 className="detail-section-title">Detalle de Productos / Servicios</h4>
                <table className="detail-items-table">
                  <thead>
                    <tr>
                      <th>Descripción</th>
                      <th>Cant.</th>
                      <th>Unidad</th>
                      <th>P. Unit.</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedFactura.items.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.descripcion}</td>
                        <td className="td-center">{item.cantidad}</td>
                        <td className="td-center">{item.unidad}</td>
                        <td className="td-right">{formatCurrency(item.precio_unitario)}</td>
                        <td className="td-right">{formatCurrency(item.subtotal)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totales */}
              <div className="detail-totals">
                <div className="total-row">
                  <span>Monto Neto</span>
                  <span>{formatCurrency(selectedFactura.monto_neto)}</span>
                </div>
                <div className="total-row">
                  <span>IVA (19%)</span>
                  <span>{formatCurrency(selectedFactura.iva)}</span>
                </div>
                <div className="total-row total-final">
                  <span>Total</span>
                  <span>{formatCurrency(selectedFactura.monto_total)}</span>
                </div>
              </div>

              {/* Observaciones */}
              {selectedFactura.observaciones && (
                <div className="detail-section">
                  <h4 className="detail-section-title">Observaciones</h4>
                  <p className="detail-observaciones">{selectedFactura.observaciones}</p>
                </div>
              )}

              {/* Info de reclamo si fue reclamada */}
              {selectedFactura.estado === 'Reclamada' && (
                <div className="detail-section reclamo-info-section">
                  <h4 className="detail-section-title">Información del Reclamo</h4>
                  <div className="detail-grid">
                    <div className="detail-field">
                      <span className="detail-label">Tipo de Reclamo</span>
                      <span className="detail-value">{selectedFactura.tipo_reclamo}</span>
                    </div>
                    <div className="detail-field">
                      <span className="detail-label">Fecha de Reclamo</span>
                      <span className="detail-value">{selectedFactura.fecha_reclamo ? formatDateTime(selectedFactura.fecha_reclamo) : '—'}</span>
                    </div>
                  </div>
                  <div className="detail-field" style={{ marginTop: '8px' }}>
                    <span className="detail-label">Motivo</span>
                    <p className="detail-observaciones">{selectedFactura.motivo_reclamo}</p>
                  </div>
                </div>
              )}

              {/* Info de carga de stock */}
              {selectedFactura.stock_ingresado ? (
                <div className="detail-section stock-ingresado-info-section">
                  <p className="stock-ingresado-info-text">
                    📦 Mercadería cargada al inventario del POS el {formatDateTime(selectedFactura.fecha_ingreso_stock)}
                  </p>
                </div>
              ) : (
                selectedFactura.estado !== 'Reclamada' && (
                  <div className="detail-section stock-pending-info-section">
                    <p className="stock-pending-info-text">
                      💡 Puede cargar la mercadería de esta factura directamente al inventario (los productos nuevos se crearán automáticamente).
                    </p>
                  </div>
                )
              )}

              {/* Info de aceptación */}
              {selectedFactura.estado === 'Aceptada' && selectedFactura.fecha_aceptacion && (
                <div className="detail-section aceptada-info-section">
                  <p className="aceptada-info-text">
                    ✓ Factura aceptada el {formatDateTime(selectedFactura.fecha_aceptacion)}. Crédito fiscal IVA habilitado.
                  </p>
                </div>
              )}
            </div>

            {/* Acciones */}
            <div className="modal-footer">
              <button type="button" onClick={handleCloseDetail} className="modal-btn-cancel">
                Cerrar
              </button>
              {!selectedFactura.stock_ingresado && selectedFactura.estado !== 'Reclamada' && (
                <button type="button" onClick={handleIngresarStockManual} className="btn-ingresar-stock">
                  📦 Cargar Mercadería al Stock
                </button>
              )}
              {selectedFactura.estado === 'Pendiente' && (
                <>
                  <button type="button" onClick={handleOpenReclamo} className="btn-reclamar">
                    ✗ Reclamar
                  </button>
                  <button type="button" onClick={handleAceptar} className="btn-aceptar">
                    {confirmAccept ? '¿Confirmar? (Irrevocable)' : '✓ Aceptar Factura'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Reclamo */}
      {showReclamoModal && (
        <div className="modal-overlay" onClick={() => setShowReclamoModal(false)}>
          <div className="modal-content reclamo-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Reclamar Factura N° {selectedFactura.folio}</h3>
              <button onClick={() => setShowReclamoModal(false)} className="close-btn">&times;</button>
            </div>

            <div className="reclamo-body">
              <div className="reclamo-warning">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                <span>Al reclamar esta factura, el proveedor deberá emitir una Nota de Crédito. El crédito fiscal IVA de este documento quedará inhabilitado.</span>
              </div>

              <div className="form-group">
                <label>Tipo de Reclamo</label>
                <div className="reclamo-tipos">
                  {[
                    'Reclamo al contenido del DTE',
                    'Falta parcial de mercaderías',
                    'Falta total de mercaderías'
                  ].map(tipo => (
                    <button
                      key={tipo}
                      type="button"
                      onClick={() => setTipoReclamo(tipo)}
                      className={`reclamo-tipo-btn ${tipoReclamo === tipo ? 'active' : ''}`}
                    >
                      {tipo}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Motivo del Reclamo</label>
                <textarea
                  value={motivoReclamo}
                  onChange={e => setMotivoReclamo(e.target.value)}
                  placeholder="Describa el motivo del reclamo en detalle (ej: Faltaron 5kg de entraña del pedido)..."
                  className="reclamo-textarea"
                  rows={4}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" onClick={() => setShowReclamoModal(false)} className="modal-btn-cancel">
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSubmitReclamo}
                className="btn-confirmar-reclamo"
                disabled={!tipoReclamo || !motivoReclamo.trim()}
              >
                Confirmar Reclamo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Resultado de Carga de Stock */}
      {showStockResultModal && stockResult && (
        <div className="modal-overlay" onClick={() => setShowStockResultModal(false)}>
          <div className="modal-content stock-result-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>📦 Carga de Inventario Completada</h3>
              <button onClick={() => setShowStockResultModal(false)} className="close-btn">&times;</button>
            </div>

            <div className="stock-result-body">
              <div className="stock-result-banner">
                <span className="stock-result-icon">🎉</span>
                <div>
                  <p className="stock-result-title">¡Mercadería ingresada al POS con éxito!</p>
                  <p className="stock-result-subtitle">
                    Se actualizaron {stockResult.actualizados} producto(s) existentes y se registraron {stockResult.creados} producto(s) nuevo(s) en el catálogo.
                  </p>
                </div>
              </div>

              <h4 className="detail-section-title" style={{ marginTop: '16px' }}>Desglose de Productos Procesados</h4>
              <div className="stock-result-list">
                {stockResult.itemsIngresados.map((item, idx) => (
                  <div key={idx} className={`stock-result-item ${item.tipo === 'creado' ? 'item-creado' : 'item-actualizado'}`}>
                    <div className="item-info">
                      <span className="item-name">{item.nombre}</span>
                      <span className="item-type-tag">
                        {item.tipo === 'creado' ? '✨ NUEVO PRODUCTO CREADO' : '🔄 STOCK ACTUALIZADO'}
                      </span>
                    </div>
                    <div className="item-qty">
                      <span className="added-qty">+{item.cantidad}</span>
                      <span className="total-stock">Stock total: {item.nuevoStock}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" onClick={() => setShowStockResultModal(false)} className="btn-aceptar">
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .facturas-container {
          padding: 24px;
          padding-left: 284px; /* Sidebar offset + padding */
          background-color: var(--bg-main);
          width: 100%;
          min-height: 100vh;
        }

        .facturas-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 24px;
        }

        .facturas-title {
          font-size: 22px;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 4px;
        }

        .facturas-subtitle {
          font-size: 13px;
          color: var(--text-light);
          margin: 0;
        }

        .facturas-stats {
          display: flex;
          gap: 8px;
        }

        .stat-chip {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        .stat-pendiente {
          background: #fef9c3;
          color: #854d0e;
        }

        .stat-urgente {
          background: #fee2e2;
          color: #991b1b;
          animation: pulse-urgente 2s ease-in-out infinite;
        }

        @keyframes pulse-urgente {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        .stat-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .dot-pendiente { background: #eab308; }
        .dot-urgente { background: #dc2626; }

        /* Filtros */
        .facturas-filters {
          display: flex;
          gap: 6px;
          margin-bottom: 16px;
        }

        .filter-btn {
          padding: 8px 14px;
          border: 1px solid var(--border);
          background: var(--bg-card);
          border-radius: var(--radius-sm);
          font-size: 13px;
          font-weight: 500;
          color: var(--text-secondary);
          cursor: pointer;
          transition: var(--transition);
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .filter-btn:hover {
          border-color: var(--primary);
          color: var(--primary);
        }

        .filter-btn.active {
          background: var(--primary-dark);
          border-color: var(--primary-dark);
          color: white;
        }

        .filter-count {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 20px;
          height: 20px;
          border-radius: 10px;
          background: rgba(255,255,255,0.2);
          font-size: 11px;
          font-weight: 700;
        }

        .filter-btn:not(.active) .filter-count {
          background: var(--bg-main);
        }

        /* Tabla */
        .facturas-table-wrapper {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          overflow: hidden;
        }

        .facturas-table {
          width: 100%;
          border-collapse: collapse;
        }

        .facturas-table thead th {
          padding: 12px 16px;
          text-align: left;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--text-light);
          background: var(--bg-main);
          border-bottom: 1px solid var(--border);
        }

        .facturas-table tbody td {
          padding: 14px 16px;
          font-size: 13px;
          color: var(--text-primary);
          border-bottom: 1px solid var(--border);
          vertical-align: middle;
        }

        .facturas-table tbody tr:last-child td {
          border-bottom: none;
        }

        .facturas-table tbody tr:hover {
          background-color: var(--primary-light);
        }

        .row-urgente {
          background-color: #fff7ed !important;
        }

        .row-urgente:hover {
          background-color: #ffedd5 !important;
        }

        /* Badges */
        .estado-badge {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .estado-badge-lg {
          font-size: 13px;
          padding: 6px 14px;
        }

        .badge-pendiente {
          background: #fef9c3;
          color: #854d0e;
        }

        .badge-aceptada {
          background: #dcfce7;
          color: #166534;
        }

        .badge-reclamada {
          background: #fee2e2;
          color: #991b1b;
        }

        .td-folio {
          font-weight: 600;
          font-family: 'SF Mono', 'Cascadia Code', monospace;
        }

        .td-proveedor {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .proveedor-nombre {
          font-weight: 500;
        }

        .proveedor-rut {
          font-size: 11px;
          color: var(--text-light);
        }

        .td-total {
          font-weight: 700;
          font-family: 'SF Mono', 'Cascadia Code', monospace;
        }

        .dias-badge {
          display: inline-block;
          padding: 3px 8px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 600;
        }

        .dias-normal {
          background: #e0f2fe;
          color: #0369a1;
        }

        .dias-urgente {
          background: #fee2e2;
          color: #991b1b;
          animation: pulse-urgente 2s ease-in-out infinite;
        }

        .dias-procesada {
          background: var(--bg-main);
          color: var(--text-light);
        }

        .btn-ver-detalle {
          padding: 6px 12px;
          background: transparent;
          border: 1px solid var(--primary);
          color: var(--primary);
          border-radius: var(--radius-sm);
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition);
        }

        .btn-ver-detalle:hover {
          background: var(--primary);
          color: white;
        }

        /* Empty state */
        .facturas-empty {
          padding: 60px 20px;
          text-align: center;
          color: var(--text-light);
        }

        .facturas-empty svg {
          opacity: 0.3;
          margin-bottom: 12px;
        }

        .facturas-empty p {
          font-size: 14px;
        }

        /* Info legal */
        .facturas-info-legal {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          margin-top: 16px;
          padding: 12px 16px;
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          border-radius: var(--radius-sm);
          font-size: 12px;
          color: #1e40af;
          line-height: 1.5;
        }

        .facturas-info-legal svg {
          flex-shrink: 0;
          margin-top: 1px;
        }

        /* Modal de detalle */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal-content {
          background: var(--bg-card);
          border-radius: var(--radius-md);
          width: 100%;
          box-shadow: var(--shadow-lg);
          display: flex;
          flex-direction: column;
          max-height: 90vh;
        }

        .factura-detail-modal {
          max-width: 720px;
        }

        .reclamo-modal {
          max-width: 520px;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 18px 24px;
          border-bottom: 1px solid var(--border);
        }

        .modal-header h3 {
          font-size: 16px;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 22px;
          color: var(--text-light);
          cursor: pointer;
          padding: 0 4px;
        }

        .close-btn:hover {
          color: var(--text-primary);
        }

        .factura-detail-body {
          padding: 20px 24px;
          overflow-y: auto;
          flex: 1;
        }

        .detail-estado-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .reclamo-tipo-badge {
          padding: 4px 10px;
          background: #fef2f2;
          border: 1px solid #fca5a5;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 600;
          color: #991b1b;
        }

        .detail-section {
          margin-bottom: 20px;
        }

        .detail-section-title {
          font-size: 13px;
          font-weight: 700;
          color: var(--text-primary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin: 0 0 10px;
          padding-bottom: 6px;
          border-bottom: 1px solid var(--border);
        }

        .detail-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }

        .detail-field {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .detail-label {
          font-size: 11px;
          color: var(--text-light);
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .detail-value {
          font-size: 13px;
          font-weight: 500;
          color: var(--text-primary);
        }

        /* Items table inside modal */
        .detail-items-table {
          width: 100%;
          border-collapse: collapse;
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          overflow: hidden;
        }

        .detail-items-table thead th {
          padding: 8px 12px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          color: var(--text-light);
          background: var(--bg-main);
          border-bottom: 1px solid var(--border);
          text-align: left;
        }

        .detail-items-table tbody td {
          padding: 8px 12px;
          font-size: 12px;
          color: var(--text-primary);
          border-bottom: 1px solid var(--border);
        }

        .detail-items-table tbody tr:last-child td {
          border-bottom: none;
        }

        .td-center { text-align: center; }
        .td-right { text-align: right; font-family: 'SF Mono', 'Cascadia Code', monospace; }

        /* Totals */
        .detail-totals {
          background: var(--bg-main);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          padding: 12px 16px;
          margin-bottom: 20px;
        }

        .total-row {
          display: flex;
          justify-content: space-between;
          padding: 4px 0;
          font-size: 13px;
          color: var(--text-secondary);
        }

        .total-final {
          border-top: 2px solid var(--border);
          margin-top: 8px;
          padding-top: 8px;
          font-size: 16px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .detail-observaciones {
          font-size: 13px;
          color: var(--text-secondary);
          background: var(--bg-main);
          padding: 10px 14px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border);
          margin: 0;
          line-height: 1.5;
        }

        .reclamo-info-section {
          background: #fef2f2;
          border: 1px solid #fca5a5;
          border-radius: var(--radius-sm);
          padding: 14px;
        }

        .reclamo-info-section .detail-section-title {
          color: #991b1b;
          border-bottom-color: #fca5a5;
        }

        .aceptada-info-section {
          background: #f0fdf4;
          border: 1px solid #86efac;
          border-radius: var(--radius-sm);
          padding: 14px;
        }

        .aceptada-info-text {
          font-size: 13px;
          font-weight: 600;
          color: #166534;
          margin: 0;
        }

        /* Modal footer & buttons */
        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          padding: 14px 24px;
          border-top: 1px solid var(--border);
        }

        .modal-btn-cancel {
          padding: 10px 16px;
          background-color: var(--bg-main);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          color: var(--text-secondary);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
        }

        .btn-aceptar {
          padding: 10px 16px;
          background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
          border: none;
          color: white;
          font-size: 13px;
          font-weight: 600;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: var(--transition);
        }

        .btn-aceptar:hover {
          background: #15803d;
        }

        .btn-ingresar-stock {
          padding: 10px 16px;
          background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
          border: none;
          color: white;
          font-size: 13px;
          font-weight: 600;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: var(--transition);
        }

        .btn-ingresar-stock:hover {
          background: #0369a1;
        }

        .stock-ingresado-badge {
          display: inline-block;
          margin-left: 6px;
          padding: 3px 8px;
          background: #e0f2fe;
          color: #0369a1;
          border-radius: 10px;
          font-size: 10px;
          font-weight: 600;
        }

        .stock-ingresado-info-section {
          background: #f0f9ff;
          border: 1px solid #bae6fd;
          border-radius: var(--radius-sm);
          padding: 12px 14px;
        }

        .stock-ingresado-info-text {
          font-size: 13px;
          font-weight: 600;
          color: #0369a1;
          margin: 0;
        }

        .stock-pending-info-section {
          background: #fefce8;
          border: 1px solid #fef08a;
          border-radius: var(--radius-sm);
          padding: 12px 14px;
        }

        .stock-pending-info-text {
          font-size: 12px;
          color: #854d0e;
          margin: 0;
          line-height: 1.4;
        }

        /* Modal Resultado Carga Stock */
        .stock-result-modal {
          max-width: 600px;
        }

        .stock-result-body {
          padding: 20px 24px;
          max-height: 70vh;
          overflow-y: auto;
        }

        .stock-result-banner {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          border-radius: var(--radius-sm);
        }

        .stock-result-icon {
          font-size: 32px;
        }

        .stock-result-title {
          font-size: 15px;
          font-weight: 700;
          color: #15803d;
          margin: 0 0 4px;
        }

        .stock-result-subtitle {
          font-size: 12px;
          color: #166534;
          margin: 0;
          line-height: 1.4;
        }

        .stock-result-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 12px;
        }

        .stock-result-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 14px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border);
          background: var(--bg-main);
        }

        .item-creado {
          border-left: 4px solid #0284c7;
          background: #f0f9ff;
        }

        .item-actualizado {
          border-left: 4px solid #16a34a;
          background: #f0fdf4;
        }

        .item-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .item-name {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .item-type-tag {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.3px;
        }

        .item-creado .item-type-tag { color: #0369a1; }
        .item-actualizado .item-type-tag { color: #15803d; }

        .item-qty {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        .added-qty {
          font-size: 15px;
          font-weight: 800;
          color: var(--text-primary);
        }

        .total-stock {
          font-size: 11px;
          color: var(--text-light);
        }

        .btn-reclamar {
          padding: 10px 16px;
          background: transparent;
          border: 1px solid #dc2626;
          color: #dc2626;
          font-size: 13px;
          font-weight: 600;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: var(--transition);
        }

        .btn-reclamar:hover {
          background: #fef2f2;
        }

        /* Reclamo modal body */
        .reclamo-body {
          padding: 20px 24px;
        }

        .reclamo-warning {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 12px 14px;
          background: #fef9c3;
          border: 1px solid #fde68a;
          border-radius: var(--radius-sm);
          font-size: 12px;
          color: #854d0e;
          line-height: 1.5;
          margin-bottom: 18px;
        }

        .reclamo-warning svg {
          flex-shrink: 0;
          color: #ca8a04;
        }

        .form-group {
          margin-bottom: 14px;
        }

        .form-group label {
          display: block;
          font-size: 12px;
          font-weight: 600;
          color: var(--text-secondary);
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .reclamo-tipos {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .reclamo-tipo-btn {
          padding: 10px 14px;
          border: 1px solid var(--border);
          background: var(--bg-card);
          border-radius: var(--radius-sm);
          font-size: 13px;
          font-weight: 500;
          color: var(--text-secondary);
          cursor: pointer;
          transition: var(--transition);
          text-align: left;
        }

        .reclamo-tipo-btn:hover {
          border-color: #dc2626;
          color: #dc2626;
        }

        .reclamo-tipo-btn.active {
          background: #991b1b;
          border-color: #991b1b;
          color: white;
          font-weight: 600;
        }

        .reclamo-textarea {
          width: 100%;
          padding: 10px 14px;
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          font-size: 13px;
          font-family: inherit;
          resize: vertical;
          outline: none;
          transition: var(--transition);
        }

        .reclamo-textarea:focus {
          border-color: var(--primary);
        }

        .btn-confirmar-reclamo {
          padding: 10px 16px;
          background: #dc2626;
          border: none;
          color: white;
          font-size: 13px;
          font-weight: 600;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: var(--transition);
        }

        .btn-confirmar-reclamo:hover {
          background: #991b1b;
        }

        .btn-confirmar-reclamo:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Mobile */
        @media (max-width: 768px) {
          .facturas-container {
            padding: 16px;
            padding-top: 72px;
            padding-bottom: 80px;
          }

          .facturas-header {
            flex-direction: column;
            gap: 12px;
          }

          .facturas-filters {
            overflow-x: auto;
            flex-wrap: nowrap;
            -webkit-overflow-scrolling: touch;
            padding-bottom: 4px;
          }

          .filter-btn {
            white-space: nowrap;
            flex-shrink: 0;
          }

          .facturas-table thead th:nth-child(3),
          .facturas-table tbody td:nth-child(3),
          .facturas-table thead th:nth-child(6),
          .facturas-table tbody td:nth-child(6) {
            display: none;
          }

          .detail-grid {
            grid-template-columns: 1fr;
          }

          .factura-detail-modal {
            max-width: 100%;
          }

          .modal-content {
            max-height: 85vh;
          }
        }
      `}</style>
    </div>
  );
}
