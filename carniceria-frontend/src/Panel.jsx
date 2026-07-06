import { useNavigate } from 'react-router-dom'

function Panel() {
  const navigate = useNavigate();

  const cerrarSesion = () => {
    // 1. Borramos el token del navegador
    localStorage.removeItem('token_acceso');
    // 2. Lo devolvems a la pantalla de login
    navigate('/');
  }

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f8f9fa', fontFamily: 'sans-serif' }}>
      
      {/* 1. BARRA LATERAL (Sidebar) */}
      <div style={{ width: '240px', backgroundColor: 'white', borderRight: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb' }}>
          <h2 style={{ color: '#991b1b', margin: 0 }}>Santa Elena</h2>
          <small style={{ color: '#6b7280' }}>Software de gestión</small>
        </div>
        
        <nav style={{ padding: '10px', flex: 1 }}>
          <button style={{ width: '100%', padding: '12px', backgroundColor: '#991b1b', color: 'white', border: 'none', borderRadius: '6px', textAlign: 'left', fontWeight: 'bold', marginBottom: '10px', cursor: 'pointer' }}>
             Nueva Venta
          </button>
          <button style={{ width: '100%', padding: '12px', backgroundColor: 'transparent', color: '#374151', border: 'none', textAlign: 'left', fontWeight: 'bold', marginBottom: '10px', cursor: 'pointer' }}>
             Stock Disponible
          </button>
          <button style={{ width: '100%', padding: '12px', backgroundColor: 'transparent', color: '#374151', border: 'none', textAlign: 'left', fontWeight: 'bold', marginBottom: '10px', cursor: 'pointer' }}>
             Cerrar Caja
          </button>
          <button style={{ width: '100%', padding: '12px', backgroundColor: 'transparent', color: '#374151', border: 'none', textAlign: 'left', fontWeight: 'bold', marginBottom: '10px', cursor: 'pointer' }}>
             Resumen
          </button>
        </nav>

        <div style={{ padding: '20px', borderTop: '1px solid #e5e7eb' }}>
          <button onClick={cerrarSesion} style={{ width: '100%', padding: '10px', backgroundColor: '#f3f4f6', color: '#ef4444', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* 2. ÁREA CENTRAL (Productos) */}
      <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ margin: '0 0 20px 0', color: '#1f2937' }}>Terminal POS - Nueva Venta</h2>
        
        {/* Grilla de productos de prueba */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '15px' }}>
            <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '8px', border: '1px solid #e5e7eb', cursor: 'pointer' }}>
                <p style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: 'bold' }}>Corte Lomo Vetado</p>
                <h3 style={{ margin: 0, color: '#991b1b' }}>$12.500</h3>
            </div>
            <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '8px', border: '1px solid #e5e7eb', cursor: 'pointer' }}>
                <p style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: 'bold' }}>Costillar de Cerdo</p>
                <h3 style={{ margin: 0, color: '#991b1b' }}>$8.900</h3>
            </div>
        </div>
      </div>

      {/* 3. BARRA DERECHA (Ticket Actual) */}
      <div style={{ width: '300px', backgroundColor: 'white', borderLeft: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px', backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
            <h3 style={{ margin: 0 }}>Ticket Actual</h3>
        </div>
        
        <div style={{ flex: 1, padding: '20px' }}>
            {/* Aquí irán los productos agregados */}
            <p style={{ color: '#9ca3af', textAlign: 'center', marginTop: '50px' }}>No hay productos en el ticket</p>
        </div>

        <div style={{ padding: '20px', borderTop: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                <span style={{ fontSize: '20px', fontWeight: 'bold' }}>TOTAL</span>
                <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#991b1b' }}>$0</span>
            </div>
            <button style={{ width: '100%', padding: '15px', backgroundColor: '#991b1b', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>
                COBRAR
            </button>
        </div>
      </div>

    </div>
  )
}

export default Panel