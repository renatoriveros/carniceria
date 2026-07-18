import React, { useState, useEffect } from 'react';
import { getSales, getActiveShift } from '../utils/db';

export default function Dashboard() {
  const [sales, setSales] = useState([]);
  const [activeShift, setActiveShift] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    setSales(getSales());
    setActiveShift(getActiveShift());
  }, []);

  // Filter sales for the selected date
  const filteredSales = sales.filter(s => {
    const saleDate = s.fecha_hora.split('T')[0];
    return saleDate === selectedDate;
  });

  // Calculate Metrics
  const totalVentas = filteredSales.reduce((sum, s) => sum + s.total_venta, 0);
  const totalTransactions = filteredSales.length;
  
  const initialCash = activeShift?.monto_apertura || 100000;
  
  // Balance in drawer for selected date
  const cashSalesTotal = filteredSales
    .filter(s => s.metodo_pago === 'Efectivo')
    .reduce((sum, s) => sum + s.total_venta, 0);
  const balanceCaja = initialCash + cashSalesTotal;

  // Calculate top selling products
  const productSalesMap = {};
  filteredSales.forEach(s => {
    s.items.forEach(item => {
      if (!productSalesMap[item.id_producto]) {
        productSalesMap[item.id_producto] = {
          nombre: item.nombre,
          cantidad: 0,
          total: 0
        };
      }
      productSalesMap[item.id_producto].cantidad += item.cantidad;
      productSalesMap[item.id_producto].total += item.subtotal;
    });
  });

  const topSellers = Object.values(productSalesMap)
    .sort((a, b) => b.cantidad - a.cantidad)
    .slice(0, 5); // top 5

  // Calculations for Sales by Hour (chart data)
  // Let's divide the workday into hours: 9, 11, 13, 15, 17, 19, 21
  const hours = [9, 11, 13, 15, 17, 19, 21];
  const hourlyData = hours.map(h => {
    // Sum sales that fell within h-1 and h+1
    const amount = filteredSales
      .filter(s => {
        const saleHour = new Date(s.fecha_hora).getHours();
        return saleHour >= h - 1 && saleHour < h + 1;
      })
      .reduce((sum, s) => sum + s.total_venta, 0);
    return amount;
  });

  // Generate SVG Path for visual curve chart
  const generateChartPath = () => {
    if (hourlyData.every(v => v === 0)) {
      return { path: 'M 50 150 L 550 150', areaPath: 'M 50 150 L 550 150 L 550 200 L 50 200 Z' };
    }

    const width = 500;
    const height = 150;
    const paddingX = 50;
    const paddingY = 20;

    const maxVal = Math.max(...hourlyData) || 10000;
    
    // Coordinates
    const points = hourlyData.map((val, idx) => {
      const x = paddingX + (idx * (width / (hours.length - 1)));
      // Invert Y because SVG origin is top-left
      const y = height + paddingY - (val / maxVal) * height;
      return { x, y };
    });

    // Smooth Bezier Curve Path
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      // Control points
      const cpX1 = p0.x + (p1.x - p0.x) / 2;
      const cpY1 = p0.y;
      const cpX2 = p0.x + (p1.x - p0.x) / 2;
      const cpY2 = p1.y;
      
      path += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
    }

    // Fill Area Path
    const areaPath = `${path} L ${points[points.length - 1].x} ${height + paddingY} L ${points[0].x} ${height + paddingY} Z`;

    return { path, areaPath, points };
  };

  const { path: linePath, areaPath, points: chartPoints } = generateChartPath();

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(val);
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="dashboard-container fade-in">
      {/* Top filter banner */}
      <div className="dashboard-header">
        <div className="dashboard-title-info">
          <h2>Resumen del Día</h2>
          <p>Vista general de métricas operativas clave.</p>
        </div>

        <div className="dashboard-actions">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="date-picker-input"
          />
          <button onClick={handlePrintReport} className="print-report-btn">
            Imprimir Reporte
          </button>
        </div>
      </div>

      {/* Metrics Stat Cards */}
      <div className="dashboard-metrics-grid">
        <div className="metric-card bg-white-card">
          <div className="metric-info-row">
            <div className="metric-details">
              <span className="metric-label">VENTAS TOTALES</span>
              <h3 className="metric-value">{formatCurrency(totalVentas)}</h3>
              <span className="metric-subtext text-green">▲ +12.5% vs ayer</span>
            </div>
            <div className="metric-badge-icon red-bg">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
            </div>
          </div>
        </div>

        <div className="metric-card bg-white-card">
          <div className="metric-info-row">
            <div className="metric-details">
              <span className="metric-label">TRANSACCIONES</span>
              <h3 className="metric-value">{totalTransactions}</h3>
              <span className="metric-subtext text-green">95% completadas</span>
            </div>
            <div className="metric-badge-icon blue-bg">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
          </div>
        </div>

        <div className="metric-card bg-white-card">
          <div className="metric-info-row">
            <div className="metric-details">
              <span className="metric-label">CAJA CHICA APERTURA</span>
              <h3 className="metric-value">{formatCurrency(initialCash)}</h3>
              <span className="metric-subtext text-secondary">Turno Activo</span>
            </div>
            <div className="metric-badge-icon orange-bg">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
                <line x1="12" y1="10" x2="12" y2="10"></line>
                <line x1="12" y1="14" x2="12" y2="14"></line>
              </svg>
            </div>
          </div>
        </div>

        <div className="metric-card bg-white-card">
          <div className="metric-info-row">
            <div className="metric-details">
              <span className="metric-label">BALANCE CAJA EFECTIVO</span>
              <h3 className="metric-value">{formatCurrency(balanceCaja)}</h3>
              <span className="metric-subtext text-secondary">Dinero estimado</span>
            </div>
            <div className="metric-badge-icon green-bg">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="1" x2="12" y2="23"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="dashboard-charts-grid">
        {/* Left Side: Sales by hour chart */}
        <div className="chart-panel bg-white-card">
          <div className="chart-panel-header">
            <h3>Ventas por Hora</h3>
            <span className="chart-legend">Monto en Pesos ($)</span>
          </div>

          <div className="svg-chart-container">
            <svg viewBox="0 0 600 200" width="100%" height="100%">
              {/* Definitions for Gradients */}
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.00" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="50" y1="20" x2="550" y2="20" stroke="#f0f0f0" strokeWidth="1" />
              <line x1="50" y1="70" x2="550" y2="70" stroke="#f0f0f0" strokeWidth="1" />
              <line x1="50" y1="120" x2="550" y2="120" stroke="#f0f0f0" strokeWidth="1" />
              <line x1="50" y1="170" x2="550" y2="170" stroke="#E5E7EB" strokeWidth="1.5" />

              {/* Area path */}
              <path d={areaPath} fill="url(#areaGrad)" />

              {/* Line path */}
              <path d={linePath} fill="none" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" />

              {/* Dots on points */}
              {chartPoints?.map((pt, idx) => (
                <g key={idx}>
                  <circle cx={pt.x} cy={pt.y} r="5" fill="var(--primary)" stroke="#FFFFFF" strokeWidth="2" />
                  <text
                    x={pt.x}
                    y={pt.y - 10}
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="600"
                    fill="var(--text-secondary)"
                  >
                    {hourlyData[idx] > 0 ? formatCurrency(hourlyData[idx]).replace('$', '') : ''}
                  </text>
                </g>
              ))}

              {/* X Axis Labels */}
              {hours.map((h, idx) => {
                const x = 50 + (idx * (500 / (hours.length - 1)));
                return (
                  <text
                    key={idx}
                    x={x}
                    y="190"
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="500"
                    fill="var(--text-light)"
                  >
                    {h}:00
                  </text>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Right Side: Top Sellers */}
        <div className="top-sellers-panel bg-white-card">
          <div className="chart-panel-header">
            <h3>Más Vendidos</h3>
            <span className="chart-legend">Top 5 de Hoy</span>
          </div>

          <div className="top-sellers-list">
            {topSellers.length === 0 ? (
              <div className="top-sellers-empty">
                Aún no hay transacciones registradas hoy.
              </div>
            ) : (
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>PRODUCTO</th>
                    <th className="text-right">CANT. VENDIDA</th>
                    <th className="text-right">TOTAL VENTAS</th>
                  </tr>
                </thead>
                <tbody>
                  {topSellers.map((seller, idx) => (
                    <tr key={idx}>
                      <td className="font-semibold">{seller.nombre}</td>
                      <td className="text-right font-medium text-secondary">{seller.cantidad.toFixed(1)}</td>
                      <td className="text-right font-bold text-primary">{formatCurrency(seller.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .dashboard-container {
          padding: 24px;
          padding-left: 284px; /* Sidebar offset */
          background-color: var(--bg-main);
          width: 100%;
          min-height: 100vh;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .dashboard-title-info h2 {
          font-size: 22px;
          color: var(--secondary);
          font-weight: 700;
        }

        .dashboard-title-info p {
          font-size: 13px;
          color: var(--text-secondary);
        }

        .dashboard-actions {
          display: flex;
          gap: 12px;
        }

        .date-picker-input {
          padding: 8px 12px;
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          font-size: 13px;
          outline: none;
          background-color: var(--bg-card);
        }

        .print-report-btn {
          padding: 8px 16px;
          background-color: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          font-size: 13px;
          font-weight: 600;
          color: var(--text-secondary);
          cursor: pointer;
          transition: var(--transition);
        }

        .print-report-btn:hover {
          border-color: var(--primary);
          color: var(--primary);
        }

        /* Metrics Row */
        .dashboard-metrics-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }

        .metric-info-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          width: 100%;
        }

        .metric-details {
          display: flex;
          flex-direction: column;
        }

        .metric-badge-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 8px;
        }

        .metric-badge-icon.red-bg { background-color: #fef2f2; color: var(--primary); }
        .metric-badge-icon.blue-bg { background-color: #eff6ff; color: #2563eb; }
        .metric-badge-icon.orange-bg { background-color: #fff7ed; color: #d97706; }
        .metric-badge-icon.green-bg { background-color: #ecfdf5; color: #059669; }

        .metric-subtext {
          font-size: 11px;
          font-weight: 600;
          margin-top: 4px;
        }

        /* Charts Panels */
        .dashboard-charts-grid {
          display: grid;
          grid-template-columns: 1.6fr 1fr;
          gap: 24px;
        }

        .chart-panel,
        .top-sellers-panel {
          padding: 24px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border);
          box-shadow: var(--shadow-sm);
        }

        .chart-panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .chart-panel-header h3 {
          font-size: 16px;
          font-weight: 700;
          color: var(--secondary);
        }

        .chart-legend {
          font-size: 11px;
          font-weight: 600;
          color: var(--text-light);
          text-transform: uppercase;
        }

        .svg-chart-container {
          width: 100%;
          height: 200px;
        }

        /* Top Sellers list */
        .top-sellers-empty {
          text-align: center;
          padding: 40px;
          font-size: 13px;
          color: var(--text-light);
        }

        .dashboard-table {
          width: 100%;
          border-collapse: collapse;
        }

        .dashboard-table th {
          border-bottom: 1px solid var(--border);
          padding: 8px 10px;
          color: var(--text-light);
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          text-align: left;
        }

        .dashboard-table td {
          padding: 12px 10px;
          border-bottom: 1px solid var(--border);
          font-size: 13px;
        }

        .dashboard-table tbody tr:last-child td {
          border-bottom: none;
        }

        .text-right { text-align: right !important; }
        .font-medium { font-weight: 500; }

        /* Print formatting */
        @media print {
          .sidebar-container,
          .dashboard-actions,
          .mobile-top-bar,
          .mobile-bottom-nav {
            display: none !important;
          }
          .dashboard-container {
            padding-left: 0 !important;
            background-color: white;
          }
          .metric-card,
          .chart-panel,
          .top-sellers-panel {
            border: 1px solid black !important;
            box-shadow: none !important;
          }
        }

        /* Mobile adaptation */
        @media (max-width: 1024px) {
          .dashboard-container {
            padding: 16px;
            padding-bottom: 80px;
            padding-top: 72px;
          }

          .dashboard-metrics-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }

          .dashboard-charts-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
        }

        @media (max-width: 580px) {
          .dashboard-metrics-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
