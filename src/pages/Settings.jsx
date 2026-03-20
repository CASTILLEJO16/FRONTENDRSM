import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { LogOut } from "lucide-react";
import { Link } from "react-router-dom";

export default function Settings() {
  const { logout, showAlert, currentUser } = useContext(AppContext);
  const [showConfirm, setShowConfirm] = useState(false);
  const role = currentUser?.role || "vendedor";

  const handleLogout = () => {
    setShowConfirm(true);
  };

  const confirmLogout = () => {
    logout();
    showAlert("success", "Sesión cerrada correctamente");
  };

  return (
    <div className="animate-page-enter pb-20">
      {/* Header móvil */}
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 text-white p-6 md:p-8 rounded-2xl shadow-soft-lg mb-6">
        <h1 className="text-2xl font-bold">Configuración</h1>
        <p className="text-white/80 mt-2">Ajustes del sistema</p>
      </div>

      <div className="space-y-4 px-4">
        {role === "admin" && (
          <div className="border border-slate-700 rounded-2xl p-4 bg-slate-900 shadow-soft">
            <div className="text-lg font-semibold text-slate-100">AdministraciÃ³n</div>
            <div className="text-slate-400 text-sm mt-1">Gestiona usuarios y roles</div>
            <Link
              to="/admin/users"
              className="inline-flex mt-4 bg-indigo-600 text-white px-4 py-3 rounded-xl hover:bg-indigo-700 transition font-semibold shadow-soft"
            >
              Administrar usuarios
            </Link>
          </div>
        )}

        {/* ============ SESIÓN (SOLO MÓVIL) ============ */}
        <details className="border border-slate-700 rounded-2xl p-4 md:hidden bg-slate-900 shadow-soft">
          <summary className="cursor-pointer text-lg font-semibold text-slate-100 flex items-center gap-2">
            🔐 Sesión
          </summary>
          <div className="mt-3 space-y-3">
            <div className="text-slate-400 text-sm mb-3">
              Cierra tu sesión de forma segura
            </div>
            <button
              onClick={handleLogout}
              className="w-full bg-red-600 text-white p-3 rounded-xl hover:bg-red-700 
                       transition flex items-center justify-center gap-2 font-semibold shadow-soft"
            >
              <LogOut size={20} />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </details>

        {/* ============ SISTEMA ============ */}
        <details className="border border-slate-700 rounded-2xl p-4 bg-slate-900 shadow-soft">
          <summary className="cursor-pointer text-lg font-semibold text-slate-100">
            Información del Sistema
          </summary>
          <div className="mt-3 space-y-3">
            <div>
              <label className="font-semibold text-slate-200">Nombre del sistema</label>
              <input className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl text-slate-100 placeholder-slate-400" placeholder="RSM Sales Manager" />
            </div>

            <div>
              <label className="font-semibold text-slate-200">Nombre de la empresa</label>
              <input className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl text-slate-100 placeholder-slate-400" placeholder="Mi Negocio SA" />
            </div>

            <div>
              <label className="font-semibold text-slate-200">Logo</label>
              <input type="file" className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl text-slate-100 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700" />
            </div>

            <div>
              <label className="font-semibold text-slate-200">Mensaje de bienvenida</label>
              <input className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl text-slate-100 placeholder-slate-400" placeholder="Bienvenido al sistema" />
            </div>
          </div>
        </details>

        {/* ============ APARIENCIA ============ */}
        <details className="border border-slate-700 rounded-2xl p-4 bg-slate-900 shadow-soft">
          <summary className="cursor-pointer text-lg font-semibold text-slate-100">Apariencia</summary>
          <div className="mt-3 space-y-3">

            <div className="flex justify-between items-center">
              <label className="font-semibold text-slate-200">Tema oscuro</label>
              <input type="checkbox" className="w-5 h-5 text-indigo-600 bg-slate-800 border-slate-600 rounded focus:ring-indigo-500" />
            </div>

            <div>
              <label className="font-semibold text-slate-200">Color principal</label>
              <input type="color" className="border border-slate-700 p-2 rounded-xl bg-slate-800" />
            </div>

            <div className="flex justify-between items-center">
              <label className="font-semibold text-slate-200">Texto grande</label>
              <input type="checkbox" className="w-5 h-5 text-indigo-600 bg-slate-800 border-slate-600 rounded focus:ring-indigo-500" />
            </div>
          </div>
        </details>

        {/* ============ VENTAS ============ */}
        <details className="border border-slate-700 rounded-2xl p-4 bg-slate-900 shadow-soft">
          <summary className="cursor-pointer text-lg font-semibold text-slate-100">Ventas</summary>
          <div className="mt-3 space-y-3">

            <div className="flex justify-between items-center">
              <label className="font-semibold text-slate-200">Activar registro de ventas</label>
              <input type="checkbox" className="w-5 h-5 text-indigo-600 bg-slate-800 border-slate-600 rounded focus:ring-indigo-500" />
            </div>

            <div className="flex justify-between items-center">
              <label className="font-semibold text-slate-200">IVA automático</label>
              <input type="checkbox" className="w-5 h-5 text-indigo-600 bg-slate-800 border-slate-600 rounded focus:ring-indigo-500" />
            </div>

            <div className="flex justify-between items-center">
              <label className="font-semibold text-slate-200">Permitir descuentos</label>
              <input type="checkbox" className="w-5 h-5 text-indigo-600 bg-slate-800 border-slate-600 rounded focus:ring-indigo-500" />
            </div>
          </div>
        </details>

        {/* ============ CLIENTES ============ */}
        <details className="border border-slate-700 rounded-2xl p-4 bg-slate-900 shadow-soft">
          <summary className="cursor-pointer text-lg font-semibold text-slate-100">Clientes</summary>
          <div className="mt-3 space-y-3">

            <div className="flex justify-between items-center">
              <label className="font-semibold text-slate-200">Teléfono obligatorio</label>
              <input type="checkbox" className="w-5 h-5 text-indigo-600 bg-slate-800 border-slate-600 rounded focus:ring-indigo-500" />
            </div>

            <div className="flex justify-between items-center">
              <label className="font-semibold text-slate-200">Correo obligatorio</label>
              <input type="checkbox" className="w-5 h-5 text-indigo-600 bg-slate-800 border-slate-600 rounded focus:ring-indigo-500" />
            </div>

            <div className="flex justify-between items-center">
              <label className="font-semibold text-slate-200">Notas por cliente</label>
              <input type="checkbox" className="w-5 h-5 text-indigo-600 bg-slate-800 border-slate-600 rounded focus:ring-indigo-500" />
            </div>
          </div>
        </details>

        {/* ============ REPORTES ============ */}
        <details className="border border-slate-700 rounded-2xl p-4 bg-slate-900 shadow-soft">
          <summary className="cursor-pointer text-lg font-semibold text-slate-100">
            Reportes y Gráficas
          </summary>
          <div className="mt-3 space-y-3">
            <div>
              <label className="font-semibold text-slate-200">Gráfica predeterminada</label>
              <select className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl text-slate-100">
                <option>Barras</option>
                <option>Pastel</option>
                <option>Línea</option>
              </select>
            </div>

            <div className="flex justify-between items-center">
              <label className="font-semibold text-slate-200">Activar dashboard</label>
              <input type="checkbox" className="w-5 h-5 text-indigo-600 bg-slate-800 border-slate-600 rounded focus:ring-indigo-500" />
            </div>
          </div>
        </details>

        {/* ============ SEGURIDAD ============ */}
        <details className="border border-slate-700 rounded-2xl p-4 bg-slate-900 shadow-soft">
          <summary className="cursor-pointer text-lg font-semibold text-slate-100">Seguridad</summary>
          <div className="mt-3 space-y-3">
            <div>
              <label className="font-semibold text-slate-200">Nueva contraseña</label>
              <input type="password" className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl text-slate-100 placeholder-slate-400" />
            </div>

            <div className="flex justify-between items-center">
              <label className="font-semibold text-slate-200">Auto-cerrar sesión</label>
              <input type="checkbox" className="w-5 h-5 text-indigo-600 bg-slate-800 border-slate-600 rounded focus:ring-indigo-500" />
            </div>

            <div className="flex justify-between items-center">
              <label className="font-semibold text-slate-200">Restringir edición</label>
              <input type="checkbox" className="w-5 h-5 text-indigo-600 bg-slate-800 border-slate-600 rounded focus:ring-indigo-500" />
            </div>
          </div>
        </details>

        {/* ============ RESPALDO ============ */}
        <details className="border border-slate-700 rounded-2xl p-4 bg-slate-900 shadow-soft">
          <summary className="cursor-pointer text-lg font-semibold text-slate-100">
            Respaldo y Base de Datos
          </summary>
          <div className="mt-3 space-y-3">

            <div className="flex justify-between items-center">
              <label className="font-semibold text-slate-200">Respaldos automáticos</label>
              <input type="checkbox" className="w-5 h-5 text-indigo-600 bg-slate-800 border-slate-600 rounded focus:ring-indigo-500" />
            </div>

            <button className="w-full bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 transition shadow-soft">
              Exportar Base de Datos
            </button>

            <button className="w-full bg-slate-700 text-white p-3 rounded-xl hover:bg-slate-600 transition shadow-soft">
              Importar Base de Datos
            </button>

            <button className="w-full bg-red-600 text-white p-3 rounded-xl hover:bg-red-700 transition shadow-soft">
              Restablecer sistema
            </button>
          </div>
        </details>
      </div>

      {/* Modal de confirmación */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-slate-900 rounded-2xl p-6 max-w-sm w-full border border-slate-800 shadow-soft-lg">
            <h3 className="text-xl font-bold text-slate-100 mb-3">¿Cerrar sesión?</h3>
            <p className="text-slate-400 mb-6">
              ¿Estás seguro que deseas cerrar tu sesión?
            </p>
            <div className="flex gap-3">
              <button
                onClick={confirmLogout}
                className="flex-1 bg-red-600 text-white py-3 rounded-xl hover:bg-red-700 transition shadow-soft"
              >
                Sí, cerrar
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 bg-slate-700 text-white py-3 rounded-xl hover:bg-slate-600 transition shadow-soft"
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
