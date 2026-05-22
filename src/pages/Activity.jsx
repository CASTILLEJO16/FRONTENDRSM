import React, { useState, useEffect } from "react";
import { Plus, Calendar, Bell, Clock, CheckCircle, CalendarDays, Search } from "lucide-react";
import { useClients } from "../context/ClientsContext";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationsContext";
import ReminderForm from "../components/ReminderForm";
import ReminderCalendar from "../components/ReminderCalendar";
import ReminderList from "../components/ReminderList";
import { notificationService } from "../components/NotificationService";

export default function Activity() {
  const { clients } = useClients();
  const { currentUser } = useAuth();
  const { showSuccessAlert, showErrorAlert } = useNotifications();
  const [reminders, setReminders] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [editingReminder, setEditingReminder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredReminders, setFilteredReminders] = useState(reminders);

  // Generar clave única para el usuario
  const getUserKey = () => {
    return currentUser?.email ? `reminders_${currentUser.email}` : 'reminders_guest';
  };

  // Cargar recordatorios al montar y cuando cambia el usuario
  useEffect(() => {
    const userKey = getUserKey();
    const storedReminders = notificationService.getStoredReminders(userKey);
    setReminders(storedReminders);
    setFilteredReminders(storedReminders);

    // Solicitar permiso de notificación
    notificationService.requestPermission();

    // Iniciar verificación de recordatorios
    notificationService.startChecking(storedReminders);

    return () => {
      notificationService.stopChecking();
    };
  }, [currentUser]);

  // Filtrar recordatorios por término de búsqueda
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredReminders(reminders);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = reminders.filter(reminder =>
      reminder.titulo?.toLowerCase().includes(term) ||
      reminder.descripcion?.toLowerCase().includes(term) ||
      reminder.cliente?.toLowerCase().includes(term)
    );
    setFilteredReminders(filtered);
  }, [searchTerm, reminders]);

  // Crear nuevo recordatorio
  const handleReminderCreated = (reminder) => {
    const userKey = getUserKey();
    const newReminder = notificationService.addReminder(reminder, userKey);
    setReminders(prev => [...prev, newReminder]);
    setShowForm(false);
  };

  const handleSelectReminder = (reminder) => {
    setSearchTerm(reminder.titulo);
    setShowSuggestions(false);
    setFilteredReminders([reminder]);
  };

  // Editar recordatorio
  const handleReminderEdit = (reminder) => {
    setEditingReminder(reminder);
    setShowForm(true);
  };

  // Actualizar recordatorio
  const handleReminderUpdate = (updatedReminder) => {
    const userKey = getUserKey();
    const updated = notificationService.updateReminder(updatedReminder, userKey);
    setReminders(prev => prev.map(r => r.id === updated.id ? updated : r));
    setShowForm(false);
    setEditingReminder(null);
  };

  // Eliminar recordatorio
  const handleReminderDelete = (reminderId) => {
    if (confirm('¿Estás seguro de que quieres eliminar este recordatorio?')) {
      const userKey = getUserKey();
      const updated = notificationService.deleteReminder(reminderId, userKey);
      setReminders(updated);
      showSuccessAlert('Recordatorio eliminado correctamente');
    }
  };

  // Completar recordatorio
  const handleReminderComplete = (reminderId) => {
    const userKey = getUserKey();
    const completed = notificationService.completeReminder(reminderId, userKey);
    setReminders(prev => prev.map(r => r.id === reminderId ? completed : r));
    showSuccessAlert('¡Recordatorio completado! 🎉');
  };

  // Estadísticas
  const stats = {
    total: filteredReminders.length,
    pendientes: filteredReminders.filter(r => r.estado === 'pendiente').length,
    completados: filteredReminders.filter(r => r.estado === 'completado').length,
    hoy: filteredReminders.filter(r => {
      const reminderDate = new Date(r.fecha + 'T' + r.hora);
      const today = new Date();
      return reminderDate.toDateString() === today.toDateString() && r.estado === 'pendiente';
    }).length
  };

  const suggestions = searchTerm.trim()
    ? reminders.filter(reminder =>
        reminder.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reminder.cliente?.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 5)
    : [];

  return (
    <div className="animate-page-enter pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 text-white p-6 md:p-8 rounded-2xl shadow-soft-lg mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-3">
              <CalendarDays size={28} />
              Mi Agenda
            </h1>
            <p className="text-white/80 mt-2">Gestiona tus recordatorios y citas programadas</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Buscador con autocompletado */}
            <div className="relative w-full md:w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={16} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  placeholder="Buscar recordatorio..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Dropdown de sugerencias */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-700 rounded-lg shadow-soft-lg z-50 max-h-48 overflow-y-auto">
                  {suggestions.map((reminder) => (
                    <button
                      key={reminder.id}
                      onClick={() => handleSelectReminder(reminder)}
                      className="w-full px-3 py-2 text-left hover:bg-slate-700 transition-colors border-b border-slate-700 last:border-b-0"
                    >
                      <div className="font-medium text-slate-100 text-sm">{reminder.titulo}</div>
                      {reminder.cliente && (
                        <div className="text-xs text-slate-400">{reminder.cliente}</div>
                      )}
                    </button>
                  ))}
                </div>
              )}
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
            reminders={filteredReminders}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            onReminderClick={(reminder) => handleReminderEdit(reminder)}
          />

          {/* Lista de recordatorios */}
          <ReminderList
            reminders={filteredReminders}
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
