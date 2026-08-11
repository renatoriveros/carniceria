import React, { useState, useEffect, useRef } from 'react';
import {
  getProducts,
  getCategories,
  getActiveShift,
  createSale,
  registerWithdrawal
} from '../utils/db';

// Simple beautiful SVG Product Icons
const ProductIcon = ({ type }) => {
  switch (type) {
    case 'aceite':
      return (
        <svg viewBox="0 0 64 64" width="48" height="48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="22" y="8" width="20" height="8" rx="2" fill="#EAB308" />
          <path d="M18 20C18 17.7909 19.7909 16 22 16H42C44.2091 16 46 17.7909 46 20V52C46 54.2091 44.2091 56 42 56H22C19.7909 56 18 54.2091 18 52V20Z" fill="#FACC15" />
          <rect x="22" y="26" width="20" height="12" fill="#EAB308" />
          <path d="M28 32H36" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
          <circle cx="32" cy="46" r="3" fill="#A16207" />
        </svg>
      );
    case 'arroz':
      return (
        <svg viewBox="0 0 64 64" width="48" height="48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 16C16 16 24 12 32 12C40 12 48 16 48 16V48C48 52.4183 44.4183 56 40 56H24C19.5817 56 16 52.4183 16 48V16Z" fill="#E5E7EB" />
          <path d="M16 22H48V42H16V22Z" fill="#D1D5DB" />
          <ellipse cx="32" cy="32" rx="8" ry="4" fill="#9CA3AF" />
          <line x1="32" y1="12" x2="32" y2="56" stroke="#9CA3AF" strokeWidth="1" strokeDasharray="3 3" />
        </svg>
      );
    case 'cocacola':
      return (
        <svg viewBox="0 0 64 64" width="48" height="48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="26" y="8" width="12" height="6" rx="1" fill="#EF4444" />
          <path d="M22 22C22 17 26 14 32 14C38 14 42 17 42 22V52C42 54.2091 40.2091 56 38 56H26C23.7909 56 22 54.2091 22 52V22Z" fill="#DC2626" />
          <path d="M22 30C28 26 36 34 42 30V36C36 40 28 32 22 36V30Z" fill="#FFFFFF" opacity="0.8" />
          <rect x="28" y="42" width="8" height="8" rx="1" fill="#991B1B" />
        </svg>
      );
    case 'yerba':
      return (
        <svg viewBox="0 0 64 64" width="48" height="48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="16" y="12" width="32" height="42" rx="4" fill="#15803D" />
          <rect x="22" y="20" width="20" height="18" rx="2" fill="#166534" />
          <path d="M32 24V34M27 29H37" stroke="#4ADE80" strokeWidth="2" strokeLinecap="round" />
          <circle cx="32" cy="46" r="2" fill="#4ADE80" />
        </svg>
      );
    case 'fideos':
      return (
        <svg viewBox="0 0 64 64" width="48" height="48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="18" y="10" width="28" height="44" rx="2" fill="#F59E0B" />
          <line x1="24" y1="16" x2="24" y2="48" stroke="#FEF08A" strokeWidth="2" />
          <line x1="28" y1="16" x2="28" y2="48" stroke="#FEF08A" strokeWidth="2" />
          <line x1="32" y1="16" x2="32" y2="48" stroke="#FEF08A" strokeWidth="2" />
          <line x1="36" y1="16" x2="36" y2="48" stroke="#FEF08A" strokeWidth="2" />
          <line x1="40" y1="16" x2="40" y2="48" stroke="#FEF08A" strokeWidth="2" />
          <rect x="18" y="26" width="28" height="12" fill="#D97706" opacity="0.9" />
        </svg>
      );
    case 'tomate':
      return (
        <svg viewBox="0 0 64 64" width="48" height="48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="20" y="12" width="24" height="40" rx="3" fill="#DC2626" />
          <rect x="20" y="22" width="24" height="20" fill="#EF4444" />
          <circle cx="32" cy="32" r="6" fill="#FEE2E2" />
          <circle cx="32" cy="32" r="3" fill="#DC2626" />
          <path d="M20 16H44" stroke="#D1D5DB" strokeWidth="2" />
          <path d="M20 48H44" stroke="#D1D5DB" strokeWidth="2" />
        </svg>
      );
    case 'carnepicada':
      return (
        <svg viewBox="0 0 64 64" width="48" height="48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="12" y="16" width="40" height="32" rx="4" fill="#B91C1C" />
          <circle cx="20" cy="24" r="2" fill="#FCA5A5" />
          <circle cx="28" cy="22" r="2" fill="#FCA5A5" />
          <circle cx="36" cy="25" r="2" fill="#FCA5A5" />
          <circle cx="44" cy="23" r="2" fill="#FCA5A5" />
          <circle cx="24" cy="32" r="2" fill="#FCA5A5" />
          <circle cx="32" cy="30" r="2" fill="#FCA5A5" />
          <circle cx="40" cy="33" r="2" fill="#FCA5A5" />
          <circle cx="22" cy="40" r="2" fill="#FCA5A5" />
          <circle cx="30" cy="39" r="2" fill="#FCA5A5" />
          <circle cx="38" cy="41" r="2" fill="#FCA5A5" />
          <rect x="10" y="44" width="44" height="6" rx="2" fill="#D1D5DB" />
        </svg>
      );
    case 'ojodebife':
      return (
        <svg viewBox="0 0 64 64" width="48" height="48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 28C12 18 20 14 36 14C52 14 54 22 52 34C50 46 42 50 30 50C18 50 12 38 12 28Z" fill="#991B1B" />
          <path d="M32 20C32 20 34 26 28 28C22 30 20 36 20 36" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
          <ellipse cx="30" cy="28" rx="3" ry="2" fill="#FFFFFF" />
          <path d="M42 22C46 26 44 32 40 34" stroke="#FCA5A5" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 2" />
        </svg>
      );
    case 'nalga':
      return (
        <svg viewBox="0 0 64 64" width="48" height="48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 24C10 18 22 12 38 14C54 16 56 26 50 38C44 50 26 52 18 46C10 40 10 30 10 24Z" fill="#B91C1C" />
          <path d="M14 26C20 22 32 24 38 28" stroke="#FCA5A5" strokeWidth="2" strokeLinecap="round" />
          <path d="M18 34C24 32 30 34 36 38" stroke="#FCA5A5" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'entrana':
      return (
        <svg viewBox="0 0 64 64" width="48" height="48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 18C8 18 20 12 34 16C48 20 56 22 56 28C56 34 46 36 32 32C18 28 8 32 8 28C8 24 8 18 8 18Z" fill="#7F1D1D" />
          <line x1="14" y1="21" x2="50" y2="30" stroke="#FCA5A5" strokeWidth="2" strokeLinecap="round" />
          <line x1="12" y1="25" x2="48" y2="32" stroke="#FCA5A5" strokeWidth="1" strokeDasharray="3 3" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 64 64" width="48" height="48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="16" y="16" width="32" height="32" rx="4" fill="#9CA3AF" />
          <path d="M16 26H48" stroke="#E5E7EB" strokeWidth="2" />
          <circle cx="32" cy="38" r="4" fill="#D1D5DB" />
        </svg>
      );
  }
};

export default function POS({ onSaleCompleted }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('TODOS');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [activeShift, setActiveShift] = useState(null);

  // Checkout Modal State
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Efectivo');
  const [receivedAmount, setReceivedAmount] = useState('');
  const [checkoutError, setCheckoutError] = useState('');
  const [showWithdrawalConfirm, setShowWithdrawalConfirm] = useState(false);

  // Estados nuevos: Control del Carrito y Escaneo de Balanza
  const [showCart, setShowCart] = useState(true);
  const [showScaleScan, setShowScaleScan] = useState(false);
  const [scannedCode, setScannedCode] = useState('');

  const searchInputRef = useRef(null);

  // Load products, categories, active shift
  useEffect(() => {
    setProducts(getProducts().filter(p => p.activo === 1));
    setCategories(getCategories());
    setActiveShift(getActiveShift());

    // Hotkey handler (F1 to focus search box)
    const handleKeyDown = (e) => {
      if (e.key === 'F1') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter products by category and search query
  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'TODOS' ||
      p.id_categoria === categories.find(c => c.nombre === selectedCategory)?.id_categoria;

    const matchesSearch = p.nombre_comercial.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.codigo_barras.includes(searchQuery);

    return matchesCategory && matchesSearch;
  });

  // Cart operations
  const addToCart = (product) => {
    if (product.stock <= 0) {
      alert('¡Producto agotado en inventario!');
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        // If product is kg, add 0.1 kg, else add 1 unit
        const step = product.presentacion === 'kg' ? 0.1 : 1;
        const newQty = Number((existing.quantity + step).toFixed(2));
        if (newQty > product.stock) {
          alert('No hay suficiente stock disponible.');
          return prev;
        }
        return prev.map(item => item.id === product.id ? { ...item, quantity: newQty } : item);
      } else {
        const initialQty = product.presentacion === 'kg' ? 0.5 : 1;
        if (initialQty > product.stock) {
          alert('No hay suficiente stock disponible.');
          return prev;
        }
        return [...prev, { ...product, quantity: initialQty }];
      }
    });
  };

  const updateQuantity = (id, newQty) => {
    const product = products.find(p => p.id === id);
    if (!product) return;

    if (newQty <= 0) {
      removeFromCart(id);
      return;
    }

    if (newQty > product.stock) {
      alert(`Solo hay ${product.stock} ${product.presentacion} disponibles.`);
      return;
    }

    setCart(prev => prev.map(item =>
      item.id === id ? { ...item, quantity: Number(Number(newQty).toFixed(2)) } : item
    ));
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + (item.precio_venta * item.quantity), 0);
  const discount = Math.round(subtotal * (discountPercent / 100));
  const total = Math.max(0, subtotal - discount);



  // Checkout submission
  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    if (!activeShift || activeShift.estado !== 'Abierto') {
      setCheckoutError('Debe abrir la caja primero desde el menú de caja.');
      return;
    }

    if (paymentMethod === 'Efectivo') {
      const received = Number(receivedAmount);
      if (!received || received < total) {
        setCheckoutError('El monto recibido debe ser igual o mayor al total.');
        return;
      }
    }

    try {
      createSale({
        items: cart,
        subtotal,
        descuento: discount,
        total,
        metodo_pago: paymentMethod
      });

      // Clear state
      setCart([]);
      setDiscountPercent(0);
      setReceivedAmount('');
      setCheckoutError('');
      setShowCheckout(false);

      // Notify parent to refresh stocks/caja if needed
      if (onSaleCompleted) onSaleCompleted();
      alert('Venta registrada con éxito.');
    } catch (err) {
      setCheckoutError(err.message || 'Error al procesar la venta.');
    }
  };

  const handleWithdrawalSubmit = () => {
    if (cart.length === 0) return;
    try {
      registerWithdrawal(cart);
      setCart([]);
      setDiscountPercent(0);
      setShowWithdrawalConfirm(false);
      if (onSaleCompleted) onSaleCompleted();
      alert('Retiro de dueño registrado y stock descontado con éxito.');
    } catch (err) {
      alert('Error al registrar el retiro: ' + err.message);
    }
  };

  const changeReceivedAmount = (amount) => {
    setReceivedAmount(amount);
  };

  const handleScaleScanSubmit = (codeText) => {
    if (!codeText) return;

    // Formato 1: Balanza EAN-13 (ej: 2000008012503)
    // 20 = prefijo balanza, 00008 = ID de producto (5 digitos), 01250 = peso en gramos (5 digitos)
    // Formato 2: SKU-PESO (ej: 789123456008-1.25)
    // Formato 3: SKU,PESO (ej: 789123456008,1.25)

    let foundProduct = null;
    let scannedQuantity = 1;
    const text = codeText.trim();

    if (text.startsWith('20') && text.length === 13) {
      const prodIdStr = text.substring(2, 7);
      const weightStr = text.substring(7, 12);

      const prodId = parseInt(prodIdStr, 10);
      const weightGrams = parseInt(weightStr, 10);

      foundProduct = products.find(p => p.id === prodId);
      scannedQuantity = Number((weightGrams / 1000).toFixed(3));
    } else if (text.includes('-')) {
      const parts = text.split('-');
      const sku = parts[0];
      const qtyStr = parts[1];

      foundProduct = products.find(p => p.codigo_barras === sku);
      scannedQuantity = parseFloat(qtyStr) || 1;
    } else if (text.includes(',')) {
      const parts = text.split(',');
      const sku = parts[0].trim();
      const qtyStr = parts[1].trim();

      foundProduct = products.find(p => p.codigo_barras === sku);
      scannedQuantity = parseFloat(qtyStr) || 1;
    } else {
      foundProduct = products.find(p => p.codigo_barras === text || p.nombre_comercial.toLowerCase() === text.toLowerCase());
      if (foundProduct) {
        scannedQuantity = foundProduct.presentacion === 'kg' ? 0.5 : 1;
      }
    }

    if (foundProduct) {
      if (foundProduct.stock <= 0) {
        alert(`El producto ${foundProduct.nombre_comercial} está agotado en inventario.`);
        return;
      }

      setCart(prev => {
        const existing = prev.find(item => item.id === foundProduct.id);
        if (existing) {
          const newQty = Number((existing.quantity + scannedQuantity).toFixed(3));
          if (newQty > foundProduct.stock) {
            alert(`No hay suficiente stock. Disponible: ${foundProduct.stock}`);
            return prev;
          }
          return prev.map(item => item.id === foundProduct.id ? { ...item, quantity: newQty } : item);
        } else {
          if (scannedQuantity > foundProduct.stock) {
            alert(`No hay suficiente stock. Disponible: ${foundProduct.stock}`);
            return prev;
          }
          return [...prev, { ...foundProduct, quantity: scannedQuantity }];
        }
      });

      setShowScaleScan(false);
      setScannedCode('');
    } else {
      alert('Código de balanza no reconocido. Formatos válidos: EAN-13 (2000008012503) o SKU-PESO (789123456008-1.25)');
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className={`pos-main-container ${showCart ? 'has-cart' : ''} fade-in`}>
      {/* Central Area: Categories & Products */}
      <div className="pos-catalog-panel">
        {/* Top Header */}
        <div className="pos-panel-header">
          <div className="pos-title-area">
            <h2>Terminal POS - Nueva Venta</h2>
            <span className="pos-caja-badge">
              Caja Abierta (Turno #{activeShift?.id_turno ? String(activeShift.id_turno).slice(-4) : 'N/A'})
            </span>
          </div>

          <div className="pos-header-actions">
            {/* Escanear Balanza */}
            <button
              onClick={() => setShowScaleScan(true)}
              className="scale-scan-btn"
              title="Simular escaneo de ticket impreso por la pesa"
            >
              Escanear Ticket
            </button>

            {/* Ocultar/Ver Ticket */}
            <button
              onClick={() => setShowCart(!showCart)}
              className={`cart-toggle-btn ${showCart ? 'active' : ''}`}
              title={showCart ? "Ocultar panel de ticket" : "Mostrar panel de ticket"}
            >
              {showCart ? 'Ocultar Ticket' : 'Ver Ticket'}
            </button>
          </div>
        </div>

        {/* Search bar & Categories tabs */}
        <div className="pos-filter-bar">
          <div className="search-box-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="search-icon">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Buscar producto o código [Presione F1]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="category-tabs-container">
            <button
              onClick={() => setSelectedCategory('TODOS')}
              className={`category-tab-btn ${selectedCategory === 'TODOS' ? 'active' : ''}`}
            >
              TODOS
            </button>
            {categories.map(cat => (
              <button
                key={cat.id_categoria}
                onClick={() => setSelectedCategory(cat.nombre)}
                className={`category-tab-btn ${selectedCategory === cat.nombre ? 'active' : ''}`}
              >
                {cat.nombre}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="pos-products-scroll-area">
          {filteredProducts.length === 0 ? (
            <div className="no-products-state">
              No se encontraron productos en esta categoría.
            </div>
          ) : (
            <div className="products-grid grid-compact">
              {filteredProducts.map(prod => {
                const inCart = cart.find(item => item.id === prod.id);
                return (
                  <div
                    key={prod.id}
                    onClick={() => addToCart(prod)}
                    className={`product-card ${inCart ? 'in-cart' : ''} ${prod.stock <= prod.stock_minimo ? 'low-stock' : ''}`}
                    style={{ position: 'relative' }}
                  >
                    {/* Badge con el ID del producto en la esquina superior derecha */}
                    <span className="product-id-badge">ID: {prod.id}</span>

                    <div className="product-card-body">
                      <h4 className="product-card-title" style={{ paddingRight: '45px' }}>{prod.nombre_comercial}</h4>
                      <div className="product-card-footer">
                        <span className="product-card-price">{formatCurrency(prod.precio_venta)} / {prod.presentacion}</span>
                        <span className="product-card-stock">Stock: {prod.stock} {prod.presentacion}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar: Bill/Ticket Actual */}
      {showCart && (
        <div className="pos-ticket-panel">
          <div className="ticket-header">
            <h3>Ticket Actual</h3>
            <span className="ticket-id">#{String(Date.now()).slice(-6)}</span>
          </div>

          <div className="ticket-items-area">
            {cart.length === 0 ? (
              <div className="ticket-empty-state">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="empty-cart-icon">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                <p>El ticket está vacío.</p>
                <span className="subtext">Haz clic en los productos para agregarlos al carro.</span>
              </div>
            ) : (
              <div className="ticket-items-list">
                {cart.map(item => (
                  <div key={item.id} className="ticket-item-row">
                    <div className="ticket-item-details">
                      <span className="item-name">{item.nombre_comercial}</span>
                      <div className="item-qty-controls">
                        <button
                          onClick={(e) => { e.stopPropagation(); updateQuantity(item.id, item.quantity - (item.presentacion === 'kg' ? 0.1 : 1)); }}
                          className="qty-btn"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          step={item.presentacion === 'kg' ? '0.1' : '1'}
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, parseFloat(e.target.value) || 0)}
                          className="qty-input"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <span className="qty-unit">{item.presentacion}</span>
                        <button
                          onClick={(e) => { e.stopPropagation(); addToCart(item); }}
                          className="qty-btn"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="ticket-item-right">
                      <span className="item-subtotal">{formatCurrency(item.precio_venta * item.quantity)}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); removeFromCart(item.id); }}
                        className="delete-item-btn"
                        title="Quitar producto"
                      >
                        &times;
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Totals Section */}
          <div className="ticket-summary-area">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>

            <div className="summary-row discount-row">
              <span>Descuento %</span>
              <div className="discount-input-wrapper">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                  className="discount-input"
                />
                <span className="percent-label">%</span>
              </div>
            </div>

            <div className="summary-row discount-amount-row">
              <span>Monto Descuento</span>
              <span>-{formatCurrency(discount)}</span>
            </div>

            <div className="summary-row total-row">
              <span>TOTAL</span>
              <span>{formatCurrency(total)}</span>
            </div>

            <div className="ticket-actions">
              <button
                type="button"
                onClick={() => {
                  if (cart.length > 0) {
                    setShowWithdrawalConfirm(true);
                  }
                }}
                disabled={cart.length === 0}
                className="ticket-btn-secondary"
                style={{ backgroundColor: '#4b5563', color: 'white', border: 'none' }}
              >
                RETIRO DUEÑO
              </button>
              <button
                onClick={() => {
                  if (cart.length > 0) {
                    setCheckoutError('');
                    setShowCheckout(true);
                  }
                }}
                disabled={cart.length === 0}
                className="ticket-btn-primary"
              >
                COBRAR
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Checkout/Cobrar Modal Overlay */}
      {showCheckout && (
        <div className="modal-overlay">
          <div className="checkout-modal fade-in">
            <div className="modal-header">
              <h3>Confirmar Venta y Cobro</h3>
              <button onClick={() => setShowCheckout(false)} className="close-btn">&times;</button>
            </div>

            <form onSubmit={handleCheckoutSubmit} className="checkout-form">
              {checkoutError && <div className="checkout-error">{checkoutError}</div>}

              <div className="checkout-summary-box">
                <span className="summary-label">Total a pagar:</span>
                <h2 className="summary-total">{formatCurrency(total)}</h2>
              </div>

              <div className="form-group">
                <label>Método de Pago</label>
                <div className="payment-methods-grid">
                  {['Efectivo', 'Tarjeta de Débito', 'Tarjeta de Crédito', 'Transferencia'].map(method => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`payment-method-btn ${paymentMethod === method ? 'active' : ''}`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              {paymentMethod === 'Efectivo' && (
                <div className="cash-payment-section">
                  <div className="form-group">
                    <label>Efectivo Recibido</label>
                    <input
                      type="number"
                      placeholder="Ingrese el monto recibido"
                      value={receivedAmount}
                      onChange={(e) => changeReceivedAmount(e.target.value)}
                      className="checkout-input"
                      required
                    />
                  </div>

                  {/* Quick cash options */}
                  <div className="quick-cash-row">
                    {[total, Math.ceil(total / 1000) * 1000, Math.ceil(total / 5000) * 5000, 10000, 20000].map(val => {
                      if (val < total) return null;
                      return (
                        <button
                          key={val}
                          type="button"
                          onClick={() => changeReceivedAmount(String(val))}
                          className="quick-cash-btn"
                        >
                          {formatCurrency(val)}
                        </button>
                      );
                    })}
                  </div>

                  {Number(receivedAmount) >= total && (
                    <div className="cash-change-box">
                      <span>Vuelto a entregar:</span>
                      <h3>{formatCurrency(Number(receivedAmount) - total)}</h3>
                    </div>
                  )}
                </div>
              )}

              <div className="modal-footer">
                <button type="button" onClick={() => setShowCheckout(false)} className="modal-btn-cancel">
                  Cancelar
                </button>
                <button type="submit" className="modal-btn-confirm">
                  Confirmar Cobro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Retiro Dueño Modal Overlay */}
      {showWithdrawalConfirm && (
        <div className="modal-overlay">
          <div className="checkout-modal fade-in" style={{ width: '450px', borderTop: '6px solid #4b5563' }}>
            <div className="modal-header">
              <h3>Confirmar Retiro de Dueño (Autoconsumo)</h3>
              <button onClick={() => setShowWithdrawalConfirm(false)} className="close-btn">&times;</button>
            </div>

            <div style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: '1.4' }}>
              <p>Se realizará la salida de inventario de los productos cargados. Esta operación <strong>no tiene costo</strong> ni afectará los reportes de ventas ni de caja.</p>
            </div>

            <div style={{ border: '1px solid var(--border)', borderRadius: '6px', overflow: 'hidden', marginBottom: '20px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-main)', textAlign: 'left' }}>
                    <th style={{ padding: '8px 12px', color: 'var(--text-secondary)' }}>Producto</th>
                    <th style={{ padding: '8px 12px', color: 'var(--text-secondary)', textAlign: 'right' }}>Cant. / Peso</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map(item => (
                    <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '8px 12px', fontWeight: '600' }}>{item.nombre_comercial}</td>
                      <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: '700' }}>{item.quantity} {item.presentacion}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="modal-footer">
              <button type="button" onClick={() => setShowWithdrawalConfirm(false)} className="modal-btn-cancel">
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleWithdrawalSubmit}
                className="modal-btn-confirm"
                style={{ background: '#4b5563', color: 'white' }}
              >
                Confirmar Retiro
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Balanza Modal Overlay */}
      {showScaleScan && (
        <div className="modal-overlay">
          <div className="checkout-modal fade-in" style={{ width: '460px' }}>
            <div className="modal-header">
              <h3>Simulador de Escáner de Balanza</h3>
              <button onClick={() => { setShowScaleScan(false); setScannedCode(''); }} className="close-btn">&times;</button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleScaleScanSubmit(scannedCode); }} className="checkout-form">
              <div className="form-group">
                <label>Digitar o escanear codigo</label>
                <input
                  type="text"
                  placeholder="Ej: 2000008012503 o 789123456008-1.25"
                  value={scannedCode}
                  onChange={(e) => setScannedCode(e.target.value)}
                  className="checkout-input"
                  autoFocus
                  required
                />
              </div>

              <div className="form-group">
                <label style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-light)' }}>
                  Tickets Rápidos para la Demo:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px', marginTop: '6px' }}>
                  <button
                    type="button"
                    onClick={() => handleScaleScanSubmit('2000008012503')}
                    style={{ padding: '10px', textAlign: 'left', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '12.5px', cursor: 'pointer' }}
                  >
                    Ojo de Bife - <strong>1.25 kg</strong> (Código EAN: 2000008012503)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleScaleScanSubmit('2000010008502')}
                    style={{ padding: '10px', textAlign: 'left', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '12.5px', cursor: 'pointer' }}
                  >
                    Entraña Premium - <strong>0.85 kg</strong> (Código EAN: 2000010008502)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleScaleScanSubmit('2000007015004')}
                    style={{ padding: '10px', textAlign: 'left', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '12.5px', cursor: 'pointer' }}
                  >
                    Carne Picada Especial - <strong>1.50 kg</strong> (Código EAN: 2000007015004)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleScaleScanSubmit('789123456001-3')}
                    style={{ padding: '10px', textAlign: 'left', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '12.5px', cursor: 'pointer' }}
                  >
                    Aceite Girasol 1.5L - <strong>3 botellas</strong> (Código: 789123456001-3)
                  </button>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => { setShowScaleScan(false); setScannedCode(''); }}
                  className="modal-btn-cancel"
                >
                  Cancelar
                </button>
                <button type="submit" className="modal-btn-confirm">
                  Ingresar Lectura
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .pos-main-container {
          display: flex;
          height: 100vh;
          width: 100%;
          padding-left: 260px; /* Sidebar offset */
          background-color: var(--bg-main);
          transition: var(--transition);
        }

        .pos-main-container.has-cart {
          padding-right: 380px; /* Cart offset */
        }

        .scale-scan-btn {
          padding: 8px 14px;
          border: 1px solid var(--border);
          background-color: var(--primary-light);
          color: var(--primary);
          border-radius: var(--radius-sm);
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: var(--transition);
        }

        .scale-scan-btn:hover {
          background-color: var(--primary);
          color: white;
          border-color: var(--primary);
        }

        .cart-toggle-btn {
          padding: 8px 14px;
          border: 1px solid var(--border);
          background-color: var(--bg-card);
          border-radius: var(--radius-sm);
          font-size: 13px;
          font-weight: 500;
          color: var(--text-secondary);
          cursor: pointer;
          transition: var(--transition);
        }

        .cart-toggle-btn:hover {
          border-color: var(--primary);
          color: var(--primary);
        }

        .cart-toggle-btn.active {
          background-color: var(--primary-light);
          color: var(--primary);
          border-color: var(--primary);
        }

        .pos-catalog-panel {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          padding: 24px;
          height: 100%;
          overflow: hidden;
        }

        .pos-panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 18px;
        }

        .pos-title-area h2 {
          font-size: 22px;
          color: var(--secondary);
          font-weight: 700;
        }

        .pos-caja-badge {
          display: inline-block;
          font-size: 11px;
          font-weight: 600;
          color: var(--success);
          background-color: var(--success-light);
          padding: 3px 8px;
          border-radius: 12px;
          margin-top: 4px;
        }

        .pos-header-actions {
          display: flex;
          gap: 10px;
        }

        .view-toggle-btn,
        .espera-list-btn {
          padding: 8px 14px;
          border: 1px solid var(--border);
          background-color: var(--bg-card);
          border-radius: var(--radius-sm);
          font-size: 13px;
          font-weight: 500;
          color: var(--text-secondary);
          cursor: pointer;
          transition: var(--transition);
        }

        .view-toggle-btn:hover,
        .espera-list-btn:hover {
          border-color: var(--primary);
          color: var(--primary);
        }

        .espera-list-btn.has-drafts {
          background-color: var(--warning-light);
          color: var(--warning);
          border-color: var(--warning);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(217, 119, 6, 0.4); }
          70% { box-shadow: 0 0 0 6px rgba(217, 119, 6, 0); }
          100% { box-shadow: 0 0 0 0 rgba(217, 119, 6, 0); }
        }

        /* Drafts Overlay Panel */
        .drafts-overlay-panel {
          position: absolute;
          top: 80px;
          right: 400px;
          width: 320px;
          background-color: var(--bg-card);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--border);
          z-index: 90;
          animation: fadeIn 0.2s ease-out;
        }

        .drafts-panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          border-bottom: 1px solid var(--border);
        }

        .drafts-panel-header h3 {
          font-size: 14px;
          font-weight: 600;
        }

        .drafts-panel-header .close-btn {
          background: transparent;
          border: none;
          font-size: 20px;
          cursor: pointer;
          color: var(--text-light);
        }

        .drafts-empty-state {
          padding: 20px;
          text-align: center;
          font-size: 13px;
          color: var(--text-light);
        }

        .drafts-list {
          max-height: 250px;
          overflow-y: auto;
          padding: 8px;
        }

        .draft-card {
          padding: 10px;
          border-bottom: 1px solid var(--border);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .draft-card:last-child {
          border-bottom: none;
        }

        .draft-card-info {
          display: flex;
          flex-direction: column;
        }

        .draft-time {
          font-size: 12px;
          color: var(--text-secondary);
        }

        .draft-total {
          font-size: 13px;
          font-weight: 600;
          color: var(--primary-dark);
        }

        .draft-card-actions {
          display: flex;
          gap: 6px;
        }

        .draft-btn {
          padding: 4px 8px;
          font-size: 11px;
          border: none;
          border-radius: var(--radius-sm);
          cursor: pointer;
        }

        .draft-btn.restore {
          background-color: var(--primary-light);
          color: var(--primary);
        }

        .draft-btn.delete {
          background-color: var(--danger-light);
          color: var(--danger);
        }

        /* Filter Bar */
        .pos-filter-bar {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-bottom: 18px;
        }

        .search-box-wrapper {
          display: flex;
          align-items: center;
          position: relative;
          width: 100%;
        }

        .search-icon {
          position: absolute;
          left: 14px;
          color: var(--text-light);
        }

        .search-input {
          width: 100%;
          padding: 12px 14px 12px 40px;
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          font-size: 14px;
          outline: none;
          background-color: var(--bg-card);
          box-shadow: var(--shadow-sm);
          transition: var(--transition);
        }

        .search-input:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(138, 21, 21, 0.1);
        }

        .category-tabs-container {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 4px;
        }

        .category-tab-btn {
          padding: 8px 16px;
          background-color: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          color: var(--text-secondary);
          cursor: pointer;
          white-space: nowrap;
          transition: var(--transition);
        }

        .category-tab-btn:hover {
          border-color: var(--primary);
          color: var(--primary);
        }

        .category-tab-btn.active {
          background-color: var(--primary);
          border-color: var(--primary);
          color: white;
          box-shadow: var(--shadow-sm);
        }

        /* Products Grid */
        .pos-products-scroll-area {
          flex-grow: 1;
          overflow-y: auto;
          padding-right: 4px;
        }

        .no-products-state {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 200px;
          font-size: 14px;
          color: var(--text-light);
        }

        .products-grid {
          display: grid;
          gap: 16px;
        }

        .products-grid.grid-photos {
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        }

        .products-grid.grid-compact {
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
        }

        .product-card {
          background-color: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          overflow: hidden;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          transition: var(--transition);
          box-shadow: var(--shadow-sm);
        }

        .product-id-badge {
          position: absolute;
          top: 6px;
          right: 8px;
          background-color: var(--border);
          color: var(--text-secondary);
          font-size: 10px;
          font-weight: 700;
          padding: 2px 5px;
          border-radius: 4px;
          z-index: 2;
        }

        .product-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
          border-color: var(--primary);
        }

        .product-card.in-cart {
          border-color: var(--primary);
          box-shadow: 0 0 0 2px rgba(138, 21, 21, 0.2);
          background-color: var(--primary-light);
        }

        .product-card-media {
          height: 110px;
          background-color: #f9fafb;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          border-bottom: 1px solid var(--border);
        }

        .low-stock-badge {
          position: absolute;
          top: 8px;
          left: 8px;
          font-size: 9px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 4px;
          background-color: var(--danger);
          color: white;
        }

        .product-card.low-stock .low-stock-badge {
          background-color: var(--warning);
        }

        .product-card-body {
          padding: 12px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          flex-grow: 1;
        }

        .product-card-title {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 6px;
          line-height: 1.3;
          height: 34px;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .product-card-footer {
          display: flex;
          flex-direction: column;
        }

        .product-card-price {
          font-size: 14px;
          font-weight: 700;
          color: var(--primary-dark);
        }

        .product-card-stock {
          font-size: 10px;
          color: var(--text-light);
          margin-top: 2px;
        }

        /* Compact product list */
        .grid-compact .product-card-media {
          display: none;
        }

        .grid-compact .product-card-body {
          padding: 12px;
        }

        .grid-compact .product-card-title {
          height: auto;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          display: block;
          font-size: 12px;
          margin-bottom: 4px;
        }

        .grid-compact .product-card-price {
          font-size: 13px;
        }

        /* Right Ticket Panel */
        .pos-ticket-panel {
          width: 380px;
          height: 100vh;
          background-color: var(--bg-sidebar);
          border-left: 1px solid var(--border);
          position: fixed;
          top: 0;
          right: 0;
          z-index: 95;
          display: flex;
          flex-direction: column;
          padding: 24px;
          box-shadow: -2px 0 8px rgba(0, 0, 0, 0.02);
        }

        .ticket-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--border);
          padding-bottom: 14px;
          margin-bottom: 16px;
        }

        .ticket-header h3 {
          font-size: 16px;
          font-weight: 700;
          color: var(--secondary);
        }

        .ticket-id {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-light);
          background-color: var(--bg-main);
          padding: 2px 6px;
          border-radius: 4px;
        }

        .ticket-items-area {
          flex-grow: 1;
          overflow-y: auto;
          margin-bottom: 16px;
        }

        .ticket-empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 70%;
          color: var(--text-light);
          text-align: center;
        }

        .empty-cart-icon {
          color: var(--text-light);
          margin-bottom: 12px;
          opacity: 0.6;
        }

        .ticket-empty-state p {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .ticket-empty-state .subtext {
          font-size: 11px;
          margin-top: 4px;
        }

        .ticket-items-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .ticket-item-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--border);
        }

        .ticket-item-row:last-child {
          border-bottom: none;
        }

        .ticket-item-details {
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex-grow: 1;
        }

        .item-name {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .item-qty-controls {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .qty-btn {
          width: 24px;
          height: 24px;
          border: 1px solid var(--border);
          background-color: var(--bg-card);
          border-radius: 4px;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--text-secondary);
          transition: var(--transition);
        }

        .qty-btn:hover {
          background-color: var(--primary-light);
          color: var(--primary);
          border-color: var(--primary);
        }

        .qty-input {
          width: 48px;
          height: 24px;
          border: 1px solid var(--border);
          border-radius: 4px;
          text-align: center;
          font-size: 12px;
          outline: none;
        }

        .qty-unit {
          font-size: 11px;
          color: var(--text-secondary);
          margin-left: 2px;
        }

        .ticket-item-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .item-subtotal {
          font-size: 13px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .delete-item-btn {
          background: transparent;
          border: none;
          color: var(--text-light);
          font-size: 18px;
          cursor: pointer;
          line-height: 1;
        }

        .delete-item-btn:hover {
          color: var(--danger);
        }

        /* Ticket Summary Area */
        .ticket-summary-area {
          border-top: 2px solid var(--border);
          padding-top: 14px;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          color: var(--text-secondary);
          margin-bottom: 8px;
        }

        .discount-row {
          align-items: center;
        }

        .discount-input-wrapper {
          display: flex;
          align-items: center;
          border: 1px solid var(--border);
          border-radius: 4px;
          padding: 2px 4px;
          background-color: var(--bg-main);
          width: 70px;
        }

        .discount-input {
          width: 100%;
          border: none;
          background: transparent;
          text-align: right;
          font-size: 12px;
          outline: none;
        }

        .percent-label {
          font-size: 11px;
          color: var(--text-light);
          margin-left: 2px;
        }

        .discount-amount-row {
          font-size: 12px;
          color: var(--danger);
        }

        .total-row {
          font-size: 18px;
          font-weight: 800;
          color: var(--primary-dark);
          margin-top: 10px;
          margin-bottom: 16px;
        }

        .ticket-actions {
          display: flex;
          gap: 10px;
        }

        .ticket-btn-primary,
        .ticket-btn-secondary {
          flex-grow: 1;
          padding: 12px;
          border-radius: var(--radius-sm);
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          text-align: center;
          transition: var(--transition);
        }

        .ticket-btn-primary {
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
          color: white;
          border: none;
          box-shadow: var(--shadow-sm);
        }

        .ticket-btn-primary:hover {
          background: var(--primary-hover);
          transform: translateY(-1px);
        }

        .ticket-btn-primary:disabled,
        .ticket-btn-secondary:disabled {
          background: var(--border);
          color: var(--text-light);
          border: none;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .ticket-btn-secondary {
          background-color: var(--bg-main);
          border: 1px solid var(--border);
          color: var(--text-secondary);
        }

        .ticket-btn-secondary:hover:not(:disabled) {
          border-color: var(--text-secondary);
          background-color: var(--border);
        }

        /* Modal styling */
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

        .checkout-modal {
          width: 500px;
          background-color: var(--bg-card);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-lg);
          padding: 24px;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--border);
          padding-bottom: 12px;
          margin-bottom: 18px;
        }

        .modal-header h3 {
          font-size: 16px;
          font-weight: 700;
          color: var(--secondary);
        }

        .modal-header .close-btn {
          background: transparent;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: var(--text-light);
        }

        .checkout-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .checkout-error {
          padding: 10px;
          background-color: var(--danger-light);
          color: var(--danger);
          border-radius: var(--radius-sm);
          font-size: 13px;
          font-weight: 500;
        }

        .checkout-summary-box {
          background-color: var(--primary-light);
          padding: 14px;
          border-radius: var(--radius-sm);
          text-align: center;
        }

        .summary-label {
          font-size: 12px;
          color: var(--primary-dark);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .summary-total {
          font-size: 28px;
          font-weight: 800;
          color: var(--primary-dark);
          margin-top: 4px;
        }

        .payment-methods-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          margin-top: 6px;
        }

        .payment-method-btn {
          padding: 12px;
          border: 1px solid var(--border);
          background-color: var(--bg-card);
          border-radius: var(--radius-sm);
          font-size: 13px;
          font-weight: 600;
          color: var(--text-secondary);
          cursor: pointer;
          transition: var(--transition);
        }

        .payment-method-btn:hover {
          border-color: var(--primary);
          color: var(--primary);
        }

        .payment-method-btn.active {
          background-color: var(--primary-dark);
          border-color: var(--primary-dark);
          color: white;
        }

        .checkout-input {
          padding: 10px 14px;
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          font-size: 14px;
          width: 100%;
          outline: none;
        }

        .checkout-input:focus {
          border-color: var(--primary);
        }

        .quick-cash-row {
          display: flex;
          gap: 6px;
          margin-top: 8px;
          flex-wrap: wrap;
        }

        .quick-cash-btn {
          padding: 6px 10px;
          background-color: var(--bg-main);
          border: 1px solid var(--border);
          font-size: 11px;
          font-weight: 600;
          border-radius: 4px;
          cursor: pointer;
          color: var(--text-secondary);
        }

        .quick-cash-btn:hover {
          background-color: var(--border);
          color: var(--text-primary);
        }

        .cash-change-box {
          margin-top: 14px;
          background-color: var(--success-light);
          padding: 10px 14px;
          border-radius: var(--radius-sm);
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: var(--success);
        }

        .cash-change-box span {
          font-size: 13px;
          font-weight: 600;
        }

        .cash-change-box h3 {
          font-size: 18px;
          font-weight: 700;
        }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          border-top: 1px solid var(--border);
          padding-top: 14px;
          margin-top: 10px;
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

        .modal-btn-confirm {
          padding: 10px 16px;
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
          border: none;
          color: white;
          font-size: 13px;
          font-weight: 600;
          border-radius: var(--radius-sm);
          cursor: pointer;
        }

        .modal-btn-confirm:hover {
          background: var(--primary-hover);
        }

        /* Mobile adaptation */
        @media (max-width: 1024px) {
          .pos-main-container {
            padding-left: 0;
            padding-right: 0 !important;
            padding-bottom: 64px; /* bottom nav offset */
            padding-top: 56px; /* top bar offset */
            flex-direction: column;
            height: auto;
          }

          .pos-catalog-panel {
            height: calc(100vh - 120px);
          }

          .pos-ticket-panel {
            display: none; /* In mobile we can have a toggle or modal for the ticket, but for simplicity we let them see it at the bottom or as tab */
          }
        }
      `}</style>
    </div>
  );
}
