import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { X } from 'lucide-react';

// Modal para ver imagen en tamaño completo
function ImageModal({ imagen, onClose }) {
  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
      onClick={onClose}
    >
      <div className="relative max-w-5xl max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute -top-14 right-0 p-3 bg-slate-800/80 hover:bg-slate-700/80 backdrop-blur-sm rounded-full text-white transition-all duration-200 hover:scale-110"
        >
          <X size={24} />
        </button>
        <img
          src={imagen}
          alt="Vista completa"
          className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-soft-lg"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
}

// Componente de Historial
function Historial({ clients }) {
  const [imagenModal, setImagenModal] = useState(null);

  if (!clients || clients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-20 h-20 rounded-2xl bg-slate-800 flex items-center justify-center mb-4">
          <span className="text-3xl">📋</span>
        </div>
        <p className="text-slate-400 text-lg font-medium">No hay clientes registrados</p>
        <p className="text-slate-500 text-sm mt-2">Comienza agregando clientes para ver su historial</p>
      </div>
    );
  }

  const getTipoColor = (tipo) => {
    const colores = {
      creado: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      editado: "bg-amber-500/20 text-amber-400 border-amber-500/30",
      mensaje: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      compra: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      eliminado: "bg-red-500/20 text-red-400 border-red-500/30"
    };
    return colores[tipo] || "bg-slate-500/20 text-slate-400 border-slate-500/30";
  };

  return (
    <>
      <div className="space-y-8 p-6">
        {clients.map((c) => (
          <div key={c._id} className="bg-slate-900 border border-slate-800 rounded-2xl shadow-soft overflow-hidden hover:shadow-soft-lg transition-all duration-300">
            {/* Header del Cliente */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-800/50 p-6 border-b border-slate-700">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-100 mb-3">{c.nombre}</h2>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <span className="flex items-center gap-2 text-slate-400">
                      <span className="text-base">📧</span>
                      {c.email || 'Sin email'}
                    </span>
                    <span className="flex items-center gap-2 text-slate-400">
                      <span className="text-base">📱</span>
                      {c.telefono || 'Sin teléfono'}
                    </span>
                    {c.empresa && (
                      <span className="flex items-center gap-2 text-slate-400">
                        <span className="text-base">🏢</span>
                        {c.empresa}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-sm font-medium border border-indigo-500/20">
                    <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                    {c.historial?.length || 0} registros
                  </span>
                </div>
              </div>
            </div>

            {/* Historial */}
            <div className="p-6">
              <h3 className="text-lg font-semibold text-slate-200 mb-6">
                Actividad Reciente
              </h3>

              {(!c.historial || c.historial.length === 0) ? (
                <div className="text-center py-12 bg-slate-800/30 rounded-2xl border border-slate-700/50">
                  <div className="w-16 h-16 rounded-2xl bg-slate-700/50 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📝</span>
                  </div>
                  <p className="text-slate-400 font-medium mb-2">Sin historial registrado</p>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    El historial se registra automáticamente cuando se crea, edita o interactúa con el cliente
                  </p>
                </div>
              ) : (
                <ul className="space-y-4">
                  {c.historial.map((h, i) => (
                    <li 
                      key={i} 
                      className={`bg-slate-800/50 p-5 rounded-xl border transition-all duration-200 hover:bg-slate-800/70 hover:scale-[1.02] ${getTipoColor(h.tipo)}`}
                    >
                      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                        <div className="flex-1">
                          {/* Tipo y monto */}
                          <div className="flex flex-wrap items-center gap-3 mb-3">
                            <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase border ${getTipoColor(h.tipo)}`}>
                              {h.tipo}
                            </span>
                            {h.monto && (
                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                                <span className="text-sm">💰</span>
                                ${h.monto.toLocaleString()}
                              </span>
                            )}
                          </div>

                          {/* Mensaje */}
                          <p className="text-slate-200 text-sm leading-relaxed mb-4">
                            {h.mensaje}
                          </p>

                          {/* Imagen (si existe) */}
                          {h.imagen && (
                            <div className="mt-4">
                              <div className="relative group">
                                <img
                                  src={h.imagen}
                                  alt="Imagen adjunta"
                                  className="max-w-full lg:max-w-sm h-auto rounded-xl border border-slate-600 cursor-pointer transition-all duration-200 group-hover:scale-[1.02] group-hover:shadow-soft"
                                  onClick={() => setImagenModal(h.imagen)}
                                  title="Click para ver en tamaño completo"
                                />
                                <div className="absolute inset-0 rounded-xl bg-black/0 group-hover:bg-black/20 transition-all duration-200 pointer-events-none flex items-center justify-center">
                                  <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-sm font-medium">
                                    � Ampliar
                                  </span>
                                </div>
                              </div>
                              <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                                <span>📷</span>
                                Click para ampliar imagen
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Fecha */}
                        <div className="text-right text-xs text-slate-500 whitespace-nowrap font-medium">
                          <div className="bg-slate-700/50 px-3 py-2 rounded-lg">
                            {new Date(h.fecha).toLocaleDateString('es-MX', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })}
                            <br />
                            {new Date(h.fecha).toLocaleTimeString('es-MX', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal de imagen */}
      {imagenModal && (
        <ImageModal
          imagen={imagenModal}
          onClose={() => setImagenModal(null)}
        />
      )}
    </>
  );
}

// Componente Principal - HistoryPage
export default function HistoryPage() {
  const { clients, fetchClients } = useContext(AppContext);

  React.useEffect(() => {
    fetchClients();
  }, []);

  const handleRecargar = () => {
    fetchClients();
  };

  if (!clients) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          </div>
          <p className="text-slate-400">Cargando historial...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-page-enter">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-100 mb-2">
              Historial de Actividad
            </h1>
            <p className="text-slate-400">
              {clients.length} cliente{clients.length !== 1 ? 's' : ''} registrado{clients.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <Historial clients={clients} />
    </div>
  );
}