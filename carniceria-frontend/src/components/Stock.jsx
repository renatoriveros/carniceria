import React, { useState, useEffect } from 'react';
import { getProducts, getCategories, saveProduct, deleteProduct } from '../utils/db';

export default function Stock({ onProductChange }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Form State
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formStock, setFormStock] = useState('');
  const [formMinStock, setFormMinStock] = useState('');
  const [formUnit, setFormUnit] = useState('kg');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const prods = getProducts().filter(p => p.activo === 1);
    setProducts(prods);
    setCategories(getCategories());
  };

  // Filter products
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.nombre_comercial.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.codigo_barras.includes(searchQuery);
    
    const matchesCategory = selectedCategory === 'All' || 
      p.id_categoria === Number(selectedCategory);

    return matchesSearch && matchesCategory;
  });

  // Pagination calculation
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  // Statistics
  const totalProductsCount = products.length;
  const lowStockCount = products.filter(p => p.stock <= p.stock_minimo).length;
  const totalStockValue = products.reduce((sum, p) => sum + (p.stock * p.precio_venta), 0);

  // Form actions
  const openAddModal = () => {
    try {
      setEditingProduct(null);
      setFormName('');
      const defaultCategory = (categories && categories.length > 0) ? (categories[0].id_categoria || '') : '';
      setFormCategory(defaultCategory);
      setFormCode(String(Date.now()).slice(-8)); // Autogenerate code
      setFormPrice('');
      setFormStock('');
      setFormMinStock('10');
      setFormUnit('kg');
      setShowModal(true);
    } catch (err) {
      alert("Error en openAddModal: " + err.message + "\n" + err.stack);
    }
  };

  const openEditModal = (product) => {
    try {
      setEditingProduct(product);
      setFormName(product.nombre_comercial || '');
      setFormCategory(product.id_categoria || '');
      setFormCode(product.codigo_barras || '');
      setFormPrice(product.precio_venta || '');
      setFormStock(product.stock || '');
      setFormMinStock(product.stock_minimo || '');
      setFormUnit(product.presentacion || 'kg');
      setShowModal(true);
    } catch (err) {
      alert("Error en openEditModal: " + err.message + "\n" + err.stack);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar este producto?')) {
      deleteProduct(id);
      loadData();
      if (onProductChange) onProductChange();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formName || !formPrice || !formStock) {
      alert('Por favor, complete todos los campos obligatorios.');
      return;
    }

    const payload = {
      nombre_comercial: formName,
      id_categoria: Number(formCategory),
      codigo_barras: formCode,
      precio_venta: Number(formPrice),
      stock: Number(formStock),
      stock_minimo: Number(formMinStock),
      presentacion: formUnit,
      imagen: editingProduct ? editingProduct.imagen : 'default'
    };

    if (editingProduct) {
      payload.id = editingProduct.id;
    }

    saveProduct(payload);
    loadData();
    setShowModal(false);
    if (onProductChange) onProductChange();
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="stock-container fade-in">
      {/* Top Banner Title */}
      <div className="stock-header">
        <div className="stock-title-info">
          <h2>Stock Disponible</h2>
          <p>Gestión de niveles de inventario y precios de venta.</p>
        </div>
        <button onClick={openAddModal} className="add-product-btn">
          + Agregar Producto
        </button>
      </div>

      {/* Metric Cards Row */}
      <div className="stock-metrics-grid">
        <div className="metric-card bg-white-card">
          <div className="metric-icon blue-theme">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path>
            </svg>
          </div>
          <div className="metric-info">
            <span className="metric-label">Total Productos</span>
            <h3 className="metric-value">{totalProductsCount}</h3>
          </div>
        </div>

        <div className="metric-card bg-white-card">
          <div className="metric-icon orange-theme">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </div>
          <div className="metric-info">
            <span className="metric-label">Alerta Stock Bajo</span>
            <h3 className="metric-value text-orange">{lowStockCount}</h3>
          </div>
        </div>

        <div className="metric-card bg-white-card">
          <div className="metric-icon green-theme">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          </div>
          <div className="metric-info">
            <span className="metric-label">Valor de Inventario (Venta)</span>
            <h3 className="metric-value text-green">{formatCurrency(totalStockValue)}</h3>
          </div>
        </div>
      </div>

      {/* Filter and Table Card */}
      <div className="stock-table-card bg-white-card">
        {/* Table Filters */}
        <div className="table-filter-bar">
          <div className="stock-search-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="search-icon">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="stock-search-input"
            />
          </div>

          <div className="stock-select-wrapper">
            <select
              value={selectedCategory}
              onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
              className="stock-select"
            >
              <option value="All">Todas las Categorías</option>
              {categories.map(cat => (
                <option key={cat.id_categoria} value={cat.id_categoria}>{cat.nombre}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table Container */}
        <div className="table-responsive">
          <table className="stock-table">
            <thead>
              <tr>
                <th>PRODUCTO</th>
                <th>CATEGORÍA</th>
                <th>SKU / CÓDIGO</th>
                <th>STOCK</th>
                <th>PRECIO</th>
                <th>ESTADO</th>
                <th>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan="7" className="table-empty-row">
                    No se encontraron productos en el inventario.
                  </td>
                </tr>
              ) : (
                currentItems.map(prod => {
                  const isLow = prod.stock <= prod.stock_minimo && prod.stock > 0;
                  const isOut = prod.stock === 0;
                  
                  let statusText = 'EN STOCK';
                  let statusClass = 'badge-success';
                  if (isOut) {
                    statusText = 'SIN STOCK';
                    statusClass = 'badge-danger';
                  } else if (isLow) {
                    statusText = 'STOCK BAJO';
                    statusClass = 'badge-warning';
                  }

                  return (
                    <tr key={prod.id}>
                      <td className="font-semibold">{prod.nombre_comercial}</td>
                      <td>{categories.find(c => c.id_categoria === prod.id_categoria)?.nombre || 'N/A'}</td>
                      <td className="text-mono">{prod.codigo_barras}</td>
                      <td>{prod.stock} {prod.presentacion}</td>
                      <td className="font-bold">{formatCurrency(prod.precio_venta)}</td>
                      <td>
                        <span className={`status-badge ${statusClass}`}>{statusText}</span>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button onClick={() => openEditModal(prod)} className="action-btn edit-btn" title="Editar">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                              <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                          </button>
                          <button onClick={() => handleDelete(prod.id)} className="action-btn delete-btn" title="Eliminar">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6"></polyline>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                              <line x1="10" y1="11" x2="10" y2="17"></line>
                              <line x1="14" y1="11" x2="14" y2="17"></line>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination */}
        {totalPages > 1 && (
          <div className="table-pagination">
            <span className="pagination-info">
              Mostrando {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, totalItems)} de {totalItems} productos
            </span>
            <div className="pagination-buttons">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} 
                disabled={currentPage === 1}
                className="page-btn"
              >
                &lt;
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
                >
                  {i + 1}
                </button>
              ))}
              <button 
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} 
                disabled={currentPage === totalPages}
                className="page-btn"
              >
                &gt;
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Product Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="product-modal fade-in">
            <div className="modal-header">
              <h3>{editingProduct ? 'Editar Producto' : 'Agregar Nuevo Producto'}</h3>
              <button onClick={() => setShowModal(false)} className="close-btn">&times;</button>
            </div>

            <form onSubmit={handleSubmit} className="product-form">
              <div className="form-group">
                <label>Nombre Comercial *</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Ej: Asado de Tira Premium"
                  className="modal-input"
                  required
                />
              </div>

              <div className="form-row-grid">
                <div className="form-group">
                  <label>Categoría *</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="modal-select"
                    required
                  >
                    {categories.map(cat => (
                      <option key={cat.id_categoria} value={cat.id_categoria}>{cat.nombre}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Presentación / Unidad *</label>
                  <select
                    value={formUnit}
                    onChange={(e) => setFormUnit(e.target.value)}
                    className="modal-select"
                    required
                  >
                    <option value="kg">kg (Kilogramo)</option>
                    <option value="un">un (Unidad)</option>
                    <option value="1.5L">1.5L (Botella)</option>
                    <option value="2.25L">2.25L (Botella)</option>
                    <option value="500g">500g (Paquete)</option>
                    <option value="520g">520g (Caja/Lata)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Código de Barras (SKU) *</label>
                <input
                  type="text"
                  value={formCode}
                  onChange={(e) => setFormCode(e.target.value)}
                  placeholder="Ej: 789123456011"
                  className="modal-input"
                  required
                />
              </div>

              <div className="form-row-grid">
                <div className="form-group">
                  <label>Precio de Venta ($) *</label>
                  <input
                    type="number"
                    min="0"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    placeholder="Ej: 8500"
                    className="modal-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Stock Inicial *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formStock}
                    onChange={(e) => setFormStock(e.target.value)}
                    placeholder="Ej: 50"
                    className="modal-input"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Stock Mínimo de Alerta</label>
                <input
                  type="number"
                  min="0"
                  value={formMinStock}
                  onChange={(e) => setFormMinStock(e.target.value)}
                  placeholder="Ej: 10"
                  className="modal-input"
                />
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setShowModal(false)} className="modal-btn-cancel">
                  Cancelar
                </button>
                <button type="submit" className="modal-btn-confirm">
                  {editingProduct ? 'Guardar Cambios' : 'Crear Producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 200;
        }

        .stock-container {
          padding: 24px;
          padding-left: 284px; /* Sidebar offset + padding */
          background-color: var(--bg-main);
          width: 100%;
          min-height: 100vh;
        }

        .stock-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .stock-title-info h2 {
          font-size: 22px;
          color: var(--secondary);
          font-weight: 700;
        }

        .stock-title-info p {
          font-size: 13px;
          color: var(--text-secondary);
        }

        .add-product-btn {
          padding: 10px 18px;
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
          color: white;
          border: none;
          font-weight: 600;
          font-size: 13px;
          border-radius: var(--radius-sm);
          cursor: pointer;
          box-shadow: var(--shadow-sm);
          transition: var(--transition);
        }

        .add-product-btn:hover {
          background: var(--primary-hover);
          transform: translateY(-1px);
          box-shadow: var(--shadow-md);
        }

        /* Metrics Row */
        .stock-metrics-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 24px;
        }

        .metric-card {
          padding: 20px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          gap: 16px;
          box-shadow: var(--shadow-sm);
        }

        .bg-white-card {
          background-color: var(--bg-card);
        }

        .metric-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          border-radius: var(--radius-sm);
        }

        .metric-icon.blue-theme {
          background-color: #eff6ff;
          color: #2563eb;
        }

        .metric-icon.orange-theme {
          background-color: #fff7ed;
          color: #d97706;
        }

        .metric-icon.green-theme {
          background-color: #ecfdf5;
          color: #059669;
        }

        .metric-info {
          display: flex;
          flex-direction: column;
        }

        .metric-label {
          font-size: 12px;
          color: var(--text-secondary);
          text-transform: uppercase;
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        .metric-value {
          font-size: 24px;
          font-weight: 800;
          color: var(--text-primary);
        }

        .text-orange { color: #d97706; }
        .text-green { color: #059669; }

        /* Table Card */
        .stock-table-card {
          padding: 20px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border);
          box-shadow: var(--shadow-sm);
        }

        .table-filter-bar {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 20px;
        }

        .stock-search-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          flex-grow: 1;
          max-width: 400px;
        }

        .stock-search-input {
          width: 100%;
          padding: 10px 12px 10px 36px;
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          font-size: 13.5px;
          outline: none;
          transition: var(--transition);
        }

        .stock-search-input:focus {
          border-color: var(--primary);
        }

        .stock-select-wrapper {
          min-width: 180px;
        }

        .stock-select {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          background-color: var(--bg-card);
          font-size: 13.5px;
          outline: none;
          cursor: pointer;
        }

        /* Stock Table */
        .table-responsive {
          width: 100%;
          overflow-x: auto;
        }

        .stock-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .stock-table th {
          padding: 12px 16px;
          border-bottom: 2px solid var(--border);
          color: var(--text-secondary);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .stock-table td {
          padding: 16px;
          border-bottom: 1px solid var(--border);
          font-size: 13.5px;
        }

        .stock-table tbody tr:hover {
          background-color: var(--bg-main);
        }

        .table-empty-row {
          text-align: center;
          color: var(--text-light);
          padding: 40px !important;
        }

        .text-mono {
          font-family: monospace;
          font-size: 12px;
        }

        .font-semibold { font-weight: 600; }
        .font-bold { font-weight: 700; color: var(--primary-dark); }

        .status-badge {
          display: inline-block;
          font-size: 10px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 12px;
          text-transform: uppercase;
        }

        .badge-success {
          background-color: var(--success-light);
          color: var(--success);
        }

        .badge-warning {
          background-color: var(--warning-light);
          color: var(--warning);
        }

        .badge-danger {
          background-color: var(--danger-light);
          color: var(--danger);
        }

        .table-actions {
          display: flex;
          gap: 8px;
        }

        .action-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-light);
          transition: var(--transition);
        }

        .action-btn.edit-btn:hover {
          color: var(--primary);
          background-color: var(--primary-light);
        }

        .action-btn.delete-btn:hover {
          color: var(--danger);
          background-color: var(--danger-light);
        }

        /* Pagination */
        .table-pagination {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 20px;
          padding-top: 10px;
          border-top: 1px solid var(--border);
        }

        .pagination-info {
          font-size: 12px;
          color: var(--text-light);
        }

        .pagination-buttons {
          display: flex;
          gap: 4px;
        }

        .page-btn {
          min-width: 32px;
          height: 32px;
          padding: 0 6px;
          background-color: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
          color: var(--text-secondary);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition);
        }

        .page-btn:hover:not(:disabled) {
          border-color: var(--primary);
          color: var(--primary);
        }

        .page-btn.active {
          background-color: var(--primary-dark);
          border-color: var(--primary-dark);
          color: white;
        }

        .page-btn:disabled {
          color: var(--text-light);
          border-color: var(--border);
          cursor: not-allowed;
          opacity: 0.5;
        }

        /* Product Form Modal */
        .product-modal {
          width: 520px;
          background-color: var(--bg-card);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-lg);
          padding: 24px;
          border-top: 6px solid var(--primary);
        }

        .product-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-top: 10px;
        }

        .form-row-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .modal-input,
        .modal-select {
          padding: 10px 14px;
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          font-size: 13.5px;
          width: 100%;
          outline: none;
          background-color: #fcfcfc;
          transition: var(--transition);
        }

        .modal-input:focus,
        .modal-select:focus {
          border-color: var(--primary);
          background-color: white;
        }

        /* Mobile Responsive adjustment */
        @media (max-width: 768px) {
          .stock-container {
            padding: 16px;
            padding-bottom: 80px;
            padding-top: 72px;
          }

          .stock-metrics-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .table-filter-bar {
            flex-direction: column;
            gap: 12px;
          }
        }
      `}</style>
    </div>
  );
}
