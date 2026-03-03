import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { LogOut } from "lucide-react";

export default function Settings() {
  const { logout, showAlert } = useContext(AppContext);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogout = () => {
    setShowConfirm(true);
  };

  const confirmLogout = () => {
    logout();
    showAlert("success", "Sesión cerrada correctamente");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">⚙️ Configuración del Sistema</h1>

      <div className="space-y-4">

        {/* ============ SESIÓN (SOLO MÓVIL) ============ */}
        <details className="border rounded-lg p-4 md:hidden bg-slate-800/40 border-slate-700">
          <summary className="cursor-pointer text-lg font-semibold text-white flex items-center gap-2">
            🔐 Sesión
          </summary>
          <div className="mt-3 space-y-3">
            <div className="text-slate-300 text-sm mb-3">
              Cierra tu sesión de forma segura
            </div>
            <button
              onClick={handleLogout}
              className="w-full bg-red-600 text-white p-3 rounded-lg hover:bg-red-700 
                       transition flex items-center justify-center gap-2 font-semibold"
            >
              <LogOut size={20} />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </details>

        {/* ============ SISTEMA ============ */}
        <details className="border rounded-lg p-4">
          <summary className="cursor-pointer text-lg font-semibold">
            Información del Sistema
          </summary>
          <div className="mt-3 space-y-3">
            <div>
              <label className="font-semibold">Nombre del sistema</label>
              <input className="w-full border p-2 rounded" placeholder="RSM Sales Manager" />
            </div>

            <div>
              <label className="font-semibold">Nombre de la empresa</label>
              <input className="w-full border p-2 rounded" placeholder="Mi Negocio SA" />
            </div>

            <div>
              <label className="font-semibold">Logo</label>
              <input type="file" className="w-full border p-2 rounded" />
            </div>

            <div>
              <label className="font-semibold">Mensaje de bienvenida</label>
              <input className="w-full border p-2 rounded" placeholder="Bienvenido al sistema" />
            </div>
          </div>
        </details>

        {/* ============ APARIENCIA ============ */}
        <details className="border rounded-lg p-4">
          <summary className="cursor-pointer text-lg font-semibold">Apariencia</summary>
          <div className="mt-3 space-y-3">

            <div className="flex justify-between items-center">
              <label className="font-semibold">Tema oscuro</label>
              <input type="checkbox" />
            </div>

            <div>
              <label className="font-semibold">Color principal</label>
              <input type="color" className="border p-2 rounded" />
            </div>

            <div className="flex justify-between items-center">
              <label className="font-semibold">Texto grande</label>
              <input type="checkbox" />
            </div>
          </div>
        </details>

        {/* ============ VENTAS ============ */}
        <details className="border rounded-lg p-4">
          <summary className="cursor-pointer text-lg font-semibold">Ventas</summary>
          <div className="mt-3 space-y-3">

            <div className="flex justify-between items-center">
              <label className="font-semibold">Activar registro de ventas</label>
              <input type="checkbox" />
            </div>

            <div className="flex justify-between items-center">
              <label className="font-semibold">IVA automático</label>
              <input type="checkbox" />
            </div>

            <div className="flex justify-between items-center">
              <label className="font-semibold">Permitir descuentos</label>
              <input type="checkbox" />
            </div>
          </div>
        </details>

        {/* ============ CLIENTES ============ */}
        <details className="border rounded-lg p-4">
          <summary className="cursor-pointer text-lg font-semibold">Clientes</summary>
          <div className="mt-3 space-y-3">

            <div className="flex justify-between items-center">
              <label className="font-semibold">Teléfono obligatorio</label>
              <input type="checkbox" />
            </div>

            <div className="flex justify-between items-center">
              <label className="font-semibold">Correo obligatorio</label>
              <input type="checkbox" />
            </div>

            <div className="flex justify-between items-center">
              <label className="font-semibold">Notas por cliente</label>
              <input type="checkbox" />
            </div>
          </div>
        </details>

        {/* ============ REPORTES ============ */}
        <details className="border rounded-lg p-4">
          <summary className="cursor-pointer text-lg font-semibold">
            Reportes y Gráficas
          </summary>
          <div className="mt-3 space-y-3">
            <div>
              <label className="font-semibold">Gráfica predeterminada</label>
              <select className="w-full border p-2 rounded">
                <option>Barras</option>
                <option>Pastel</option>
                <option>Línea</option>
              </select>
            </div>

            <div className="flex justify-between items-center">
              <label className="font-semibold">Activar dashboard</label>
              <input type="checkbox" />
            </div>
          </div>
        </details>

        {/* ============ SEGURIDAD ============ */}
        <details className="border rounded-lg p-4">
          <summary className="cursor-pointer text-lg font-semibold">Seguridad</summary>
          <div className="mt-3 space-y-3">
            <div>
              <label className="font-semibold">Nueva contraseña</label>
              <input type="password" className="w-full border p-2 rounded" />
            </div>

            <div className="flex justify-between items-center">
              <label className="font-semibold">Auto-cerrar sesión</label>
              <input type="checkbox" />
            </div>

            <div className="flex justify-between items-center">
              <label className="font-semibold">Restringir edición</label>
              <input type="checkbox" />
            </div>
          </div>
        </details>

        {/* ============ RESPALDO ============ */}
        <details className="border rounded-lg p-4">
          <summary className="cursor-pointer text-lg font-semibold">
            Respaldo y Base de Datos
          </summary>
          <div className="mt-3 space-y-3">

            <div className="flex justify-between items-center">
              <label className="font-semibold">Respaldos automáticos</label>
              <input type="checkbox" />
            </div>

            <button className="w-full bg-blue-600 text-white p-2 rounded">
              Exportar Base de Datos
            </button>

            <button className="w-full bg-gray-700 text-white p-2 rounded">
              Importar Base de Datos
            </button>

            <button className="w-full bg-red-600 text-white p-2 rounded">
              Restablecer sistema
            </button>
          </div>
        </details>
      </div>

      {/* Modal de confirmación */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl p-6 max-w-sm w-full border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-3">¿Cerrar sesión?</h3>
            <p className="text-slate-300 mb-6">
              ¿Estás seguro que deseas cerrar tu sesión?
            </p>
            <div className="flex gap-3">
              <button
                onClick={confirmLogout}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
              >
                Sí, cerrar
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 bg-slate-700 text-white py-2 rounded-lg hover:bg-slate-600 transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}