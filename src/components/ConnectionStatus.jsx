import React from 'react';
import { useClients } from '../context/ClientsContext';
import { AlertCircle, RefreshCw, Wifi, WifiOff } from 'lucide-react';

export default function ConnectionStatus() {
  const { isLoading, error, retryCount, retryFetchClients, clearError } = useClients();

  // No mostrar nada si está cargando normalmente o no hay error
  if (isLoading && !error) return null;
  if (!error && retryCount === 0) return null;

  const isConnectionError = error?.message?.includes('timeout') || 
                           error?.code === 'ECONNABORTED' ||
                           error?.message?.includes('Network Error');

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-40">
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 shadow-lg backdrop-blur-sm">
        <div className="flex items-start gap-3">
          {/* Icono de estado */}
          <div className="flex-shrink-0">
            {isConnectionError ? (
              <WifiOff className="w-5 h-5 text-rose-400" />
            ) : (
              <AlertCircle className="w-5 h-5 text-yellow-400" />
            )}
          </div>

          {/* Contenido */}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-slate-100">
              {isConnectionError ? 'Sin conexión al servidor' : 'Error de carga'}
            </h4>
            
            <p className="text-xs text-slate-400 mt-1">
              {isConnectionError 
                ? 'No se puede conectar al backend. Verifica que el servidor esté corriendo en http://localhost:4000'
                : error?.message || 'Ocurrió un error inesperado'
              }
            </p>

            {retryCount > 0 && (
              <p className="text-xs text-slate-500 mt-1">
                Intentos fallidos: {retryCount}/3
              </p>
            )}
          </div>

          {/* Acciones */}
          <div className="flex gap-2">
            {retryCount < 3 && (
              <button
                onClick={retryFetchClients}
                className="flex items-center gap-1 px-2 py-1 text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                Reintentar
              </button>
            )}
            
            <button
              onClick={clearError}
              className="p-1 text-slate-400 hover:text-slate-200 transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        {/* Indicador de progreso si está reintentando */}
        {isLoading && retryCount > 0 && (
          <div className="mt-3">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <RefreshCw className="w-3 h-3 animate-spin" />
              Reintentando conexión...
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
