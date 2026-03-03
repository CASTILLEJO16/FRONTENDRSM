import React, { useState, useEffect, useMemo, useContext } from "react";
import { createPortal } from "react-dom";
import { Bell, Clock, Calendar, MessageCircle, Phone, CheckCircle, AlertCircle, X, Settings } from "lucide-react";
import { AppContext } from "../context/AppContext";

export default function NotificationsPanel({ clients }) {
  const { showAlert } = useContext(AppContext);
  const [reminders, setReminders] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [metasConfiguradas, setMetasConfiguradas] = useState({
    ventas: { dia: 5000, semana: 35000, mes: 150000 },
    clientes: { dia: 2, semana: 15, mes: 60 },
    visitas: { dia: 5, semana: 35, mes: 140 }
  });

  // Tipos de recordatorios automáticos
  const tiposRecordatorios = {
    followUp: {
      nombre: "Seguimiento",
      descripcion: "Recordar contactar cliente",
      icon: MessageCircle,
      color: "blue",
      dias: 3
    },
    visita: {
      nombre: "Visita programada",
      descripcion: "Recordar visita agendada",
      icon: Calendar,
      color: "green",
      dias: 1
    },
    cumpleaños: {
      nombre: "Cumpleaños",
      descripcion: "Felicitar cumpleaños",
      icon: Bell,
      color: "purple",
      dias: 365
    },
    inactividad: {
      nombre: "Cliente inactivo",
      descripcion: "Recordar reactivar cliente",
      icon: AlertCircle,
      color: "red",
      dias: 30
    },
    nuevaVenta: {
      nombre: "Nueva venta",
      descripcion: "Felicitar por nueva compra",
      icon: CheckCircle,
      color: "emerald",
      dias: 0
    }
  };

  // Generar recordatorios automáticos
  const generarRecordatorios = useMemo(() => {
    if (!clients || clients.length === 0) return [];

    const recordatoriosGenerados = [];
    const hoy = new Date();

    clients.forEach(cliente => {
      // Recordatorio de seguimiento (3 días sin actividad)
      if (cliente.ventas && cliente.ventas.length > 0) {
        const ultimaVenta = new Date(Math.max(...cliente.ventas.map(v => new Date(v.fecha))));
        const diasSinVenta = Math.floor((hoy - ultimaVenta) / (1000 * 60 * 60 * 24));
        
        if (diasSinVenta >= 3 && diasSinVenta <= 5) {
          recordatoriosGenerados.push({
            id: `followup-${cliente._id}`,
            tipo: 'followUp',
            clienteId: cliente._id,
            clienteNombre: cliente.nombre,
            mensaje: `Hace ${diasSinVenta} días que ${cliente.nombre} no realiza una compra. ¿Es buen momento para un seguimiento?`,
            fechaRecordatorio: new Date(ultimaVenta.getTime() + (3 * 24 * 60 * 60 * 1000)),
            estado: 'pendiente',
            prioridad: diasSinVenta >= 5 ? 'alta' : 'media'
          });
        }
      }

      // Recordatorio de inactividad (30 días sin actividad)
      const fechaCreacion = new Date(cliente.fecha);
      const diasInactivo = Math.floor((hoy - fechaCreacion) / (1000 * 60 * 60 * 24));
      
      if (diasInactivo >= 30 && diasInactivo <= 32 && cliente.ventas && cliente.ventas.length === 0) {
        recordatoriosGenerados.push({
          id: `inactividad-${cliente._id}`,
          tipo: 'inactividad',
          clienteId: cliente._id,
          clienteNombre: cliente.nombre,
          mensaje: `${cliente.nombre} lleva ${diasInactivo} días sin actividad. Considera contactarlo para reactivar la relación.`,
          fechaRecordatorio: new Date(fechaCreacion.getTime() + (30 * 24 * 60 * 60 * 1000)),
          estado: 'pendiente',
          prioridad: 'alta'
        });
      }

      // Recordatorio de cumpleaños
      if (cliente.fecha_nacimiento) {
        const cumpleaños = new Date(cliente.fecha_nacimiento);
        const proximoCumpleaños = new Date(hoy.getFullYear(), cumpleaños.getMonth(), cumpleaños.getDate());
        
        if (proximoCumpleaños > hoy) {
          const diasParaCumpleaños = Math.floor((proximoCumpleaños - hoy) / (1000 * 60 * 60 * 24));
          if (diasParaCumpleaños <= 7) {
            recordatoriosGenerados.push({
              id: `cumpleaños-${cliente._id}`,
              tipo: 'cumpleaños',
              clienteId: cliente._id,
              clienteNombre: cliente.nombre,
              mensaje: `¡${cliente.nombre} cumple años en ${diasParaCumpleaños} días! 🎉`,
              fechaRecordatorio: proximoCumpleaños,
              estado: 'pendiente',
              prioridad: 'baja'
            });
          }
        }
      }
    });

    return recordatoriosGenerados;
  }, [clients]);

  // Recordatorios de ventas recientes
  useEffect(() => {
    if (!clients || clients.length === 0) return;

    const notificacionesVentas = [];
    const ahora = new Date();

    clients.forEach(cliente => {
      if (cliente.ventas && cliente.ventas.length > 0) {
        const ventasRecientes = cliente.ventas.filter(v => {
          const fechaVenta = new Date(v.fecha);
          const horasDiferencia = Math.abs(ahora - fechaVenta) / (1000 * 60 * 60);
          return horasDiferencia <= 24; // Ventas de las últimas 24 horas
        });

        ventasRecientes.forEach((venta, index) => {
          const uniqueId = `venta-${cliente._id}-${venta.id || `index-${index}-${Date.now()}`}`;
          
          // Evitar duplicados - solo si no existe en notifications
          if (!notifications.find(n => n.id === uniqueId)) {
            notificacionesVentas.push({
              id: uniqueId,
              tipo: 'nuevaVenta',
              clienteId: cliente._id,
              clienteNombre: cliente.nombre,
              mensaje: `¡Felicidades! ${cliente.nombre} realizó una nueva venta por $${Number(venta.monto || 0).toLocaleString()}`,
              fechaRecordatorio: new Date(),
              estado: 'nuevo',
              prioridad: 'alta'
            });
          }
        });
      }
    });

    // Solo añadir notificaciones nuevas una vez
    if (notificacionesVentas.length > 0) {
      setNotifications(prev => {
        const existingIds = new Set(prev.map(n => n.id));
        const nuevasNotificaciones = notificacionesVentas.filter(n => !existingIds.has(n.id));
        return [...prev, ...nuevasNotificaciones];
      });
    }
  }, [clients]); // Eliminado notifications de las dependencias

  // Verificar recordatorios pendientes
  useEffect(() => {
    const intervalo = setInterval(() => {
      const ahora = new Date();
      const recordatoriosActivos = generarRecordatorios.filter(r => 
        r.estado === 'pendiente' && r.fechaRecordatorio <= ahora
      );

      recordatoriosActivos.forEach(recordatorio => {
        // Mostrar notificación
        setNotifications(prev => [...prev, recordatorio]);
        
        // Actualizar estado
        setReminders(prev => prev.map(r => 
          r.id === recordatorio.id ? { ...r, estado: 'mostrado' } : r
        ));
        
        // Mostrar alerta
        showAlert('info', recordatorio.mensaje, {
          duration: 5000,
          action: {
            label: 'Ver cliente',
            onClick: () => {
              window.location.href = `/clients`;
            }
          }
        });
      });
    }, 60000); // Verificar cada minuto

    return () => clearInterval(intervalo);
  }, [generarRecordatorios, showAlert]);

  useEffect(() => {
    if (!showNotifications) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [showNotifications]);

  const dismissNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    setReminders(prev => prev.map(r => 
      r.id === id ? { ...r, estado: 'completado' } : r
    ));
  };

  const dismissAllNotifications = () => {
    setNotifications([]);
    setReminders(prev => prev.map(r => ({ ...r, estado: 'completado' })));
  };

  const getNotificationsByPriority = () => {
    return notifications.sort((a, b) => {
      const prioridades = { alta: 3, media: 2, baja: 1, nuevo: 4 };
      return prioridades[b.prioridad] - prioridades[a.prioridad];
    });
  };

  const getTipoInfo = (tipo) => {
    return tiposRecordatorios[tipo] || tiposRecordatorios.followUp;
  };

  const updateMeta = (tipo, periodo, valor) => {
    setMetasConfiguradas(prev => ({
      ...prev,
      [tipo]: {
        ...prev[tipo],
        [periodo]: Number(valor)
      }
    }));
  };

  const totalNotificaciones = notifications.filter(n => n.estado === 'nuevo').length + 
                            reminders.filter(r => r.estado === 'pendiente').length;

  return (
    <>
      {/* Botón de notificaciones en el header */}
      <div className="relative">
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800/50"
        >
          <Bell size={20} />
          {totalNotificaciones > 0 && (
            <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {totalNotificaciones > 9 ? '9+' : totalNotificaciones}
            </span>
          )}
        </button>
      </div>
      
      {/* Panel de notificaciones */}
      {showNotifications && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[99999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl max-h-[calc(100dvh-2rem)] bg-slate-900 rounded-2xl border border-slate-700/50 p-6 overflow-hidden flex flex-col shadow-2xl">
            <div className="flex items-center justify-between mb-6 flex-shrink-0">
              <h3 className="text-xl font-semibold text-white flex items-center gap-3">
                <Bell className="text-indigo-400" size={20} />
                Notificaciones y Recordatorios
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="text-slate-400 hover:text-white p-2 rounded-lg transition-colors"
                >
                  <Settings size={18} />
                </button>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-slate-400 hover:text-white p-2 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-hidden">
              {showSettings ? (
                /* Panel de configuración de metas */
                <div className="h-full overflow-y-auto">
                  <h4 className="text-lg font-medium text-white mb-4">Configurar Metas</h4>
                  
                  {Object.entries(metasConfiguradas).map(([tipo, periodos]) => (
                    <div key={tipo} className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 mb-4">
                      <h5 className="text-white font-medium mb-3 capitalize">{tipo}</h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {Object.entries(periodos).map(([periodo, valor]) => (
                          <div key={periodo}>
                            <label className="text-sm text-slate-400 mb-1 block capitalize">{periodo}</label>
                            <input
                              type="number"
                              value={valor}
                              onChange={(e) => updateMeta(tipo, periodo, e.target.value)}
                              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              placeholder={`Meta ${periodo}`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Lista de notificaciones */
                <div className="h-full overflow-y-auto space-y-4">
                  {getNotificationsByPriority().map((notification) => {
                    const tipoInfo = getTipoInfo(notification.tipo);
                    const Icon = tipoInfo.icon;
                    
                    return (
                      <div
                        key={notification.id}
                        className={`p-4 rounded-xl border transition-all flex-shrink-0 ${
                          notification.estado === 'nuevo' 
                            ? 'bg-emerald-600/20 border-emerald-600/50' 
                            : notification.prioridad === 'alta'
                              ? 'bg-rose-600/20 border-rose-600/50'
                              : notification.prioridad === 'media'
                                ? 'bg-amber-600/20 border-amber-600/50'
                                : 'bg-slate-700/50 border-slate-600/50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg flex-shrink-0 ${
                            notification.estado === 'novo'
                              ? 'bg-emerald-600/30'
                              : notification.prioridad === 'alta'
                                ? 'bg-rose-600/30'
                                : notification.prioridad === 'media'
                                  ? 'bg-amber-600/30'
                                  : 'bg-slate-600/30'
                          }`}>
                            <Icon 
                              size={16} 
                              className={
                                notification.estado === 'novo'
                                  ? 'text-emerald-400'
                                  : notification.prioridad === 'alta'
                                    ? 'text-rose-400'
                                    : notification.prioridad === 'media'
                                      ? 'text-amber-400'
                                      : 'text-slate-400'
                              }
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-white">
                                {tipoInfo.nombre}
                              </span>
                              <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ${
                                notification.estado === 'novo'
                                  ? 'bg-emerald-600/30 text-emerald-300'
                                  : notification.prioridad === 'alta'
                                    ? 'bg-rose-600/30 text-rose-300'
                                    : notification.prioridad === 'media'
                                      ? 'bg-amber-600/30 text-amber-300'
                                      : 'bg-slate-600/30 text-slate-300'
                              }`}>
                                {notification.estado === 'novo' ? 'Nuevo' : notification.prioridad}
                              </span>
                            </div>
                            <div className="text-xs text-slate-400 truncate">
                              {notification.clienteNombre}
                            </div>
                            <div className="text-sm text-white mt-2">
                              {notification.mensaje}
                            </div>
                          </div>
                          <button
                            onClick={() => dismissNotification(notification.id)}
                            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors flex-shrink-0"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-700/50 flex-shrink-0">
              <button
                onClick={dismissAllNotifications}
                className="btn bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 border border-slate-600/50"
              >
                Descartar Todos
              </button>
              <button
                onClick={() => setShowNotifications(false)}
                className="btn btn-primary"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
