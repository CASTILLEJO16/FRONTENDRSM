import React, { useState, useCallback } from "react";
import { Edit2, Trash2, Plus, QrCode } from "lucide-react";
import { useClients } from "../context/ClientsContext";
import { useErrorHandler } from "../hooks/useErrorHandler";
import { useNotifications } from "../context/NotificationsContext";
import { SkeletonCard } from "./ui/Skeleton";
import ConfirmDialog from "./ConfirmDialog";
import SaleForm from "./SaleForm";
import ObservationModal from "./ObservationModal";
import QRModal from "./QRModal";

export default function ClientList({ onEdit, onDelete, onAddSale }) {
  const { clients, isLoading, enviarMensaje } = useClients();
  const { handleError } = useErrorHandler();
  const { showSuccess, showError } = useNotifications();
  
  const [confirmDelete, setConfirmDelete] = useState({ open: false, client: null });
  const [saleForm, setSaleForm] = useState({ open: false, client: null });
  const [showObservationModal, setShowObservationModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

  // Handlers optimizados con useCallback
  const handleQRClick = useCallback((client) => {
    setClienteSeleccionado(client);
    setShowQRModal(true);
  }, []);

  const handleSaleClick = useCallback((client) => {
    setSaleForm({ open: true, client });
  }, []);

  const handleEditClick = useCallback((client) => {
    onEdit(client);
  }, [onEdit]);

  const handleDeleteClick = useCallback((client) => {
    setConfirmDelete({ open: true, client });
  }, []);

  const handleObservationClick = useCallback((client) => {
    setClienteSeleccionado(client);
    setShowObservationModal(true);
  }, []);

  const handleQRClose = useCallback(() => {
    setShowQRModal(false);
    setClienteSeleccionado(null);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    onDelete(confirmDelete.client._id);
    setConfirmDelete({ open: false, client: null });
  }, [onDelete, confirmDelete.client]);

  const handleDeleteCancel = useCallback(() => {
    setConfirmDelete({ open: false, client: null });
  }, []);

  const handleSaleClose = useCallback(() => {
    setSaleForm({ open: false, client: null });
  }, []);

  const handleSaleSave = useCallback(async (venta) => {
    try {
      if (onAddSale) {
        await onAddSale(saleForm.client._id, venta);
      }
      setSaleForm({ open: false, client: null });
    } catch (error) {
      handleError(error, {
        context: 'handleSaleSave',
        userMessage: 'Error al registrar la venta',
        showToast: true
      });
    }
  }, [saleForm.client, handleError, onAddSale]);

  const handleObservationClose = useCallback(() => {
    setShowObservationModal(false);
    setClienteSeleccionado(null);
  }, []);

  const handleObservationSave = useCallback(async (data) => {
    try {
      await enviarMensaje(clienteSeleccionado._id, data);
      showSuccess("Mensaje enviado exitosamente");
      setShowObservationModal(false);
      setClienteSeleccionado(null);
    } catch (error) {
      showError("Error al enviar el mensaje");
      handleError(error, {
        context: 'handleObservationSave',
        userMessage: 'Error al enviar el mensaje',
        showToast: true
      });
    }
  }, [clienteSeleccionado, handleError, enviarMensaje, showSuccess, showError]);

  // Mostrar skeletons durante carga
  if (isLoading) {
    return (
      <>
        {/* 📱 VISTA MÓVIL - Skeleton Cards */}
        <div className="block lg:hidden space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>

        {/* 🖥️ VISTA DESKTOP - Skeleton Table */}
        <div className="hidden lg:block bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-850 text-slate-300 text-xs">
                <tr>
                  <th className="px-6 py-3 text-left">Cliente</th>
                  <th className="px-6 py-3 text-left">Contacto</th>
                  <th className="px-6 py-3 text-left">Vendedor</th>
                  <th className="px-6 py-3 text-left">Total Ventas</th>
                  <th className="px-6 py-3 text-left">Fecha</th>
                  <th className="px-6 py-3 text-left">Estado</th>
                  <th className="px-6 py-3 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody className="text-slate-200">
                {Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-slate-800">
                    <td className="px-6 py-4">
                      <div className="animate-pulse">
                        <div className="h-5 w-32 bg-slate-800 rounded mb-1"></div>
                        <div className="h-4 w-24 bg-slate-800 rounded"></div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="animate-pulse">
                        <div className="h-4 w-28 bg-slate-800 rounded mb-1"></div>
                        <div className="h-3 w-20 bg-slate-800 rounded"></div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="animate-pulse h-6 w-24 bg-slate-800 rounded-full"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="animate-pulse h-5 w-20 bg-slate-800 rounded"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="animate-pulse h-4 w-24 bg-slate-800 rounded"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="animate-pulse h-6 w-20 bg-slate-800 rounded-full"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <div className="animate-pulse w-8 h-8 bg-slate-800 rounded"></div>
                        <div className="animate-pulse w-8 h-8 bg-slate-800 rounded"></div>
                        <div className="animate-pulse w-8 h-8 bg-slate-800 rounded"></div>
                        <div className="animate-pulse w-8 h-8 bg-slate-800 rounded"></div>
                        <div className="animate-pulse w-8 h-8 bg-slate-800 rounded"></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  }

  if (!clients || clients.length === 0)
    return <div className="bg-slate-800 p-6 rounded">No hay clientes registrados</div>;

  return (
    <>
      {/* 📱 VISTA MÓVIL - Cards */}
      <div className="block lg:hidden space-y-4">
        {clients.map((c) => (
          <div key={c._id} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            {/* Header */}
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-slate-100 text-lg">{c.nombre}</h3>
                {c.empresa && <p className="text-sm text-slate-400">{c.empresa}</p>}
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleQRClick(c)}
                  className="text-blue-400 hover:text-blue-200 p-2 transition-colors" 
                  title="QR"
                >
                  <QrCode size={20} />
                </button>
                <button 
                  onClick={() => handleSaleClick(c)}
                  className="text-emerald-400 hover:text-emerald-200 p-2 transition-colors" 
                  title="Venta"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <p className="text-xs text-slate-500 mb-1">Contacto</p>
                <p className="text-sm text-slate-300">{c.telefono}</p>
                {c.email && <p className="text-xs text-slate-400 truncate">{c.email}</p>}
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Vendedor</p>
                <span className="inline-block px-2 py-1 rounded-full text-xs bg-indigo-900 text-indigo-300">
                  {c.vendedor?.nombre || c.vendedor?.username || c.vendedor || 'Sin asignar'}
                </span>
              </div>
            </div>

            {/* Total y Estado */}
            <div className="flex justify-between items-center mb-3 pb-3 border-b border-slate-800">
              <div>
                <p className="text-xs text-slate-500 mb-1">Total Ventas</p>
                <span className="text-emerald-400 font-semibold text-lg">
                  ${((c.ventas || []).reduce((sum, v) => sum + Number(v.monto || 0), 0)).toLocaleString()}
                </span>
              </div>
              <div>
                {c.compro === true && (
                  <span className="px-3 py-1 text-xs bg-emerald-900 text-emerald-200 rounded-full">
                    Compró
                  </span>
                )}
                {c.compro === false && (
                  <div className="text-right">
                    <span className="px-3 py-1 text-xs bg-rose-900 text-rose-200 rounded-full">
                      No compró
                    </span>
                    {c.razonNoCompra && (
                      <p className="text-xs mt-1 text-slate-400">{c.razonNoCompra}</p>
                    )}
                  </div>
                )}
                {c.compro === null && (
                  <span className="px-3 py-1 text-xs bg-yellow-900 text-yellow-200 rounded-full">
                    Pendiente
                  </span>
                )}
              </div>
            </div>

            {/* Fecha */}
            <div className="mb-3">
              <p className="text-xs text-slate-500">Fecha de registro</p>
              <p className="text-sm text-slate-300">
                {new Date(c.fecha).toLocaleDateString('es-MX', { 
                  timeZone: 'America/Mexico_City',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>

            {/* Acciones */}
            <div className="flex gap-2">
              <button 
                onClick={() => handleEditClick(c)}
                className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 py-2 rounded text-white text-sm transition-colors"
              >
                <Edit2 size={16} />
                Editar
              </button>
              <button 
                onClick={() => handleObservationClick(c)}
                className="flex-1 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 py-2 rounded text-white text-sm transition-colors"
              >
                💬 Mensaje
              </button>
              <button 
                onClick={() => handleDeleteClick(c)}
                className="px-4 bg-rose-600 hover:bg-rose-700 py-2 rounded text-white text-sm transition-colors"
                title="Eliminar"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 🖥️ VISTA DESKTOP - Tabla */}
      <div className="hidden lg:block bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-850 text-slate-300 text-xs">
              <tr>
                <th className="px-6 py-3 text-left">Cliente</th>
                <th className="px-6 py-3 text-left">Contacto</th>
                <th className="px-6 py-3 text-left">Vendedor</th>
                <th className="px-6 py-3 text-left">Total Ventas</th>
                <th className="px-6 py-3 text-left">Fecha</th>
                <th className="px-6 py-3 text-left">Estado</th>
                <th className="px-6 py-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-slate-200">
              {clients.map((c) => (
                <tr key={c._id} className="border-b border-slate-800 hover:bg-slate-850">
                  <td className="px-6 py-4">
                    <p className="font-medium">{c.nombre}</p>
                    {c.empresa && <p className="text-sm text-slate-400">{c.empresa}</p>}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm">{c.telefono}</p>
                    {c.email && <p className="text-sm text-slate-400">{c.email}</p>}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-full text-xs bg-indigo-900 text-indigo-300">
                      {c.vendedor?.nombre || c.vendedor?.username || c.vendedor || 'Sin asignar'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-emerald-400 font-semibold">
                      ${((c.ventas || []).reduce((sum, v) => sum + Number(v.monto || 0), 0)).toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {new Date(c.fecha).toLocaleDateString('es-MX', { 
                      timeZone: 'America/Mexico_City',
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit'
                    })}
                  </td>
                  <td className="px-6 py-4">
                    {c.compro === true && (
                      <span className="px-2 py-1 text-xs bg-emerald-900 text-emerald-200 rounded-full">
                        Compró
                      </span>
                    )}
                    {c.compro === false && (
                      <div>
                        <span className="px-2 py-1 text-xs bg-rose-900 text-rose-200 rounded-full">
                          No compró
                        </span>
                        {c.razonNoCompra && <p className="text-xs mt-1 text-slate-400">{c.razonNoCompra}</p>}
                      </div>
                    )}
                    {c.compro === null && (
                      <span className="px-2 py-1 text-xs bg-yellow-900 text-yellow-200 rounded-full">
                        Pendiente
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleQRClick(c)}
                        className="text-blue-400 hover:text-blue-200 transition-colors"
                        title="Ver código QR"
                      >
                        <QrCode size={18} />
                      </button>
                      
                      <button 
                        onClick={() => handleSaleClick(c)} 
                        className="text-emerald-400 hover:text-emerald-200 transition-colors"
                        title="Registrar venta"
                      >
                        <Plus size={18} />
                      </button>
                      <button 
                        onClick={() => handleEditClick(c)} 
                        className="text-indigo-400 hover:text-indigo-200 transition-colors"
                        title="Editar cliente"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(c)} 
                        className="text-rose-400 hover:text-rose-200 transition-colors"
                        title="Eliminar cliente"
                      >
                        <Trash2 size={18} />
                      </button>
                      <button
                        className="text-purple-500 hover:text-purple-300 transition-colors"
                        onClick={() => handleObservationClick(c)}
                        title="Enviar observación"
                      >
                        💬
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal QR */}
      {showQRModal && (
        <QRModal
          cliente={clienteSeleccionado}
          onClose={handleQRClose}
        />
      )}

      {/* Modal de confirmación */}
      <ConfirmDialog
        open={confirmDelete.open}
        title="Eliminar Cliente"
        message={`¿Estás seguro de eliminar a ${confirmDelete.client?.nombre}? Esta acción no se puede deshacer.`}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />

      {/* Modal de nueva venta */}
      <SaleForm
        open={saleForm.open}
        cliente={saleForm.client}
        onClose={handleSaleClose}
        onSave={handleSaleSave}
      />

      {/* Modal de observaciones */}
      {showObservationModal && (
        <ObservationModal
          cliente={clienteSeleccionado}
          onClose={handleObservationClose}
          onSave={handleObservationSave}
        />
      )}
    </>
  );
}