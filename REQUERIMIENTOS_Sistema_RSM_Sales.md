# ACTA DE REQUERIMIENTOS - SISTEMA RSM SALES MANAGER

**Fecha de levantamiento:** Enero 2024  
**Cliente:** [Nombre de la empresa/distribuidor]  
**Sistema:** RSM Sales Manager - Sistema de Gestión de Clientes y Ventas  
**Tipo:** Aplicación Web PWA (Progressive Web App)

---

## 1. OBJETIVO DEL SISTEMA

Desarrollar un sistema integral para la gestión de clientes, seguimiento de ventas y análisis de métricas comerciales, permitiendo a los vendedores y administradores tener control total sobre sus operaciones de venta desde cualquier dispositivo (móvil, tablet o escritorio).

---

## 2. USUARIOS DEL SISTEMA

| Rol | Descripción | Permisos |
|-----|-------------|----------|
| **Administrador** | Dueño/encargado del sistema | Acceso total, gestión de usuarios, configuración, eliminación de clientes |
| **Gerente** | Supervisor de equipo de ventas | Ver todos los clientes, filtrar por vendedor, reportes, análisis |
| **Vendedor** | Ejecutivo de ventas | Gestionar sus propios clientes, registrar ventas, ver su dashboard |

---

## 3. REQUERIMIENTOS FUNCIONALES

### 3.1 Módulo de Autenticación
- [x] Login con usuario y contraseña
- [x] Roles y permisos diferenciados (admin, gerente, vendedor)
- [x] Persistencia de sesión
- [x] Cierre de sesión seguro

### 3.2 Módulo de Clientes (CORE)

**Registro de Clientes:**
- [x] Nombre del cliente
- [x] Teléfono de contacto
- [x] Correo electrónico
- [x] Empresa (opcional)
- [x] Fecha de registro
- [x] Contactos adicionales (múltiples contactos por cliente)

**Estado del Cliente:**
- [x] Marcador "Compró" / "No compró"
- [x] Razón de no compra (campo de texto)
- [x] Observaciones/notas

**Asignación:**
- [x] Cada cliente pertenece a un vendedor
- [x] Admin/Gerente pueden reasignar clientes entre vendedores
- [x] Vendedor solo ve sus propios clientes

**Gestión:**
- [x] Crear, editar, eliminar clientes
- [x] Búsqueda/filtrado de clientes
- [x] Historial completo de cada cliente

### 3.3 Módulo de Ventas

**Registro de Ventas:**
- [x] Producto vendido
- [x] Monto de la venta
- [x] Fecha de la venta
- [x] Múltiples ventas por cliente

**Comportamiento:**
- [x] Al registrar venta, automáticamente marca cliente como "Compró"
- [x] Acumulación de ventas por cliente
- [x] Historial de todas las compras

### 3.4 Módulo de Dashboard (Panel Principal)

**KPIs y Estadísticas:**
- [x] Total de ventas en dinero ($)
- [x] Número total de clientes
- [x] Clientes que compraron vs. no compraron
- [x] Promedio de venta
- [x] Tasa de conversión (%)
- [x] Mejor venta individual
- [x] Total de transacciones

**Filtros de Tiempo:**
- [x] Hoy
- [x] Esta semana
- [x] Este mes
- [x] Todo el historial

### 3.5 Módulo de Análisis/Analytics

**Gráficas:**
- [x] Ventas por cliente (barras)
- [x] Metas y objetivos (circular/progreso)
- [x] Filtrado por vendedor (solo admin/gerente)

### 3.6 Módulo de Reportes

**Visualizaciones:**
- [x] Distribución de ventas (gráfica de pastel)
- [x] Tendencias de ventas (gráfica de línea)

**Exportación:**
- [x] Exportar reporte a PDF

**Filtros:**
- [x] Filtrar por vendedor (solo admin/gerente)

### 3.7 Módulo de Historial (Actividad)

**Seguimiento de Cambios:**
- [x] Historial completo por cliente:
  - Fecha de creación
  - Ediciones de datos
  - Ventas registradas
  - Mensajes/observaciones agregadas
  - Eliminaciones
- [x] Quién realizó cada acción
- [x] Fecha y hora de cada evento

### 3.8 Módulo de Agenda/Recordatorios

**Funcionalidad:**
- [x] Crear recordatorios con fecha y hora
- [x] Asociar recordatorio a cliente
- [x] Calendario visual de recordatorios
- [x] Lista de recordatorios pendientes/completados
- [x] Notificaciones push del navegador
- [x] Estados: Pendiente, Completado

**Estadísticas de Agenda:**
- [x] Total de recordatorios
- [x] Pendientes
- [x] Completados
- [x] Para hoy

### 3.9 Módulo de Administración de Usuarios (Solo Admin)

**Gestión de Usuarios:**
- [x] Crear nuevos usuarios
- [x] Asignar/modificar roles (admin, gerente, vendedor)
- [x] Listado de todos los usuarios
- [x] Búsqueda de usuarios

### 3.10 Módulo de Configuración

**Personalización:**
- [x] Nombre del sistema
- [x] Nombre de la empresa
- [x] Logo
- [x] Mensaje de bienvenida

**Apariencia:**
- [x] Tema oscuro (default)
- [x] Color principal configurable
- [x] Tamaño de texto

**Ventas:**
- [x] Activar/desactivar registro de ventas
- [x] IVA automático
- [x] Permitir descuentos

**Clientes:**
- [x] Teléfono obligatorio (opcional)
- [x] Correo obligatorio (opcional)

**Seguridad:**
- [x] Cambio de contraseña
- [x] Auto-cerrar sesión

**Respaldo:**
- [x] Exportar base de datos
- [x] Importar base de datos
- [x] Respaldos automáticos
- [x] Restablecer sistema

### 3.11 Funcionalidad QR (Innovación)

**Escaneo de Clientes:**
- [x] Cada cliente tiene un QR único
- [x] Página pública de escaneo (sin login)
- [x] Al escanear, muestra información básica del cliente
- [x] Permite enviar mensaje/observación con imagen adjunta
- [x] El mensaje se registra en el historial del cliente

---

## 4. REQUERIMIENTOS NO FUNCIONALES

### 4.1 Tecnología
- **Frontend:** React + Vite + TailwindCSS
- **Backend:** Node.js + Express
- **Base de Datos:** MongoDB (NoSQL)
- **Estilo:** Dark mode moderno con acentos índigo/púrpura

### 4.2 Diseño y UX
- [x] Interfaz responsive (móvil, tablet, desktop)
- [x] Diseño tipo "glassmorphism" con fondo oscuro
- [x] Animaciones suaves entre páginas
- [x] Navegación sidebar (desktop) + bottom nav (móvil)
- [x] Feedback visual con toast notifications

### 4.3 PWA (Progressive Web App)
- [x] Instalable en dispositivos móviles
- [x] Service Worker para offline
- [x] Manifest.json configurado
- [x] Iconos adaptativos

### 4.4 Seguridad
- [x] Autenticación JWT
- [x] Protección de rutas según rol
- [x] CORS configurado
- [x] Validación de permisos en backend

### 4.5 Rendimiento
- [x] Lazy loading de componentes
- [x] Suspense para carga progresiva
- [x] Optimización de imágenes (max 5MB en base64)

---

## 5. PREGUNTAS REALIZADAS AL CLIENTE DURANTE EL LEVANTAMIENTO

### 5.1 Sobre Clientes
**P:** ¿Necesitan registrar información adicional de los clientes como dirección, RFC, etc.?  
**R:** Por ahora solo nombre, teléfono, correo y empresa. Queremos mantenerlo simple.

**P:** ¿Los clientes pueden tener múltiples contactos?  
**R:** Sí, sería útil tener contactos alternos por cliente.

**P:** ¿Qué pasa si un cliente no compra? ¿Quieren registrar el motivo?  
**R:** Sí, necesitamos saber por qué no compraron para mejorar.

### 5.2 Sobre Ventas
**P:** ¿Las ventas son de productos específicos o servicios?  
**R:** Principalmente productos, pero queremos flexibilidad para escribir el nombre.

**P:** ¿Necesitan facturación integrada?  
**R:** No por ahora, solo registro de montos.

**P:** ¿El IVA debe calcularse automático o lo incluyen en el monto?  
**R:** Queremos opción de IVA automático configurable.

### 5.3 Sobre Usuarios y Roles
**P:** ¿Cuántos niveles de usuario necesitan?  
**R:** Tres: Admin (dueño), Gerente (supervisor), y Vendedor.

**P:** ¿Los gerentes deben ver solo sus vendedores o todos?  
**R:** Todos los vendedores, y poder filtrar por persona.

**P:** ¿Un vendedor puede ver clientes de otro?  
**R:** No, cada quien solo los suyos.

### 5.4 Sobre Reportes
**P:** ¿Qué tipo de reportes necesitan exportar?  
**R:** Principalmente PDF con las métricas clave.

**P:** ¿Necesitan integración con Excel o Google Sheets?  
**R:** Por ahora no, solo PDF.

### 5.5 Sobre Accesibilidad
**P:** ¿El sistema debe funcionar en celulares para los vendedores de campo?  
**R:** Sí, es crucial que sea tipo app móvil.

**P:** ¿Necesitan funcionar offline?  
**R:** Sería ideal, pero por ahora con que cargue rápido basta.

### 5.6 Sobre QR
**P:** ¿Para qué usarían códigos QR?  
**R:** Queremos poner QR en stands o tarjetas para que clientes potenciales dejen sus datos escaneando.

**P:** ¿Debe ser accesible sin login?  
**R:** Sí, para que cualquiera pueda escanear y enviar mensaje.

---

## 6. FLUJOS DE TRABAJO IDENTIFICADOS

### Flujo 1: Registro de Cliente Nuevo
1. Vendedor accede a "Clientes"
2. Clica "Nuevo Cliente"
3. Llena datos básicos (nombre, teléfono, correo)
4. Opcional: registra venta inicial
5. Sistema crea historial automático
6. Cliente aparece en lista

### Flujo 2: Seguimiento de Venta
1. Vendedor busca cliente
2. Agrega nueva venta (producto + monto)
3. Sistema marca como "Compró"
4. Se registra en historial
5. Dashboard actualiza estadísticas

### Flujo 3: Agenda de Actividades
1. Vendedor crea recordatorio con fecha/hora
2. Sistema muestra en calendario
3. Al llegar la hora, notificación push
4. Vendedor marca como completado
5. O puede editar/cancelar

### Flujo 4: Escaneo QR por Cliente
1. Cliente escanea QR desde stand/tarjeta
2. Abre página pública con sus datos
3. Puede enviar mensaje con foto
4. Vendedor recibe notificación
5. Mensaje aparece en historial del cliente

---

## 7. DECISIONES DE DISEÑO TOMADAS

### 7.1 Base de Datos NoSQL (MongoDB)
**Decisión:** Usar MongoDB con documentos embebidos  
**Justificación:** Los vendedores trabajan en campo con conexión variable. La estructura flexible permite adaptaciones rápidas sin migraciones complejas.

### 7.2 Arquitectura PWA
**Decisión:** Aplicación web progresiva en lugar de app nativa  
**Justificación:** Menor costo de desarrollo y mantenimiento. Una sola codebase para iOS, Android y web.

### 7.3 Dark Mode por Default
**Decisión:** Tema oscuro como principal  
**Justificación:** Uso prolongado en campo (menos fatiga visual), estética moderna, ahorro de batería en pantallas OLED.

### 7.4 Documentos Embebidos vs Referencias
**Decisión:** Ventas y Historial embebidos en Cliente, Vendedor como referencia  
**Justificación:** Las ventas siempre se consultan en contexto del cliente. El vendedor puede cambiar, por eso referencia.

---

## 8. ENTREGABLES DEL PROYECTO

- [x] Código fuente frontend (React + Vite)
- [x] Código fuente backend (Node.js + Express)
- [x] Base de datos MongoDB configurada
- [x] Manual de usuario básico
- [x] Diagrama de entidad-relación
- [x] Despliegue en Vercel (frontend) y servidor (backend)

---

## 9. PRÓXIMAS MEJORAS PLANEADAS (Backlog)

- [ ] Sincronización offline completa
- [ ] Integración con WhatsApp Business API
- [ ] Facturación electrónica (CFDI)
- [ ] App nativa con React Native
- [ ] Dashboard de metas personalizadas
- [ ] Gamificación para vendedores
- [ ] Integración con Google Calendar
- [ ] Reportes programados por email

---

## 10. FIRMAS

| Rol | Nombre | Firma | Fecha |
|-----|--------|-------|-------|
| Cliente | _____________ | _____________ | _______ |
| Analista/Dev | _____________ | _____________ | _______ |

---

**Documento generado:** Basado en análisis del código fuente del sistema RSM Sales Manager v1.0  
**Nota:** Este documento reconstruye los requerimientos identificados a partir del sistema implementado.
