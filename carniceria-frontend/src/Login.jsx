import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Login() {

  const [email, setEmail] = useState('admin@carnes.cl')//relleno automatico del correo para pruebas
  const [password, setPassword] = useState('123456')//relleno automatico de la contraseña para pruebas
  const [mensaje, setMensaje] = useState('')
  // Nuevo estado para controlar si se ve o no la contraseña
  const [mostrarPassword, setMostrarPassword] = useState(false)
  
  const navigate = useNavigate();

  const manejarLogin = async (e) => {
    e.preventDefault(); 
    try {
      const respuesta = await fetch('http://carniceria-backend.test/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await respuesta.json();
      
      if (respuesta.ok) {
        localStorage.setItem('token_acceso', data.token);
        navigate('/panel'); 
      } else {
        setMensaje(data.mensaje || 'Credenciales incorrectas');
      }
    } catch (error) {
      setMensaje('Error de conexión con el servidor');
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f4f6f9', fontFamily: 'sans-serif' }}>
      
      {/* Tarjeta principal */}
      <div style={{ width: '100%', maxWidth: '420px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
        
        {/* Borde rojo superior */}
        <div style={{ height: '8px', backgroundColor: '#841c1c' }}></div>

        <div style={{ padding: '40px 40px 30px 40px' }}>
          
          {/* Cabecera (Logo y Títulos) */}
          <div style={{ textAlign: 'center', marginBottom: '35px' }}>
             <div style={{ width: '64px', height: '64px', margin: '0 auto 15px', backgroundColor: '#fff', borderRadius: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid #e5e7eb', fontSize: '30px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                🥩
             </div>
             <h1 style={{ margin: 0, color: '#841c1c', fontSize: '28px', fontWeight: 'bold' }}>Santa Elena</h1>
             <p style={{ margin: '8px 0 0 0', color: '#6b7280', fontSize: '14px' }}>Sistema POS y Control de Inventario</p>
          </div>

          {/* Formulario */}
          <form onSubmit={manejarLogin} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            
            {/* Campo Usuario */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#4b5563', letterSpacing: '1.5px', marginBottom: '8px' }}>
                Usuario
              </label>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #d1d5db', borderRadius: '6px', padding: '12px 14px', backgroundColor: '#fff' }}>
                
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ingrese su usuario"
                  style={{ border: 'none', outline: 'none', width: '100%', fontSize: '15px', color: '#374151' }}
                />
              </div>
            </div>

            {/* Campo Contraseña */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#4b5563', letterSpacing: '1.5px', marginBottom: '8px' }}>
                CONTRASEÑA
              </label>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #d1d5db', borderRadius: '6px', padding: '12px 14px', backgroundColor: '#fff' }}>
                
                <input
                  // Aquí ocurre la magia: cambiamos el tipo de input según el estado
                  type={mostrarPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ border: 'none', outline: 'none', width: '100%', fontSize: '15px', color: '#374151', letterSpacing: mostrarPassword ? 'normal' : '2px' }}
                />
                
                {/* Botón para alternar visibilidad */}
                <button
                  type="button"
                  onClick={() => setMostrarPassword(!mostrarPassword)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginLeft: '10px', fontSize: '17px' }}
                  title="Mostrar/Ocultar Contraseña"
                >
                  {mostrarPassword ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
            </div>

            {/* Botón Entrar */}
            <button type="submit" style={{ marginTop: '10px', padding: '15px', backgroundColor: '#841c1c', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '17px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', transition: 'background-color 0.2s' }}>
              <span style={{ fontSize: '20px' }}>➜]</span> Entrar al Sistema
            </button>
          </form>

          <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '35px 0 25px' }} />

          {/* Footer de estado */}
          <div style={{ textAlign: 'center', fontSize: '12px', color: '#6b7280', fontFamily: 'monospace', letterSpacing: '1px' }}>
            Desarrollado • Genesis-R
          </div>
          
        </div>
      </div>
    </div>
  )
}

export default Login