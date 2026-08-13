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

const INITIAL_FACTURAS_RECIBIDAS = [
  {
    id_dte: 1,
    tipo_dte: 33,
    folio: 48523,
    fecha_emision: '2026-08-10',
    fecha_recepcion_sii: '2026-08-10T14:30:00',
    rut_emisor: '76.543.210-K',
    razon_social_emisor: 'Frigorífico Temuco SpA',
    giro_emisor: 'Procesamiento y Distribución de Carnes',
    rut_receptor: '77.888.999-1',
    monto_neto: 485000,
    iva: 92150,
    monto_total: 577150,
    estado: 'Pendiente',
    dias_restantes: 6,
    items: [
      { descripcion: 'Ojo de Bife (Ribeye) Premium', cantidad: 15, unidad: 'kg', precio_unitario: 9500, subtotal: 142500 },
      { descripcion: 'Entraña Premium Angus', cantidad: 12, unidad: 'kg', precio_unitario: 11800, subtotal: 141600 },
      { descripcion: 'Nalga / Milanesa', cantidad: 20, unidad: 'kg', precio_unitario: 3800, subtotal: 76000 },
      { descripcion: 'Carne Picada Especial', cantidad: 30, unidad: 'kg', precio_unitario: 2800, subtotal: 84000 },
      { descripcion: 'Flete refrigerado', cantidad: 1, unidad: 'servicio', precio_unitario: 40900, subtotal: 40900 }
    ],
    observaciones: 'Despacho Lote #L2026-0810. Camión frigorífico patente BGKR-42.'
  },
  {
    id_dte: 2,
    tipo_dte: 33,
    folio: 12087,
    fecha_emision: '2026-08-06',
    fecha_recepcion_sii: '2026-08-06T09:15:00',
    rut_emisor: '78.901.234-5',
    razon_social_emisor: 'Distribuidora Don Carlos Ltda.',
    giro_emisor: 'Venta al por mayor de abarrotes',
    rut_receptor: '77.888.999-1',
    monto_neto: 124000,
    iva: 23560,
    monto_total: 147560,
    estado: 'Aceptada',
    dias_restantes: 0,
    fecha_aceptacion: '2026-08-07T10:00:00',
    items: [
      { descripcion: 'Aceite Girasol 1.5L (caja x12)', cantidad: 2, unidad: 'caja', precio_unitario: 22000, subtotal: 44000 },
      { descripcion: 'Arroz Largo Fino 1kg (fardo x10)', cantidad: 3, unidad: 'fardo', precio_unitario: 10000, subtotal: 30000 },
      { descripcion: 'Fideos Tallarín 500g (paquete x20)', cantidad: 2, unidad: 'paquete', precio_unitario: 8500, subtotal: 17000 },
      { descripcion: 'Yerba Mate 500g (paquete x10)', cantidad: 2, unidad: 'paquete', precio_unitario: 16500, subtotal: 33000 }
    ],
    observaciones: 'Pedido semanal habitual. Guía despacho #GD-4521.'
  },
  {
    id_dte: 3,
    tipo_dte: 33,
    folio: 7841,
    fecha_emision: '2026-08-12',
    fecha_recepcion_sii: '2026-08-12T16:45:00',
    rut_emisor: '80.112.233-7',
    razon_social_emisor: 'Carnes del Sur S.A.',
    giro_emisor: 'Faenamiento y Comercialización de Ganado',
    rut_receptor: '77.888.999-1',
    monto_neto: 890000,
    iva: 169100,
    monto_total: 1059100,
    estado: 'Pendiente',
    dias_restantes: 7,
    items: [
      { descripcion: 'Lomo Vetado Novillo', cantidad: 25, unidad: 'kg', precio_unitario: 12000, subtotal: 300000 },
      { descripcion: 'Costillar Cerdo', cantidad: 40, unidad: 'kg', precio_unitario: 4500, subtotal: 180000 },
      { descripcion: 'Pechuga Pollo (bandeja 2kg)', cantidad: 50, unidad: 'bandeja', precio_unitario: 4200, subtotal: 210000 },
      { descripcion: 'Chorizo Parrillero (paquete 1kg)', cantidad: 30, unidad: 'paquete', precio_unitario: 3500, subtotal: 105000 },
      { descripcion: 'Longaniza Artesanal (paquete 1kg)', cantidad: 20, unidad: 'paquete', precio_unitario: 4000, subtotal: 80000 },
      { descripcion: 'Flete y seguro de carga', cantidad: 1, unidad: 'servicio', precio_unitario: 15000, subtotal: 15000 }
    ],
    observaciones: 'Lote #LS-2026-2247. Guía sanitaria SAG adjunta. Temperatura recepción: -2°C.'
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
  if (!localStorage.getItem('se_facturas_recibidas')) {
    localStorage.setItem('se_facturas_recibidas', JSON.stringify(INITIAL_FACTURAS_RECIBIDAS));
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
    estado_sii: 'Pendiente', // SII status
    transbank_auth_code: saleData.transbank_auth_code || null,
    transbank_last4: saleData.transbank_last4 || null,
    transbank_response_code: saleData.transbank_response_code || null
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

// Facturas Recibidas (DTE 33 - Compras a proveedores)
export const getFacturasRecibidas = () => {
  initDB();
  return JSON.parse(localStorage.getItem('se_facturas_recibidas')) || [];
};

export const aceptarFactura = (id_dte) => {
  const facturas = getFacturasRecibidas();
  const idx = facturas.findIndex(f => f.id_dte === id_dte);
  if (idx !== -1) {
    facturas[idx].estado = 'Aceptada';
    facturas[idx].dias_restantes = 0;
    facturas[idx].fecha_aceptacion = new Date().toISOString();
    localStorage.setItem('se_facturas_recibidas', JSON.stringify(facturas));
  }
  return facturas[idx];
};

export const reclamarFactura = (id_dte, tipoReclamo, motivo) => {
  const facturas = getFacturasRecibidas();
  const idx = facturas.findIndex(f => f.id_dte === id_dte);
  if (idx !== -1) {
    facturas[idx].estado = 'Reclamada';
    facturas[idx].dias_restantes = 0;
    facturas[idx].tipo_reclamo = tipoReclamo;
    facturas[idx].motivo_reclamo = motivo;
    facturas[idx].fecha_reclamo = new Date().toISOString();
    localStorage.setItem('se_facturas_recibidas', JSON.stringify(facturas));
  }
  return facturas[idx];
};

export const ingresarStockFactura = (id_dte) => {
  const facturas = getFacturasRecibidas();
  const factura = facturas.find(f => f.id_dte === id_dte);
  if (!factura) throw new Error('Factura no encontrada');
  if (factura.stock_ingresado) {
    throw new Error('El stock de esta factura ya fue ingresado previamente.');
  }

  const products = getProducts();
  let actualizados = 0;
  let creados = 0;
  const itemsIngresados = [];

  const normalize = str => str.toLowerCase().normalize("NFD").replace(/[\u0300-\u06ff]/g, "").trim();

  factura.items.forEach(item => {
    const descLower = item.descripcion.toLowerCase();
    // Omitir servicios no inventariables (flete, seguro, etc.)
    if (descLower.includes('flete') || descLower.includes('seguro') || descLower.includes('despacho') || descLower.includes('servicio')) {
      return;
    }

    const itemNorm = normalize(item.descripcion);

    // Buscar coincidencia por nombre comercial o similar
    let prodMatch = products.find(p => {
      const pNorm = normalize(p.nombre_comercial);
      return pNorm === itemNorm || itemNorm.includes(pNorm) || pNorm.includes(itemNorm);
    });

    if (prodMatch) {
      // ✅ EXISTE: Incrementar stock
      prodMatch.stock = Math.round((Number(prodMatch.stock) + Number(item.cantidad)) * 100) / 100;
      actualizados++;
      itemsIngresados.push({
        nombre: prodMatch.nombre_comercial,
        cantidad: item.cantidad,
        tipo: 'actualizado',
        nuevoStock: prodMatch.stock
      });
    } else {
      // ✨ NO EXISTE: Crear nuevo producto en el catálogo
      const maxId = products.reduce((max, p) => p.id > max ? p.id : max, 0);
      const isCarnes = descLower.includes('carne') || descLower.includes('lomo') || descLower.includes('bife') || descLower.includes('entraña') || descLower.includes('nalga') || descLower.includes('cerdo') || descLower.includes('pollo') || descLower.includes('chorizo') || descLower.includes('longaniza') || descLower.includes('costillar') || descLower.includes('vacuno') || descLower.includes('novillo');

      const newProduct = {
        id: maxId + 1,
        id_categoria: isCarnes ? 1 : 3, // 1: Carnes, 3: Abarrotes
        codigo_barras: '789' + String(Date.now()).slice(-9),
        nombre_comercial: item.descripcion,
        presentacion: item.unidad || 'kg',
        precio_venta: Math.round(item.precio_unitario * 1.30), // Precio sugerido de venta (+30% margen)
        stock_minimo: 5,
        stock: Number(item.cantidad),
        activo: 1,
        imagen: isCarnes ? 'carnepicada' : 'aceite'
      };

      products.push(newProduct);
      creados++;
      itemsIngresados.push({
        nombre: newProduct.nombre_comercial,
        cantidad: item.cantidad,
        tipo: 'creado',
        nuevoStock: newProduct.stock
      });
    }
  });

  // Guardar catálogo actualizado
  localStorage.setItem('se_products', JSON.stringify(products));

  // Marcar la factura como stock ingresado
  factura.stock_ingresado = true;
  factura.fecha_ingreso_stock = new Date().toISOString();
  localStorage.setItem('se_facturas_recibidas', JSON.stringify(facturas));

  return { actualizados, creados, itemsIngresados };
};
