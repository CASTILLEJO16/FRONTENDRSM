import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Save, X, TrendingUp, TrendingDown, Users, LogOut, UserPlus, Key } from 'lucide-react';
import { PieChart, Pie, Tooltip, Legend, Cell } from "recharts";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid, 
  ResponsiveContainer
} from "recharts";


export default function SalesRSM() {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showLogin, setShowLogin] = useState(true);
  const [showRegister, setShowRegister] = useState(false);
  const [showHistorialModal, setShowHistorialModal] = useState(false);
  const [historialCliente, setHistorialCliente] = useState(null);



  // 🔥 NUEVO: Alertas amigables
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');

  const showAlert = (type, msg) => {
    setAlertType(type);
    setAlertMessage(msg);
    setTimeout(() => setAlertMessage(''), 2500);
  };

  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [registerData, setRegisterData] = useState({ username: '', password: '', nombre: '' });
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    email: '',
    empresa: '',
    compro: null,
    razonNoCompra: '',
    observaciones: '',
    vendedor: '',
    fecha: new Date().toISOString().split('T')[0]
  });

  // 🔥 Componente para alertas visuales
  const Alert = ({ type, message }) => {
    if (!message) return null;

    const styles = {
      success: "bg-green-100 text-green-800 border-green-300",
      error: "bg-red-100 text-red-800 border-red-300"
    };

    return (
      <div className={`border px-4 py-3 rounded-lg mb-4 ${styles[type]}`}>
        {message}
      </div>
    );
  };

  useEffect(() => {
    loadUsers();
    loadClients();
  }, []);

  const loadUsers = () => {
  try {
    const data = localStorage.getItem('rsm-users');
    if (data) setUsers(JSON.parse(data));
  } catch {}
};


 const loadClients = () => {
  try {
    const data = localStorage.getItem('rsm-clients');
    if (data) setClients(JSON.parse(data));
  } catch {}
};


 const saveUsers = (updatedUsers) => {
  try {
    localStorage.setItem('rsm-users', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
  } catch {
    showAlert('error', 'Error al guardar usuarios');
  }
};


 const saveClients = (updatedClients) => {
  try {
    localStorage.setItem('rsm-clients', JSON.stringify(updatedClients));
    setClients(updatedClients);
  } catch {
    showAlert('error', 'Error al guardar clientes');
  }
};


  const handleLogin = () => {
    if (!loginData.username || !loginData.password) {
      showAlert('error', 'Completa todos los campos');
      return;
    }

    const user = users.find(
      u => u.username === loginData.username && u.password === loginData.password
    );

    if (!user) {
      showAlert('error', 'Usuario o contraseña incorrectos');
      return;
    }

    setCurrentUser(user);
    setShowLogin(false);
    showAlert('success', 'Inicio de sesión exitoso');
    setLoginData({ username: '', password: '' });
  };

  const handleRegister = () => {
    if (!registerData.username || !registerData.password || !registerData.nombre) {
      showAlert('error', 'Completa todos los campos');
      return;
    }

    if (users.find(u => u.username === registerData.username)) {
      showAlert('error', 'Ese usuario ya existe');
      return;
    }

    const newUser = {
      id: Date.now().toString(),
      username: registerData.username,
      password: registerData.password,
      nombre: registerData.nombre
    };

    saveUsers([...users, newUser]);
    showAlert('success', 'Usuario registrado exitosamente');
    setShowRegister(false);
    setRegisterData({ username: '', password: '', nombre: '' });
  };

 const handleSubmit = () => {
  if (!formData.nombre || !formData.telefono) {
    showAlert('error', 'Faltan campos obligatorios');
    return;
  }

  if (formData.compro === false && !formData.razonNoCompra) {
    showAlert('error', 'Indica por qué no compró');
    return;
  }

  if (editingId) {
    const updated = clients.map(c =>
      c.id === editingId
        ? {
            ...formData,
            id: editingId,
            vendedor: c.vendedor,
            ventas: c.ventas || []
          }
        : c
    );
    saveClients(updated);
    showAlert('success', 'Cliente actualizado correctamente');
  } else {
    const newClient = {
      ...formData,
      id: Date.now().toString(),
      vendedor: currentUser.nombre,
      ventas: formData.monto
        ? [
            {
              producto: formData.producto,
              monto: Number(formData.monto),
              fecha: new Date().toISOString()
            }
          ]
        : []
    };

    saveClients([...clients, newClient]);
    showAlert('success', 'Cliente registrado correctamente');
  }

  resetForm(); // SE LLAMA AQUÍ
};


  const resetForm = () => {
    setFormData({
      nombre: '',
      telefono: '',
      email: '',
      empresa: '',
      compro: null,
      razonNoCompra: '',
      observaciones: '',
      vendedor: '',
      fecha: new Date().toISOString().split('T')[0]
    });
    setEditingId(null);
    setIsFormOpen(false);
  };

  const handleDelete = id => {
    if (confirm('¿Seguro de eliminar?')) {
      saveClients(clients.filter(c => c.id !== id));
      showAlert('success', 'Cliente eliminado');
    }
  };

  const filteredClients = clients.filter(c =>
    [c.nombre, c.empresa, c.email, c.vendedor]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: clients.length,
    compraron: clients.filter(c => c.compro === true).length,
    noCompraron: clients.filter(c => c.compro === false).length,
    pendientes: clients.filter(c => c.compro === null).length
  };
   
  const pieData = [
  { name: "Compraron", value: stats.compraron },
  { name: "No Compraron", value: stats.noCompraron },
  { name: "Pendientes", value: stats.pendientes }
];

const PIE_COLORS = ["#22c55e", "#ef4444", "#facc15"];

  // ============================
  // UI LOGIN / REGISTRO
  // ============================

  if (showLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">

          <Alert type={alertType} message={alertMessage} />

          {!showRegister ? (
            <>
              <div className="text-center mb-8">
                <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="text-white" size={32} />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Sistema RSM Ventas</h1>
                <p className="text-gray-600">Inicia sesión para continuar</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
                  <input
                    type="text"
                    value={loginData.username}
                    onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                  <input
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  onClick={handleLogin}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg flex items-center justify-center gap-2"
                >
                  <Key size={20} /> Iniciar Sesión
                </button>

                <button
                  onClick={() => setShowRegister(true)}
                  className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 rounded-lg"
                >
                  Registrar Nuevo Usuario
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserPlus className="text-white" size={32} />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Registro de Usuario</h1>
                <p className="text-gray-600">Crea una nueva cuenta</p>
              </div>

              <Alert type={alertType} message={alertMessage} />

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Nombre completo"
                  value={registerData.nombre}
                  onChange={(e) => setRegisterData({ ...registerData, nombre: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                />

                <input
                  type="text"
                  placeholder="Usuario"
                  value={registerData.username}
                  onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                />

                <input
                  type="password"
                  placeholder="Contraseña"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                />

                <button
                  onClick={handleRegister}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg"
                >
                  Crear Cuenta
                </button>

                <button
                  onClick={() => setShowRegister(false)}
                  className="w-full border border-gray-300 hover:bg-gray-50 py-3 rounded-lg"
                >
                  Volver al Login
                </button>
              </div>
            </>
          )}

        </div>
      </div>
    );
  }
   // ============================
// DATOS PARA GRAFICA DE BARRAS
// ============================
const datosGrafica = clients.map(cliente => {
  const totalVentas = (cliente.ventas || []).reduce(
    (sum, v) => sum + Number(v.monto || 0),
    0
  );

  return {
    nombre: cliente.nombre,
    total: totalVentas
  };
});

  // ============================
  // UI PRINCIPAL
  // ============================

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">

        <Alert type={alertType} message={alertMessage} />

        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Sistema de Gestión de Clientes</h1>
              <p className="text-gray-600">
                Bienvenido, <span className="font-semibold text-blue-600">{currentUser.nombre}</span>
              </p>
            </div>
            <button
              onClick={() => {
                setCurrentUser(null);
                setShowLogin(true);
                showAlert('success', 'Sesión cerrada');
              }}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
            >
              <LogOut size={20} /> Cerrar Sesión
            </button>

              


          </div>
        </div>

        



       {/* Gráfica de Ventas por Cliente */}
<div className="bg-white p-6 rounded-2xl shadow mb-6">
  <h2 className="text-xl font-bold mb-4">Ventas por Cliente</h2>

  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={datosGrafica}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="nombre" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="total" fill="#4F46E5" name="Monto Total" />
    </BarChart>
  </ResponsiveContainer>
</div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600">Total Clientes</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="bg-green-50 rounded-lg shadow p-4">
            <p className="text-green-800">Compraron</p>
            <p className="text-2xl font-bold">{stats.compraron}</p>
          </div>
          <div className="bg-red-50 rounded-lg shadow p-4">
            <p className="text-red-800">No Compraron</p>
            <p className="text-2xl font-bold">{stats.noCompraron}</p>
          </div>
          <div className="bg-yellow-50 rounded-lg shadow p-4">
            <p className="text-yellow-800">Pendientes</p>
            <p className="text-2xl font-bold">{stats.pendientes}</p>
          </div>
        </div>
     {/* Gráfica de pastel */}
<div className="bg-white rounded-xl shadow-lg p-6 mb-6 flex justify-center">
  <div>
    <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
      Resumen de Clientes
    </h2>

    <PieChart width={380} height={320}>
      <Pie
        data={pieData}
        cx={180}
        cy={150}
        outerRadius={100}
        fill="#8884d8"
        dataKey="value"
        label
      >
        {pieData.map((entry, index) => (
          <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  </div>
</div>
            {/* Modal de Historial */}
{showHistorialModal && historialCliente && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg relative">

      <h2 className="text-2xl font-bold mb-4">Historial de {historialCliente.nombre}</h2>

      {historialCliente.ventas && historialCliente.ventas.length > 0 ? (
        <div className="space-y-3">
          {historialCliente.ventas.map((v, index) => (
            <div key={index} className="border p-3 rounded-lg">
              <p><strong>Producto:</strong> {v.producto}</p>
              <p><strong>Monto:</strong> ${v.monto}</p>
              <p><strong>Fecha:</strong> {new Date(v.fecha).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No hay ventas registradas.</p>
      )}

      <button
        onClick={() => setShowHistorialModal(false)}
        className="mt-4 w-full bg-red-500 text-white py-2 rounded-lg"
      >
        Cerrar
      </button>
    </div>
  </div>
)}

        {/* Barra de búsqueda */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Buscar clientes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
              />
            </div>


            <button
              onClick={() => setIsFormOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus size={18} /> Nuevo Cliente
            </button>
          </div>
        </div>

        {/* Modal Cliente */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6">

              <Alert type={alertType} message={alertMessage} />

              <div className="flex justify-between mb-4">
                <h2 className="text-2xl font-bold">
                  {editingId ? 'Editar Cliente' : 'Nuevo Cliente'}
                </h2>
                <button onClick={resetForm}>
                  <X size={24} className="text-gray-500 hover:text-gray-700" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Nombre + Teléfono */}
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Nombre *"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className="px-3 py-2 border rounded-lg"
                  />

                  <input
                    type="text"
                    placeholder="Teléfono *"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    className="px-3 py-2 border rounded-lg"
                  />
                </div>
                  {/* Producto vendido */}
<input
  type="text"
  placeholder="Producto vendido"
  value={formData.producto || ""}
  onChange={(e) => setFormData({ ...formData, producto: e.target.value })}
  className="px-3 py-2 border rounded-lg w-full"
/>

{/* Monto de la venta */}
<input
  type="number"
  placeholder="Monto de la venta"
  value={formData.monto || ""}
  onChange={(e) => setFormData({ ...formData, monto: Number(e.target.value) })}
  className="px-3 py-2 border rounded-lg w-full"
/>

                {/* Email + Empresa */}
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="px-3 py-2 border rounded-lg"
                  />

                  <input
                    type="text"
                    placeholder="Empresa"
                    value={formData.empresa}
                    onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                    className="px-3 py-2 border rounded-lg"
                  />
                </div>

                <input
                  type="date"
                  value={formData.fecha}
                  onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                  className="px-3 py-2 border rounded-lg w-full"
                />

                {/* Estado */}
                <div>
                  <p className="mb-1 text-gray-700 font-medium">¿Realizó la compra? *</p>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={formData.compro === true}
                        onChange={() => setFormData({ ...formData, compro: true, razonNoCompra: '' })}
                      />
                      Sí, compró
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={formData.compro === false}
                        onChange={() => setFormData({ ...formData, compro: false })}
                      />
                      No compró
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={formData.compro === null}
                        onChange={() => setFormData({ ...formData, compro: null, razonNoCompra: '' })}
                      />
                      Pendiente
                    </label>
                  </div>
                </div>

                {formData.compro === false && (
                  <textarea
                    placeholder="¿Por qué no compró? *"
                    value={formData.razonNoCompra}
                    onChange={(e) => setFormData({ ...formData, razonNoCompra: e.target.value })}
                    className="px-3 py-2 border rounded-lg w-full"
                  />
                )}

                <textarea
                  placeholder="Observaciones"
                  value={formData.observaciones}
                  onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                  className="px-3 py-2 border rounded-lg w-full"
                />

                <div className="flex gap-3 pt-4">
                    {/* Registrar nueva venta (solo si se edita un cliente) */}
{editingId && (
  <div className="p-4 border rounded-lg bg-gray-50 mb-4">
    <h3 className="text-lg font-bold mb-3">Registrar Nueva Venta</h3>

    <input
      type="text"
      placeholder="Producto"
      value={formData.nuevaVentaProducto || ""}
      onChange={(e) =>
        setFormData({ ...formData, nuevaVentaProducto: e.target.value })
      }
      className="px-3 py-2 border rounded-lg w-full mb-3"
    />

    <input
      type="number"
      placeholder="Monto"
      value={formData.nuevaVentaMonto || ""}
      onChange={(e) =>
        setFormData({ ...formData, nuevaVentaMonto: Number(e.target.value) })
      }
      className="px-3 py-2 border rounded-lg w-full mb-3"
    />

    <button
      onClick={() => {
        const updated = clients.map(c => {
          if (c.id === editingId) {
            const ventasPrevias = c.ventas || [];
            return {
              ...c,
              ventas: [
                ...ventasPrevias,
                {
                  producto: formData.nuevaVentaProducto,
                  monto: Number(formData.nuevaVentaMonto),
                  fecha: new Date().toISOString(),
                },
              ]
            };
          }
          return c;
        });

        saveClients(updated);
        showAlert("success", "Venta registrada");

        setFormData({
          ...formData,
          nuevaVentaProducto: "",
          nuevaVentaMonto: ""
        });
      }}
      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
    >
      Guardar Venta
    </button>
  </div>
)}

                  <button
                    onClick={handleSubmit}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg flex items-center justify-center gap-2"
                  >
                    <Save size={20} /> {editingId ? 'Actualizar' : 'Guardar'}
                  </button>

                  <button
                    onClick={resetForm}
                    className="px-6 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Tabla de clientes */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {filteredClients.length === 0 ? (
            <div className="text-center py-12">
              <Users className="mx-auto text-gray-300 mb-4" size={64} />
              <p className="text-gray-500 text-lg">
                {searchTerm ? 'No se encontraron clientes' : 'Aún no hay clientes registrados'}
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs">Cliente</th>
                  <th className="px-6 py-3 text-left text-xs">Contacto</th>
                  <th className="px-6 py-3 text-left text-xs">Vendedor</th>
                  <th className="px-6 py-3 text-left text-xs">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs">Estado</th>
                  <th className="px-6 py-3 text-left text-xs">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {filteredClients.map(client => (
                  <tr key={client.id} className="hover:bg-gray-50 border-b">
                    <td className="px-6 py-4">
                      <p className="font-medium">{client.nombre}</p>
                      {client.empresa && (
                        <p className="text-sm text-gray-500">{client.empresa}</p>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-sm">{client.telefono}</p>
                      {client.email && (
                        <p className="text-sm text-gray-500">{client.email}</p>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                        {client.vendedor}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm">
                      {new Date(client.fecha).toLocaleDateString('es-ES')}
                    </td>

                    <td className="px-6 py-4">
                      {client.compro === true && (
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                          Compró
                        </span>
                      )}
                      {client.compro === false && (
                        <div>
                          <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                            No compró
                          </span>
                          {client.razonNoCompra && (
                            <p className="text-xs mt-1">{client.razonNoCompra}</p>
                          )}
                        </div>
                      )}
                      {client.compro === null && (
                        <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                          Pendiente
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingId(client.id);
                            setFormData(client);
                            setIsFormOpen(true);
                          }}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit2 size={18} />
                        </button>

                        <button
                          onClick={() => handleDelete(client.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={18} />
                        </button>

                         {/* HISTORIAL */}
                            <button
                              onClick={() => {
                                setHistorialCliente(client);
                                setShowHistorialModal(true);
                              }}
                              className="bg-white-600 hover:bg-purple-700 text-black px-3 py-1 rounded"
                            >
                              <i className="fas fa-history"></i>
                            </button>

                          

                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
}