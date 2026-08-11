# 🥩 Carnicería POS - Guía de Integración: Transbank POS y SII Chile

Este documento detalla la arquitectura, requisitos y pasos para implementar **Transbank POS Integrado** y la **Conexión con el SII** (Boletas electrónicas y Recepción de facturas/lotes) en el sistema.

---

## 💳 1. Integración Transbank POS Integrado

### 🎯 Objetivo
Que al seleccionar **"Tarjeta"** en la pantalla del POS Web (`POS.jsx`), el monto se envíe **automáticamente** a la máquina cobradora Transbank y el sistema detecte la aprobación sin que el cajero digite montos manualmente.

### 🔄 Flujo de Trabajo
1. **Selección de Pago**: El cajero hace clic en *Pagar con Tarjeta*.
2. **Envío de Petición**: El sistema envía el monto (ej. `$15.000`) a la API local de Transbank.
3. **Cobro Físico**: El terminal Transbank pita y muestra en pantalla `PASE O INSERTE TARJETA - $15.000`.
4. **Confirmación Automática**:
   - Si la transacción es **Aprobada**, Transbank responde con código `00` + número de autorización.
   - El POS en React confirma la venta, descuenta el stock e imprime la boleta automáticamente.
   - Si es **Rechazada**, el sistema muestra la alerta y permite reintentar o cambiar a efectivo.

### 📋 Requisitos Previos
* Contrato con Transbank en modalidad **"POS Integrado"** (equipos Verifone, Ingenico o Pax integrables por cable USB o Red Local IP).
* Instalación del **Transbank POS Agent** en la computadora de la caja.

### 🛠️ Pasos de Implementación Técnica
1. **Instalar el SDK / Agent de Transbank** (`transbank-pos-sdk-nodejs` o `transbank-pos-sdk-php`).
2. **Endpoint en Laravel**: Crear `/api/transbank/cobrar` que reciba `monto` e `id_venta`.
3. **Modal en React (`POS.jsx`)**:
   - Mostrar modal flotante: *"Pase la tarjeta en el equipo Transbank..."* con botón de cancelar.
   - Procesar respuesta y cerrar modal al aprobar.

---

## 🧾 2. Integración con el SII (Boletas y Recepción de Facturas/Lotes)

### 🎯 Objetivo
- **Emisión de Boletas Electrónicas (DTE 39)**: Entregar vales/boletas electrónicas válidas ante el SII.
- **Recepción de Camión / Lotes de Compra**: Leer las facturas de proveedores (DTE 33) que llegan a tu RUT, registrar kilos/unidades recibidas, número de **Lote** y **Fecha de Vencimiento**.

---

### 🟢 Opciones de API DTE en Chile

| Proveedor / Método | Costo Mensual | Nivel de Dificultad | Descripción |
| :--- | :---: | :---: | :--- |
| **LibreDTE (Self-Hosted)** | **$0 CLP (Gratis)** | **Media (5/10)** | Código abierto PHP. Se instala en el mismo servidor. Cero costo por folios. |
| **SimpleAPI** (`simpleapi.cl`) | **~$5.000 - $8.000 CLP** | **Fácil (4/10)** | API REST muy barata para PyMEs. Emisión rápida de boletas y lectura de DTEs. |
| **OpenFactura / Haulmer** | **~$7.000 - $12.000 CLP** | **Fácil (4/10)** | La API DTE más moderna y rápida en Chile. Documentación muy completa para Laravel. |

---

### 🚚 2.1 Recepción de Facturas de Proveedores (Camión y Lotes)

1. El proveedor (frigorífico) emite la Factura Electrónica (DTE 33) al RUT de la carnicería.
2. La API DTE recibe el XML y notifica al backend Laravel.
3. **Pantalla en el POS**: Muestra *"Nueva factura recibida de Frigorífico X por 250 kg"*.
4. **Formulario de Lotes**:
   - El encargado valida la mercadería que baja del camión.
   - Asigna a los productos: **Número de Lote**, **Fecha de Vencimiento** y confirma kilos/unidades recibidas.
5. Al hacer clic en *"Ingresar a Stock"*, el inventario del POS se actualiza automáticamente con trazabilidad de lotes.

---

### 📑 2.2 Emisión de Boletas al SII (Modelo Recomendado)

* **Envío en Lote al Cierre de Caja + RCOF**:
  - Durante el día, el POS firma e imprime cada boleta al instante con su **Timbre Electrónico (código PDF417)** y número de folio (vía CAF).
  - Funciona de forma ultrarrápida y **sigue operando aunque se corte Internet**.
  - Al cerrar la caja al final del día, el sistema envía todas las boletas del turno en un paquete + el informe diario **RCOF** exigido por el SII.

---

## 📌 3. Hoja de Ruta Sugerida (Fases de Desarrollo)

1. **Fase 1 (Actual)**: Conectar Laravel con la base de datos MySQL Workbench (migrar tablas de usuarios, productos, ventas, lotes).
2. **Fase 2**: Integrar la librería Transbank POS Integrado en `POS.jsx` y controlador Laravel.
3. **Fase 3**: Conectar la API DTE (LibreDTE / SimpleAPI / OpenFactura) para la emisión de boletas y módulo de recepción de facturas de compra con lotes.

---
*Documentación generada para el sistema Carnicería POS - React + Laravel*
