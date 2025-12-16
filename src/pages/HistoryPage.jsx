import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { X } from 'lucide-react';

// Modal para ver imagen en tamaño completo
function ImageModal({ imagen, onClose }) {
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div className="relative max-w-4xl max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 p-2 bg-slate-900 hover:bg-slate-800 rounded-full text-white transition-colors"
        >
          <X size={24} />
        </button>
        <img
          src={imagen}
          alt="Vista completa"
          className="max-w-full max-h-[85vh] object-contain rounded-lg"
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
    return <div className="text-center text-slate-300 p-8">No hay clientes</div>;
  }

  const getTipoColor = (tipo) => {
    const colores = {
      creado: "bg-green-500",
      editado: "bg-yellow-500",
      mensaje: "bg-blue-500",
      compra: "bg-purple-500",
      eliminado: "bg-red-500"
    };
    return colores[tipo] || "bg-slate-500";
  };

  return (
    <>
      <div className="space-y-6 p-4 md:p-6">
        {clients.map((c) => (
          <div key={c._id} className="bg-slate-800 rounded-lg shadow-lg overflow-hidden">
            {/* Header del Cliente */}
            <div className="bg-slate-900 p-4 border-b border-slate-700">
              <h2 className="text-xl font-bold text-blue-400">{c.nombre}</h2>
              <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-400">
                <span>📧 {c.email || 'Sin email'}</span>
                <span>📱 {c.telefono || 'Sin teléfono'}</span>
                {c.empresa && <span>🏢 {c.empresa}</span>}
              </div>
            </div>

            {/* Historial */}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                📋 Historial de Actividad
                <span className="text-xs bg-slate-700 px-2 py-1 rounded-full">
                  {c.historial?.length || 0} registros
                </span>
              </h3>

              {(!c.historial || c.historial.length === 0) ? (
                <div className="text-center py-8 bg-slate-700/30 rounded-lg">
                  <p className="text-slate-500 mb-2">Sin historial registrado</p>
                  <p className="text-xs text-slate-600">
                    El historial se registra automáticamente cuando:
                    <br />• Se crea un cliente
                    <br />• Se edita información
                    <br />• Se envían mensajes/observaciones
                  </p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {c.historial.map((h, i) => (
                    <li 
                      key={i} 
                      className="bg-slate-700 p-4 rounded-lg border-l-4 hover:bg-slate-600/50 transition-colors"
                      style={{ borderLeftColor: getTipoColor(h.tipo).replace('bg-', '#') }}
                    >
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                        <div className="flex-1">
                          {/* Tipo */}
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className={`${getTipoColor(h.tipo)} text-white text-xs font-bold px-2 py-1 rounded uppercase`}>
                              {h.tipo}
                            </span>
                            {h.monto && (
                              <span className="text-green-400 font-semibold">
                                💰 ${h.monto.toLocaleString()}
                              </span>
                            )}
                          </div>

                          {/* Mensaje */}
                          <p className="text-slate-200 text-sm leading-relaxed mb-3">
                            {h.mensaje}
                          </p>

                          {/* Imagen (si existe) */}
                          {h.imagen && (
                            <div className="mt-3">
                              <img
                                src={h.imagen}
                                alt="Imagen adjunta"
                                className="max-w-full md:max-w-sm h-auto rounded-lg border border-slate-600 cursor-pointer hover:opacity-90 transition-opacity"
                                onClick={() => setImagenModal(h.imagen)}
                                title="Click para ver en tamaño completo"
                              />
                              <p className="text-xs text-slate-400 mt-1">
                                📷 Click en la imagen para ampliar
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Fecha */}
                        <div className="text-right text-xs text-slate-400 whitespace-nowrap">
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
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Cargando historial...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 sticky top-0 z-10">
        <div className="container mx-auto px-4 md:px-6 py-4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-blue-400">
                📊 Historial de Clientes
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                {clients.length} cliente{clients.length !== 1 ? 's' : ''} registrado{clients.length !== 1 ? 's' : ''}
              </p>
            </div>
          
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="container mx-auto">
        <Historial clients={clients} />
      </div>
    </div>
  );
}