import { createContext, useContext, useCallback } from 'react';
import { useNotifications } from '../context/NotificationsContext';

// Logger service centralizado
class LoggerService {
  static log(level, message, context = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      context,
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    // En desarrollo, log a consola
    if (import.meta.env.DEV) {
      console.group(`[${level.toUpperCase()}] ${message}`);
      console.log('Context:', context);
      console.log('Timestamp:', timestamp);
      console.groupEnd();
    }

    // En producción, enviar a servicio externo
    if (import.meta.env.PROD) {
      this.sendToService(logEntry);
    }

    // Guardar en localStorage para debugging offline
    this.saveToLocalStorage(logEntry);
  }

  static error(message, context = {}) {
    this.log('error', message, context);
  }

  static warn(message, context = {}) {
    this.log('warn', message, context);
  }

  static info(message, context = {}) {
    this.log('info', message, context);
  }

  static sendToService(logEntry) {
    // Implementar envío a servicio externo (Sentry, LogRocket, etc.)
    // Por ahora, solo simulamos el envío
    try {
      // Ejemplo: fetch('/api/logs', { method: 'POST', body: JSON.stringify(logEntry) });
      console.log('Log sent to service:', logEntry);
    } catch (error) {
      console.error('Failed to send log to service:', error);
    }
  }

  static saveToLocalStorage(logEntry) {
    try {
      const existingLogs = JSON.parse(localStorage.getItem('app_logs') || '[]');
      const updatedLogs = [...existingLogs.slice(-99), logEntry]; // Mantener últimos 100 logs
      localStorage.setItem('app_logs', JSON.stringify(updatedLogs));
    } catch (error) {
      console.error('Failed to save log to localStorage:', error);
    }
  }
}

// Hook para manejo de errores
export const useErrorHandler = () => {
  const { showError, showErrorAlert } = useNotifications();

  const handleError = useCallback((error, options = {}) => {
    const {
      context = '',
      userMessage = 'Ha ocurrido un error',
      showToast = false,
      showAlert = false,
      fallbackAction = null
    } = options;

    // Log del error
    LoggerService.error('Error handled by useErrorHandler', {
      error: error.message,
      stack: error.stack,
      context,
      options
    });

    // Mostrar notificación al usuario
    if (showToast) {
      showError(userMessage);
    }

    if (showAlert) {
      showErrorAlert(userMessage);
    }

    // Ejecutar acción de fallback si existe
    if (fallbackAction && typeof fallbackAction === 'function') {
      try {
        fallbackAction();
      } catch (fallbackError) {
        LoggerService.error('Fallback action failed', { 
          originalError: error, 
          fallbackError: fallbackError 
        });
      }
    }

    // En desarrollo, lanzar el error para debugging
    if (import.meta.env.DEV) {
      console.error('Error handled by useErrorHandler:', error);
    }

    return error;
  }, [showError, showErrorAlert]);

  const handleAsyncError = useCallback(async (asyncFn, options = {}) => {
    try {
      return await asyncFn();
    } catch (error) {
      handleError(error, options);
      throw error; // Re-lanzar para que el llamador pueda manejarlo si es necesario
    }
  }, [handleError]);

  const handleNetworkError = useCallback((error, options = {}) => {
    const isNetworkError = !navigator.onLine || 
                          error?.message?.includes('Network Error') ||
                          error?.code === 'NETWORK_ERROR' ||
                          error?.status === 0;

    const networkOptions = {
      ...options,
      context: {
        ...options.context,
        isNetworkError,
        isOnline: navigator.onLine
      }
    };

    if (isNetworkError) {
      return handleError(error, {
        userMessage: 'Error de conexión. Verifica tu internet e intenta nuevamente.',
        ...networkOptions
      });
    }

    return handleError(error, networkOptions);
  }, [handleError]);

  const handleValidationError = useCallback((error, options = {}) => {
    return handleError(error, {
      userMessage: error?.response?.data?.message || 'Datos inválidos. Por favor verifica la información.',
      logLevel: 'warn',
      ...options
    });
  }, [handleError]);

  const handleAuthError = useCallback((error, options = {}) => {
    const isAuthError = error?.response?.status === 401 || 
                       error?.message?.includes('Unauthorized') ||
                       error?.code === 'AUTH_ERROR';

    if (isAuthError) {
      // Limpiar localStorage y redirigir a login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    return handleError(error, {
      userMessage: isAuthError ? 'Sesión expirada. Por favor inicia sesión nuevamente.' : 'Error de autenticación.',
      ...options
    });
  }, [handleError]);

  return {
    handleError,
    handleAsyncError,
    handleNetworkError,
    handleValidationError,
    handleAuthError,
    logger: LoggerService
  };
};

export default useErrorHandler;
