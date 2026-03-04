import React, { useState, useMemo } from "react";
import { Calendar, Clock, User, MessageSquare, Phone, Bell, CheckCircle, X, Edit, Trash2 } from "lucide-react";

export default function ReminderList({ reminders, onReminderEdit, onReminderDelete, onReminderComplete }) {
  const [filter, setFilter] = useState('todos');
  const [sortBy, setSortBy] = useState('fecha');

  const filteredAndSortedReminders = useMemo(() => {
    let filtered = reminders;

    // Filtrar
    if (filter !== 'todos') {
      filtered = reminders.filter(r => r.estado === filter);
    }

    // Ordenar
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'fecha':
          return new Date(a.fecha + ' ' + a.hora) - new Date(b.fecha + ' ' + b.hora);
        case 'prioridad':
          const prioridades = { alta: 3, media: 2, baja: 1 };
          return prioridades[b.prioridad] - prioridades[a.prioridad];
        case 'titulo':
          return a.titulo.localeCompare(b.titulo);
        default:
          return 0;
      }
    });
  }, [reminders, filter, sortBy]);

  const getTypeIcon = (tipo) => {
    switch (tipo) {
      case 'cita': return Calendar;
      case 'reunion': return User;
      case 'tarea': return Clock;
      default: return Bell;
    }
  };

  const getPriorityColor = (prioridad) => {
    switch (prioridad) {
      case 'alta': return 'text-rose-400 bg-rose-600/20 border-rose-500/50';
      case 'media': return 'text-amber-400 bg-amber-600/20 border-amber-500/50';
      case 'baja': return 'text-emerald-400 bg-emerald-600/20 border-emerald-500/50';
      default: return 'text-slate-400 bg-slate-600/20 border-slate-500/50';
    }
  };

  const getStatusBadge = (estado) => {
    switch (estado) {
      case 'pendiente':
        return 'bg-amber-600/20 text-amber-300';
      case 'completado':
        return 'bg-emerald-600/20 text-emerald-300';
      case 'cancelado':
        return 'bg-rose-600/20 text-rose-300';
      default:
        return 'bg-slate-600/20 text-slate-300';
    }
  };

  const formatDateTime = (fecha, hora) => {
    const date = new Date(fecha + 'T' + hora);
    return date.toLocaleString('es-MX', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isOverdue = (fecha, hora) => {
    const reminderDate = new Date(fecha + 'T' + hora);
    return reminderDate < new Date() && reminders.find(r => r.fecha === fecha && r.hora === hora)?.estado === 'pendiente';
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-3">
          <Clock className="text-indigo-400" size={20} />
          Lista de Recordatorios
        </h3>
        
        <div className="flex items-center gap-3">
          {/* Filter */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="todos">Todos</option>
            <option value="pendiente">Pendientes</option>
            <option value="completado">Completados</option>
            <option value="cancelado">Cancelados</option>
          </select>
          
          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="fecha">Por fecha</option>
            <option value="prioridad">Por prioridad</option>
            <option value="titulo">Por título</option>
          </select>
        </div>
      </div>

      {/* Reminders list */}
      <div className="space-y-3 max-h-[600px] overflow-y-auto">
        {filteredAndSortedReminders.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="mx-auto text-slate-600 mb-4" size={48} />
            <p className="text-slate-400">No hay recordatorios para mostrar</p>
          </div>
        ) : (
          filteredAndSortedReminders.map((reminder) => {
            const Icon = getTypeIcon(reminder.tipo);
            const overdue = isOverdue(reminder.fecha, reminder.hora);
            
            return (
              <div
                key={reminder.id}
                className={`
                  p-4 rounded-xl border transition-all
                  ${reminder.estado === 'completado' 
                    ? 'bg-slate-800/50 border-slate-700/50 opacity-60' 
                    : overdue
                      ? 'bg-rose-600/10 border-rose-500/30'
                      : 'bg-slate-800/30 border-slate-700/30 hover:bg-slate-800/50'
                  }
                `}
              >
                <div className="flex items-start gap-4">
                  {/* Icon and priority */}
                  <div className="flex flex-col items-center gap-2">
                    <div className={`p-3 rounded-xl border ${getPriorityColor(reminder.prioridad)}`}>
                      <Icon size={20} />
                    </div>
                    <div className={`w-2 h-2 rounded-full ${getPriorityColor(reminder.prioridad).split(' ')[0]}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="text-white font-medium mb-1">
                          {reminder.titulo}
                        </h4>
                        {reminder.descripcion && (
                          <p className="text-sm text-slate-400 mb-2">
                            {reminder.descripcion}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <div className="flex items-center gap-1">
                            <Calendar size={12} />
                            <span>{formatDateTime(reminder.fecha, reminder.hora)}</span>
                          </div>
                          
                          {reminder.clienteNombre && (
                            <div className="flex items-center gap-1">
                              <User size={12} />
                              <span>{reminder.clienteNombre}</span>
                            </div>
                          )}
                          
                          {overdue && (
                            <span className="text-rose-400 font-medium">
                              Vencido
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Status badge */}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(reminder.estado)}`}>
                        {reminder.estado}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-3">
                      {reminder.estado === 'pendiente' && (
                        <>
                          <button
                            onClick={() => onReminderComplete(reminder.id)}
                            className="p-2 text-emerald-400 hover:bg-emerald-600/20 rounded-lg transition-colors"
                            title="Marcar como completado"
                          >
                            <CheckCircle size={16} />
                          </button>
                          <button
                            onClick={() => onReminderEdit(reminder)}
                            className="p-2 text-blue-400 hover:bg-blue-600/20 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit size={16} />
                          </button>
                        </>
                      )}
                      
                      <button
                        onClick={() => onReminderDelete(reminder.id)}
                        className="p-2 text-rose-400 hover:bg-rose-600/20 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
