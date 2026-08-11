// Santa Elena local database simulation using localStorage

const INITIAL_CATEGORIES = [
  { id_categoria: 1, nombre: 'CARNES', descripcion: 'Cortes premium y carnes procesadas' },
  { id_categoria: 2, nombre: 'BEBIDAS', descripcion: 'Gaseosas, jugos y aguas' },
  { id_categoria: 3, nombre: 'ABARROTES', descripcion: 'Aceites, arroz, yerba, pastas' },
  { id_categoria: 4, nombre: 'LIMPIEZA', descripcion: 'Productos de aseo y desinfección' }
];

const INITIAL_PRODUCTS = [
  {
    id: 1,
    id_categoria: 3, // Abarrotes
    codigo_barras: '789123456001',
    nombre_comercial: 'Aceite Girasol 1.5L',
    presentacion: '1.5L',
    precio_venta: 2000,
    stock_minimo: 10,
    stock: 50,
    activo: 1,
    imagen: 'aceite'
  },
  {
    id: 2,
    id_categoria: 3, // Abarrotes
    codigo_barras: '789123456002',
    nombre_comercial: 'Arroz Largo Fino 1kg',
    presentacion: '1kg',
    precio_venta: 1200,
    stock_minimo: 15,
    stock: 40,
    activo: 1,
    imagen: 'arroz'
  },
  {
    id: 3,
    id_categoria: 2, // Bebidas
    codigo_barras: '789123456003',
    nombre_comercial: 'Coca Cola 2.25L',
    presentacion: '2.25L',
    precio_venta: 2500,
    stock_minimo: 12,
    stock: 60,
    activo: 1,
    imagen: 'cocacola'
  },
  {
    id: 4,
    id_categoria: 3, // Abarrotes
    codigo_barras: '789123456004',
    nombre_comercial: 'Yerba Mate 500g',
    presentacion: '500g',
    precio_venta: 1800,
    stock_minimo: 8,
    stock: 30,
    activo: 1,
    imagen: 'yerba'
  },
  {
    id: 5,
    id_categoria: 3, // Abarrotes
    codigo_barras: '789123456005',
    nombre_comercial: 'Fideos Tallarín 500g',
    presentacion: '500g',
    precio_venta: 950,
    stock_minimo: 20,
    stock: 80,
    activo: 1,
    imagen: 'fideos'
  },
  {
    id: 6,
    id_categoria: 3, // Abarrotes
    codigo_barras: '789123456006',
    nombre_comercial: 'Puré de Tomate 520g',
    presentacion: '520g',
    precio_venta: 500,
    stock_minimo: 15,
    stock: 100,
    activo: 1,
    imagen: 'tomate'
  },
  {
    id: 7,
    id_categoria: 1, // Carnes
    codigo_barras: '789123456007',
    nombre_comercial: 'Carne Picada Especial',
    presentacion: 'kg',
    precio_venta: 3800,
    stock_minimo: 8,
    stock: 25.4,
    activo: 1,
    imagen: 'carnepicada'
  },
  {
    id: 8,
    id_categoria: 1, // Carnes
    codigo_barras: '789123456008',
    nombre_comercial: 'Ojo de Bife (Ribeye)',
    presentacion: 'kg',
    precio_venta: 12500,
    stock_minimo: 5,
    stock: 15.8,
    activo: 1,
    imagen: 'ojodebife'
  },
  {
    id: 9,
    id_categoria: 1, // Carnes
    codigo_barras: '789123456009',
    nombre_comercial: 'Nalga / Milanesa',
    presentacion: 'kg',
    precio_venta: 4800,
    stock_minimo: 10,
    stock: 22.0,
    activo: 1,
    imagen: 'nalga'
  },
  {
    id: 10,
    id_categoria: 1, // Carnes
    codigo_barras: '789123456010',
    nombre_comercial: 'Entraña Premium',
    presentacion: 'kg',
    precio_venta: 15500,
    stock_minimo: 4,
    stock: 12.5,
    activo: 1,
    imagen: 'entrana'
  }
];

const INITIAL_SHIFT = {
  id_turno: 1,
  id_usuario: 1,
  id_sucursal: 1,
  monto_apertura: 0,
  fecha_apertura: '',
  monto_cierre: 0,
  fecha_cierre: '',
  estado: 'Cerrado'
};

const INITIAL_SALES = [
  {
    id_venta: 1,
    id_sucursal: 1,
    id_turno: 1,
    id_usuario: 2,
    fecha_hora: new Date(Date.now() - 3600000 * 3).toISOString(), // 3 hours ago
    metodo_pago: 'Efectivo',
    total_venta: 5200,
    items: [
      { id_producto: 1, nombre: 'Aceite Girasol 1.5L', cantidad: 1, precio_unitario: 2000, subtotal: 2000 },
      { id_producto: 2, nombre: 'Arroz Largo Fino 1kg', cantidad: 2, precio_unitario: 1200, subtotal: 2400 },
      { id_producto: 5, nombre: 'Fideos Tallarín 500g', cantidad: 1, precio_unitario: 950, subtotal: 950 }
    ],
    subtotal: 5350,
    descuento: 150
  },
  {
    id_venta: 2,
    id_sucursal: 1,
    id_turno: 1,
    id_usuario: 2,
    fecha_hora: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
    metodo_pago: 'Tarjeta de Crédito',
    total_venta: 15500,
    items: [
      { id_producto: 10, nombre: 'Entraña Premium', cantidad: 1, precio_unitario: 15500, subtotal: 15500 }
    ],
    subtotal: 15500,
    descuento: 0
  },
  {
    id_venta: 3,
    id_sucursal: 1,
    id_turno: 1,
    id_usuario: 2,
    fecha_hora: new Date(Date.now() - 3600000 * 1).toISOString(), // 1 hour ago
    metodo_pago: 'Efectivo',
    total_venta: 7600,
    items: [
      { id_producto: 7, nombre: 'Carne Picada Especial', cantidad: 2, precio_unitario: 3800, subtotal: 7600 }
    ],
    subtotal: 7600,
    descuento: 0
  }
];

export const initDB = () => {
  if (!localStorage.getItem('se_categories')) {
    localStorage.setItem('se_categories', JSON.stringify(INITIAL_CATEGORIES));
  }
  if (!localStorage.getItem('se_products')) {
    localStorage.setItem('se_products', JSON.stringify(INITIAL_PRODUCTS));
  }
  if (!localStorage.getItem('se_sales')) {
    localStorage.setItem('se_sales', JSON.stringify(INITIAL_SALES));
  }
  if (!localStorage.getItem('se_shift')) {
    localStorage.setItem('se_shift', JSON.stringify(INITIAL_SHIFT));
  }
  if (!localStorage.getItem('se_cash_moves')) {
    localStorage.setItem('se_cash_moves', JSON.stringify([]));
  }
  if (!localStorage.getItem('se_user')) {
    // Default to guest or null, but we'll check it on login
  }
};

export const loginUser = (email, password) => {
  if (email.toLowerCase().trim() === 'admin' && password === 'admin') {
    const user = { id: 1, name: 'Admin', email: 'admin', rol: 'Administrador', id_sucursal: 1 };
    localStorage.setItem('se_user', JSON.stringify(user));
    return { success: true, user };
  }
  return { success: false, message: 'Usuario o contraseña incorrectos' };
};

export const logoutUser = () => {
  // Si hay un turno abierto al cerrar sesión, se cierra de forma automática con el efectivo esperado
  const shift = getActiveShift();
  if (shift && shift.estado === 'Abierto') {
    const allSales = getSales();
    const shiftSales = allSales.filter(s => s.id_turno === shift.id_turno);
    const cashSalesTotal = shiftSales
      .filter(s => s.metodo_pago === 'Efectivo')
      .reduce((sum, s) => sum + s.total_venta, 0);
    const moves = getCashMoves();
    const inflowsTotal = moves
      .filter(m => m.tipo_movimiento === 'Ingreso')
      .reduce((sum, m) => sum + m.monto, 0);
    const outflowsTotal = moves
      .filter(m => m.tipo_movimiento === 'Egreso')
      .reduce((sum, m) => sum + m.monto, 0);
    
    const expectedCash = shift.monto_apertura + cashSalesTotal + inflowsTotal - outflowsTotal;
    closeShift(expectedCash);
  }
  localStorage.removeItem('se_user');
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('se_user');
  return user ? JSON.parse(user) : null;
};

// Productos
export const getProducts = () => {
  initDB();
  return JSON.parse(localStorage.getItem('se_products'));
};

export const getCategories = () => {
  initDB();
  const cats = JSON.parse(localStorage.getItem('se_categories')) || [];
  return cats.map(c => ({
    id_categoria: c.id_categoria || c.id,
    nombre: c.nombre,
    descripcion: c.descripcion
  }));
};

export const saveProduct = (product) => {
  const products = getProducts();
  if (product.id) {
    // Update
    const idx = products.findIndex(p => p.id === product.id);
    if (idx !== -1) {
      products[idx] = { ...products[idx], ...product };
    }
  } else {
    // Create
    const maxId = products.reduce((max, p) => p.id > max ? p.id : max, 0);
    product.id = maxId + 1;
    product.activo = 1;
    product.imagen = product.imagen || 'default';
    products.push(product);
  }
  localStorage.setItem('se_products', JSON.stringify(products));
  return product;
};

export const deleteProduct = (id) => {
  const products = getProducts();
  const idx = products.findIndex(p => p.id === id);
  if (idx !== -1) {
    products[idx].activo = 0; // soft delete
    localStorage.setItem('se_products', JSON.stringify(products));
    return true;
  }
  return false;
};

// Caja Turnos
export const getActiveShift = () => {
  initDB();
  const shift = localStorage.getItem('se_shift');
  return shift ? JSON.parse(shift) : null;
};

export const openShift = (montoApertura) => {
  const user = getCurrentUser();
  const newShift = {
    id_turno: Date.now(),
    id_usuario: user ? user.id : 1,
    id_sucursal: 1,
    monto_apertura: Number(montoApertura),
    fecha_apertura: new Date().toISOString(),
    monto_cierre: null,
    fecha_cierre: null,
    estado: 'Abierto'
  };
  localStorage.setItem('se_shift', JSON.stringify(newShift));
  localStorage.setItem('se_cash_moves', JSON.stringify([]));
  return newShift;
};

export const closeShift = (montoCierre) => {
  const shift = getActiveShift();
  if (shift) {
    shift.monto_cierre = Number(montoCierre);
    shift.fecha_cierre = new Date().toISOString();
    shift.estado = 'Cerrado';
    localStorage.setItem('se_shift', JSON.stringify(shift));
    
    // Move to history of shifts if needed, but for simplicity we keep it as 'Cerrado'
    // A closed shift means the user has to open a new one.
    // For local convenience, we let them open one on POS screen
  }
  return shift;
};

// Movimientos de Caja
export const getCashMoves = () => {
  initDB();
  return JSON.parse(localStorage.getItem('se_cash_moves')) || [];
};

export const addCashMove = (tipo, monto, concepto) => {
  const moves = getCashMoves();
  const newMove = {
    id_movimiento: Date.now(),
    tipo_movimiento: tipo, // 'Ingreso' o 'Egreso'
    monto: Number(monto),
    concepto,
    fecha_hora: new Date().toISOString()
  };
  moves.push(newMove);
  localStorage.setItem('se_cash_moves', JSON.stringify(moves));
  return newMove;
};

// Ventas
export const getSales = () => {
  initDB();
  return JSON.parse(localStorage.getItem('se_sales')) || [];
};

export const createSale = (saleData) => {
  const sales = getSales();
  const products = getProducts();
  const shift = getActiveShift();
  const user = getCurrentUser();

  if (!shift || shift.estado !== 'Abierto') {
    throw new Error('No hay un turno de caja abierto activo.');
  }

  // Decrement stocks
  saleData.items.forEach(cartItem => {
    const prod = products.find(p => p.id === cartItem.id);
    if (prod) {
      prod.stock = Math.max(0, prod.stock - cartItem.quantity);
    }
  });
  localStorage.setItem('se_products', JSON.stringify(products));

  const newSale = {
    id_venta: Date.now(),
    id_sucursal: 1,
    id_turno: shift.id_turno,
    id_usuario: user ? user.id : 2,
    fecha_hora: new Date().toISOString(),
    metodo_pago: saleData.metodo_pago || 'Efectivo',
    total_venta: saleData.total,
    items: saleData.items.map(item => ({
      id_producto: item.id,
      nombre: item.nombre_comercial,
      cantidad: item.quantity,
      precio_unitario: item.precio_venta,
      subtotal: item.precio_venta * item.quantity
    })),
    subtotal: saleData.subtotal,
    descuento: saleData.descuento || 0,
    estado_sii: 'Pendiente' // SII status
  };

  sales.push(newSale);
  localStorage.setItem('se_sales', JSON.stringify(sales));
  return newSale;
};

// Retiros de Socios / Autoconsumo
export const getWithdrawals = () => {
  const withdrawals = localStorage.getItem('se_withdrawals');
  return withdrawals ? JSON.parse(withdrawals) : [];
};

export const registerWithdrawal = (items) => {
  // 1. Descontar stock de productos
  const products = getProducts();
  items.forEach(item => {
    const prod = products.find(p => p.id === item.id);
    if (prod) {
      prod.stock = Number((prod.stock - item.quantity).toFixed(2));
    }
  });
  localStorage.setItem('se_products', JSON.stringify(products));

  // 2. Registrar el retiro en el historial de retiros
  const withdrawals = getWithdrawals();
  const newWithdrawal = {
    id_retiro: Date.now(),
    fecha_hora: new Date().toISOString(),
    items: items.map(item => ({
      id_producto: item.id,
      nombre: item.nombre_comercial,
      cantidad: item.quantity,
      presentacion: item.presentacion
    }))
  };
  withdrawals.push(newWithdrawal);
  localStorage.setItem('se_withdrawals', JSON.stringify(withdrawals));
  return newWithdrawal;
};

export const transmitSalesToSII = (saleIds) => {
  const sales = getSales();
  sales.forEach(s => {
    if (saleIds.includes(s.id_venta)) {
      s.estado_sii = 'Enviada';
    }
  });
  localStorage.setItem('se_sales', JSON.stringify(sales));
};
