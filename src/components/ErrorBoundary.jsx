import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null 
    };
  }

  static getDerivedStateFromError(error) {
    return { 
      hasError: true,
      errorId: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Log error para debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // En producción, enviar a servicio de logging
    if (import.meta.env.PROD) {
      // Aquí podrías integrar con Sentry, LogRocket, etc.
      this.logErrorToService(error, errorInfo);
    }
  }

  logErrorToService = (error, errorInfo) => {
    // Implementar logging a servicio externo
    // Ejemplo: Sentry.captureException(error, { extra: errorInfo });
    
    // Por ahora, solo log a consola con más contexto
    console.group('🚨 Error Boundary Report');
    console.error('Error:', error);
    console.error('Error Info:', errorInfo);
    console.error('Error ID:', this.state.errorId);
    console.error('User Agent:', navigator.userAgent);
    console.error('URL:', window.location.href);
    console.groupEnd();
  };

  handleReset = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null 
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // UI personalizada según las props
      if (this.props.fallback) {
        return this.props.fallback({
          error: this.state.error,
          errorInfo: this.state.errorInfo,
          reset: this.handleReset
        });
      }

      // UI por defecto
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-rose-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-rose-400" />
            </div>
            
            <h1 className="text-2xl font-bold text-slate-100 mb-4">
              Algo salió mal
            </h1>
            
            <p className="text-slate-400 mb-6">
              Ha ocurrido un error inesperado. Nuestro equipo ha sido notificado y estamos trabajando en solucionarlo.
            </p>

            {import.meta.env.DEV && this.state.error && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-sm text-slate-300 hover:text-slate-100 mb-2">
                  Ver detalles del error (solo desarrollo)
                </summary>
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 mt-2 text-xs font-mono text-slate-300 overflow-auto max-h-40">
                  <div className="text-rose-400 font-bold mb-2">Error:</div>
                  <div className="mb-4">{this.state.error.toString()}</div>
                  
                  {this.state.errorInfo && (
                    <>
                      <div className="text-rose-400 font-bold mb-2">Component Stack:</div>
                      <div className="whitespace-pre-wrap">{this.state.errorInfo.componentStack}</div>
                    </>
                  )}
                  
                  <div className="text-slate-400 mt-4 text-xs">
                    Error ID: {this.state.errorId}
                  </div>
                </div>
              </details>
            )}
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={this.handleReset}
                className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl transition-colors"
              >
                <RefreshCw size={16} />
                Intentar de nuevo
              </button>
              
              <button
                onClick={this.handleGoHome}
                className="flex-1 flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-xl transition-colors"
              >
                <Home size={16} />
                Ir al inicio
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-800">
              <p className="text-xs text-slate-500">
                Si el problema persiste, contacta al soporte técnico.
              </p>
              {this.state.errorId && (
                <p className="text-xs text-slate-500 mt-1">
                  Código de referencia: {this.state.errorId}
                </p>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
