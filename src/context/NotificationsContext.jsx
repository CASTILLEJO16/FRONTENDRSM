import React from 'react';

const NotificationsContext = React.createContext();

export function useNotifications() {
  const context = React.useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
}

export function NotificationsProvider({ children }) {
  const [toasts, setToasts] = React.useState([]);
  const [alerts, setAlerts] = React.useState([]);
  const toastIdRef = React.useRef(0);
  const alertIdRef = React.useRef(0);

  // Generar ID único para toast
  const generateToastId = React.useCallback(() => {
    return `toast-${++toastIdRef.current}-${Date.now()}`;
  }, []);

  // Generar ID único para alert
  const generateAlertId = React.useCallback(() => {
    return `alert-${++alertIdRef.current}-${Date.now()}`;
  }, []);

  // Mostrar toast (notificación temporal)
  const showToast = React.useCallback((message, options = {}) => {
    const {
      type = 'info',
      duration = 3000,
      position = 'top-right',
      persistent = false,
      action = null
    } = options;

    const id = generateToastId();
    const toast = {
      id,
      message,
      type,
      duration,
      position,
      persistent,
      action,
      timestamp: Date.now()
    };

    setToasts(prev => [...prev, toast]);

    // Auto-remover si no es persistente
    if (!persistent && duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, [generateToastId]);

  // Remover toast específico
  const removeToast = React.useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  // Limpiar todos los toasts
  const clearToasts = React.useCallback(() => {
    setToasts([]);
  }, []);

  // Mostrar alerta (modal o banner)
  const showAlert = React.useCallback((message, options = {}) => {
    const {
      type = 'info',
      title = null,
      persistent = false,
      autoClose = false,
      duration = 5000,
      actions = []
    } = options;

    const id = generateAlertId();
    const alert = {
      id,
      message,
      title,
      type,
      persistent,
      autoClose,
      duration,
      actions,
      timestamp: Date.now()
    };

    setAlerts(prev => [...prev, alert]);

    // Auto-cerrar si no es persistente
    if (autoClose && !persistent && duration > 0) {
      setTimeout(() => {
        removeAlert(id);
      }, duration);
    }

    return id;
  }, [generateAlertId]);

  // Remover alerta específica
  const removeAlert = React.useCallback((id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  }, []);

  // Limpiar todas las alertas
  const clearAlerts = React.useCallback(() => {
    setAlerts([]);
  }, []);

  // Métodos de conveniencia para diferentes tipos
  const showSuccess = React.useCallback((message, options = {}) => {
    return showToast(message, { ...options, type: 'success' });
  }, [showToast]);

  const showError = React.useCallback((message, options = {}) => {
    return showToast(message, { ...options, type: 'error', duration: 5000 });
  }, [showToast]);

  const showWarning = React.useCallback((message, options = {}) => {
    return showToast(message, { ...options, type: 'warning', duration: 4000 });
  }, [showToast]);

  const showInfo = React.useCallback((message, options = {}) => {
    return showToast(message, { ...options, type: 'info' });
  }, [showToast]);

  // Alertas de conveniencia
  const showSuccessAlert = React.useCallback((message, options = {}) => {
    return showAlert(message, { ...options, type: 'success' });
  }, [showAlert]);

  const showErrorAlert = React.useCallback((message, options = {}) => {
    return showAlert(message, { ...options, type: 'error', persistent: true });
  }, [showAlert]);

  const showWarningAlert = React.useCallback((message, options = {}) => {
    return showAlert(message, { ...options, type: 'warning' });
  }, [showAlert]);

  const showInfoAlert = React.useCallback((message, options = {}) => {
    return showAlert(message, { ...options, type: 'info' });
  }, [showAlert]);

  // Confirmación de usuario
  const showConfirm = React.useCallback((message, options = {}) => {
    const {
      title = 'Confirmar acción',
      confirmText = 'Confirmar',
      cancelText = 'Cancelar',
      onConfirm = null,
      onCancel = null
    } = options;

    return new Promise((resolve) => {
      const id = showAlert(message, {
        title,
        type: 'warning',
        persistent: true,
        actions: [
          {
            label: cancelText,
            variant: 'secondary',
            onClick: () => {
              removeAlert(id);
              onCancel?.();
              resolve(false);
            }
          },
          {
            label: confirmText,
            variant: 'primary',
            onClick: () => {
              removeAlert(id);
              onConfirm?.();
              resolve(true);
            }
          }
        ]
      });
    });
  }, [showAlert, removeAlert]);

  // Notificación de progreso
  const showProgress = React.useCallback((message, options = {}) => {
    const {
      progress = 0,
      indeterminate = false,
      cancelable = false,
      onCancel = null
    } = options;

    return showToast(message, {
      type: 'info',
      persistent: true,
      action: cancelable ? {
        label: 'Cancelar',
        onClick: onCancel
      } : null,
      progress,
      indeterminate
    });
  }, [showToast]);

  // Actualizar progreso de una notificación existente
  const updateProgress = React.useCallback((id, progress) => {
    setToasts(prev => prev.map(toast => 
      toast.id === id ? { ...toast, progress } : toast
    ));
  }, []);

  // Notificación de tarea completada
  const showTaskComplete = React.useCallback((taskName, result = 'success') => {
    const messages = {
      success: `${taskName} completado exitosamente`,
      error: `Error en ${taskName}`,
      warning: `${taskName} completado con advertencias`
    };

    const types = {
      success: 'success',
      error: 'error',
      warning: 'warning'
    };

    return showToast(messages[result] || messages.success, {
      type: types[result] || 'success',
      duration: 4000
    });
  }, [showToast]);

  // Notificación de conexión
  const showConnectionStatus = React.useCallback((isOnline) => {
    if (isOnline) {
      return showToast('Conexión restablecida', {
        type: 'success',
        duration: 3000
      });
    } else {
      return showToast('Conexión perdida', {
        type: 'error',
        duration: 0, // Persistente hasta que se restablezca
        persistent: true
      });
    }
  }, [showToast]);

  // Obtener toasts por posición
  const getToastsByPosition = React.useCallback((position) => {
    return toasts.filter(toast => toast.position === position);
  }, [toasts]);

  // Estadísticas de notificaciones
  const getNotificationStats = React.useCallback(() => {
    const now = Date.now();
    const lastHour = now - (60 * 60 * 1000);
    const lastDay = now - (24 * 60 * 60 * 1000);

    const recentToasts = toasts.filter(t => t.timestamp > lastHour);
    const todayToasts = toasts.filter(t => t.timestamp > lastDay);

    const byType = toasts.reduce((acc, toast) => {
      acc[toast.type] = (acc[toast.type] || 0) + 1;
      return acc;
    }, {});

    return {
      total: toasts.length,
      active: toasts.length,
      recent: recentToasts.length,
      today: todayToasts.length,
      byType,
      alerts: alerts.length
    };
  }, [toasts, alerts]);

  const value = {
    // Estado
    toasts,
    alerts,
    
    // Toast methods
    showToast,
    removeToast,
    clearToasts,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    
    // Alert methods
    showAlert,
    removeAlert,
    clearAlerts,
    showSuccessAlert,
    showErrorAlert,
    showWarningAlert,
    showInfoAlert,
    
    // Special methods
    showConfirm,
    showProgress,
    updateProgress,
    showTaskComplete,
    showConnectionStatus,
    
    // Utilities
    getToastsByPosition,
    getNotificationStats
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

export default NotificationsContext;
