import React, { useState, useEffect, useMemo, useContext } from "react";
import { Bell, Clock, Calendar, MessageCircle, Phone, CheckCircle, AlertCircle, X } from "lucide-react";
import { AppContext } from "../context/AppContext";

export default function RemindersSystem({ clients }) {
  const { showAlert } = useContext(AppContext);
  const [reminders, setReminders] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

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

        ventasRecientes.forEach(venta => {
          notificacionesVentas.push({
            id: `venta-${cliente._id}-${venta.id}`,
            tipo: 'nuevaVenta',
            clienteId: cliente._id,
            clienteNombre: cliente.nombre,
            mensaje: `¡Felicidades! ${cliente.nombre} realizó una nueva venta por $${Number(venta.monto || 0).toLocaleString()}`,
            fechaRecordatorio: new Date(),
            estado: 'nuevo',
            prioridad: 'alta'
          });
        });
      }
    });

    setNotifications(prev => [...prev, ...notificacionesVentas]);
  }, [clients]);

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
              // Aquí podrías navegar al cliente
              window.location.href = `/clients`;
            }
          }
        });
      });
    }, 60000); // Verificar cada minuto

    return () => clearInterval(intervalo);
  }, [generarRecordatorios, showAlert]);

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

  return (
    <div className="w-full space-y-4">
      {/* Header de notificaciones */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Bell className="text-slate-400" size={18} />
          <span className="text-sm text-slate-400">Recordatorios Activos</span>
          <span className="bg-indigo-600 text-white text-xs px-2 py-1 rounded-full">
            {reminders.filter(r => r.estado === 'pendiente').length}
          </span>
        </div>
        
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="btn bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 border border-slate-600/50 flex items-center gap-2"
        >
          <Bell size={16} />
          Ver Todos
        </button>
      </div>

      {/* Panel de notificaciones */}
      {showNotifications && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl bg-slate-900 rounded-2xl border border-slate-700/50 p-6 max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white flex items-center gap-3">
                <Bell className="text-indigo-400" size={20} />
                Notificaciones y Recordatorios
              </h3>
              <button
                onClick={() => setShowNotifications(false)}
                className="text-slate-400 hover:text-white p-2 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              {getNotificationsByPriority().map((notification) => {
                const tipoInfo = getTipoInfo(notification.tipo);
                const Icon = tipoInfo.icon;
                
                return (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-xl border transition-all ${
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
                      <div className={`p-2 rounded-lg ${
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
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-white">
                            {tipoInfo.nombre}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
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
                        <div className="text-xs text-slate-400">
                          {notification.clienteNombre}
                        </div>
                        <div className="text-sm text-white mt-2">
                          {notification.mensaje}
                        </div>
                      </div>
                      <button
                        onClick={() => dismissNotification(notification.id)}
                        className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-700/50">
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
        </div>
      )}

      {/* Resumen de recordatorios */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Pendientes</span>
            <span className="bg-rose-600/20 text-rose-300 text-xs px-2 py-1 rounded-full">
              {reminders.filter(r => r.estado === 'pendiente').length}
            </span>
          </div>
          <div className="text-2xl font-bold text-white">
            {reminders.filter(r => r.estado === 'pendiente').length}
          </div>
        </div>
        
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Hoy</span>
            <span className="bg-blue-600/20 text-blue-300 text-xs px-2 py-1 rounded-full">
              {notifications.filter(n => n.estado === 'nuevo').length}
            </span>
          </div>
          <div className="text-2xl font-bold text-white">
            {notifications.filter(n => n.estado === 'nuevo').length}
          </div>
        </div>
        
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Completados</span>
            <span className="bg-emerald-600/20 text-emerald-300 text-xs px-2 py-1 rounded-full">
              {reminders.filter(r => r.estado === 'completado').length}
            </span>
          </div>
          <div className="text-2xl font-bold text-white">
            {reminders.filter(r => r.estado === 'completado').length}
          </div>
        </div>
      </div>

      {/* Lista de recordatorios recientes */}
      <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/50">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-3">
          <Clock className="text-indigo-400" size={20} />
          Recordatorios Recientes
        </h3>
        
        <div className="space-y-3">
          {reminders
            .filter(r => r.estado === 'pendiente')
            .slice(0, 5)
            .map((recordatorio) => {
              const tipoInfo = getTipoInfo(recordatorio.tipo);
              const Icon = tipoInfo.icon;
              
              return (
                <div
                  key={recordatorio.id}
                  className={`p-4 rounded-xl border transition-all ${
                    recordatorio.prioridad === 'alta'
                      ? 'bg-rose-600/20 border-rose-600/50'
                      : recordatorio.prioridad === 'media'
                        ? 'bg-amber-600/20 border-amber-600/50'
                        : 'bg-slate-700/50 border-slate-600/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      recordatorio.prioridad === 'alta'
                        ? 'bg-rose-600/30'
                        : recordatorio.prioridad === 'media'
                          ? 'bg-amber-600/30'
                          : 'bg-slate-600/30'
                    }`}>
                      <Icon 
                        size={16} 
                        className={
                          recordatorio.prioridad === 'alta'
                            ? 'text-rose-400'
                            : recordatorio.prioridad === 'media'
                              ? 'text-amber-400'
                              : 'text-slate-400'
                        }
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-white">
                          {tipoInfo.nombre}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          recordatorio.prioridad === 'alta'
                            ? 'bg-rose-600/30 text-rose-300'
                            : recordatorio.prioridad === 'media'
                              ? 'bg-amber-600/30 text-amber-300'
                              : 'bg-slate-600/30 text-slate-300'
                        }`}>
                          {recordatorio.prioridad}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400">
                        {recordatorio.clienteNombre}
                      </div>
                      <div className="text-sm text-white mt-2">
                        {recordatorio.mensaje}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        {new Date(recordatorio.fechaRecordatorio).toLocaleDateString('es-MX', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
