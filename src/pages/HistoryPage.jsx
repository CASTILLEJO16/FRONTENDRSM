import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

// Componente de Historial
function Historial({ clients }) {
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
    <div className="space-y-6 p-6">
      {clients.map((c) => (
        <div key={c._id} className="bg-slate-800 rounded-lg shadow-lg overflow-hidden">
          {/* Header del Cliente */}
          <div className="bg-slate-900 p-4 border-b border-slate-700">
            <h2 className="text-xl font-bold text-blue-400">{c.nombre}</h2>
            <div className="flex gap-4 mt-2 text-sm text-slate-400">
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
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        {/* Tipo */}
                        <div className="flex items-center gap-2 mb-2">
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
                        <p className="text-slate-200 text-sm leading-relaxed">
                          {h.mensaje}
                        </p>
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
  );
}

// Componente Principal - HistoryPage (USANDO APPCONTEXT)
export default function HistoryPage() {
  const { clients, fetchClients } = useContext(AppContext);

  // ✅ Recargar clientes cuando se monta el componente
  React.useEffect(() => {
    fetchClients();
  }, []);

  // 🔍 DEBUG: Ver qué trae el contexto
  React.useEffect(() => {
    console.log('=== DEBUG HISTORIAL ===');
    console.log('Total clientes:', clients?.length || 0);
    console.log('Primer cliente:', clients?.[0]);
    console.log('Historial primer cliente:', clients?.[0]?.historial);
  }, [clients]);

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
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-blue-400">
                📊 Historial de Clientes
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                {clients.length} cliente{clients.length !== 1 ? 's' : ''} registrado{clients.length !== 1 ? 's' : ''}
              </p>
            </div>
            <button
              onClick={handleRecargar}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2"
            >
              🔄 Actualizar
            </button>
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