import React, { useState, useEffect, useContext } from "react";
import { Plus, Calendar, Bell, Clock, CheckCircle } from "lucide-react";
import { AppContext } from "../context/AppContext";
import ReminderForm from "../components/ReminderForm";
import ReminderCalendar from "../components/ReminderCalendar";
import ReminderList from "../components/ReminderList";
import { notificationService } from "../components/NotificationService";

export default function Activity() {
  const { clients, showAlert } = useContext(AppContext);
  const [reminders, setReminders] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [editingReminder, setEditingReminder] = useState(null);

  // Cargar recordatorios al montar
  useEffect(() => {
    const storedReminders = notificationService.getStoredReminders();
    setReminders(storedReminders);
    
    // Solicitar permiso de notificación
    notificationService.requestPermission();
    
    // Iniciar verificación de recordatorios
    notificationService.startChecking(storedReminders);
    
    return () => {
      notificationService.stopChecking();
    };
  }, []);

  // Crear nuevo recordatorio
  const handleReminderCreated = (reminder) => {
    const newReminder = notificationService.addReminder(reminder);
    setReminders(prev => [...prev, newReminder]);
    setShowForm(false);
  };

  // Editar recordatorio
  const handleReminderEdit = (reminder) => {
    setEditingReminder(reminder);
    setShowForm(true);
  };

  // Actualizar recordatorio
  const handleReminderUpdate = (updatedReminder) => {
    const updated = notificationService.updateReminder(updatedReminder);
    setReminders(prev => prev.map(r => r.id === updated.id ? updated : r));
    setShowForm(false);
    setEditingReminder(null);
  };

  // Eliminar recordatorio
  const handleReminderDelete = (reminderId) => {
    if (confirm('¿Estás seguro de que quieres eliminar este recordatorio?')) {
      const updated = notificationService.deleteReminder(reminderId);
      setReminders(updated);
      showAlert('success', 'Recordatorio eliminado correctamente');
    }
  };

  // Completar recordatorio
  const handleReminderComplete = (reminderId) => {
    const completed = notificationService.completeReminder(reminderId);
    setReminders(prev => prev.map(r => r.id === reminderId ? completed : r));
    showAlert('success', '¡Recordatorio completado! 🎉');
  };

  // Estadísticas
  const stats = {
    total: reminders.length,
    pendientes: reminders.filter(r => r.estado === 'pendiente').length,
    completados: reminders.filter(r => r.estado === 'completado').length,
    hoy: reminders.filter(r => {
      const reminderDate = new Date(r.fecha + 'T' + r.hora);
      const today = new Date();
      return reminderDate.toDateString() === today.toDateString() && r.estado === 'pendiente';
    }).length
  };

  return (
    <div className="animate-page-enter pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 text-white p-6 md:p-8 rounded-2xl shadow-soft-lg mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-3">
              <Calendar size={28} />
              Recordatorios
            </h1>
            <p className="text-white/80 mt-2">Gestiona tus recordatorios y notificaciones programadas</p>
          </div>
          
          <button
            onClick={() => setShowForm(true)}
            className="btn bg-white text-indigo-600 hover:bg-slate-100 flex items-center gap-2"
          >
            <Plus size={20} />
            Nuevo Recordatorio
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 px-4">
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
          <div className="flex items-center justify-between mb-2">
            <Clock className="text-slate-400" size={18} />
            <span className="text-xs text-slate-400">Total</span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.total}</div>
        </div>
        
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
          <div className="flex items-center justify-between mb-2">
            <Bell className="text-amber-400" size={18} />
            <span className="text-xs text-slate-400">Pendientes</span>
          </div>
          <div className="text-2xl font-bold text-amber-400">{stats.pendientes}</div>
        </div>
        
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="text-blue-400" size={18} />
            <span className="text-xs text-slate-400">Hoy</span>
          </div>
          <div className="text-2xl font-bold text-blue-400">{stats.hoy}</div>
        </div>
        
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="text-emerald-400" size={18} />
            <span className="text-xs text-slate-400">Completados</span>
          </div>
          <div className="text-2xl font-bold text-emerald-400">{stats.completados}</div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="px-4 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calendario */}
          <ReminderCalendar
            reminders={reminders}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            onReminderClick={(reminder) => handleReminderEdit(reminder)}
          />
          
          {/* Lista de recordatorios */}
          <ReminderList
            reminders={reminders}
            onReminderEdit={handleReminderEdit}
            onReminderDelete={handleReminderDelete}
            onReminderComplete={handleReminderComplete}
          />
        </div>
      </div>

      {/* Formulario de recordatorio */}
      {showForm && (
        <ReminderForm
          clients={clients}
          onReminderCreated={handleReminderCreated}
          onReminderUpdated={handleReminderUpdate}
          reminder={editingReminder}
          onClose={() => {
            setShowForm(false);
            setEditingReminder(null);
          }}
        />
      )}
    </div>
  );
}
