import React, { useState, useContext, useEffect } from "react";
import { Calendar, Clock, MessageSquare, Phone, User, X, Save } from "lucide-react";
import { AppContext } from "../context/AppContext";

export default function ReminderForm({ clients, onReminderCreated, onReminderUpdated, reminder, onClose }) {
  const { showAlert } = useContext(AppContext);
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    clienteId: "",
    tipo: "seguimiento",
    fecha: "",
    hora: "",
    prioridad: "media",
    recordatorio: true
  });

  const tiposRecordatorio = [
    { value: "seguimiento", label: "Seguimiento", icon: MessageSquare, color: "blue" },
    { value: "llamada", label: "Llamada", icon: Phone, color: "green" },
    { value: "visita", label: "Visita", icon: Calendar, color: "purple" },
    { value: "general", label: "General", icon: User, color: "gray" }
  ];

  // Cargar datos si está editando
  useEffect(() => {
    if (reminder) {
      setFormData({
        titulo: reminder.titulo || "",
        descripcion: reminder.descripcion || "",
        clienteId: reminder.clienteId || "",
        tipo: reminder.tipo || "seguimiento",
        fecha: reminder.fecha || "",
        hora: reminder.hora || "",
        prioridad: reminder.prioridad || "media",
        recordatorio: reminder.recordatorio !== false
      });
    }
  }, [reminder]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.titulo || !formData.fecha || !formData.hora) {
      showAlert("error", "Por favor completa los campos obligatorios");
      return;
    }

    const reminderData = {
      ...formData,
      id: reminder?.id || Date.now().toString(),
      fechaCreacion: reminder?.fechaCreacion || new Date().toISOString(),
      estado: reminder?.estado || "pendiente",
      clienteNombre: clients.find(c => c._id === formData.clienteId)?.nombre || "Sin cliente"
    };

    if (reminder) {
      onReminderUpdated(reminderData);
      showAlert("success", "Recordatorio actualizado correctamente");
    } else {
      onReminderCreated(reminderData);
      showAlert("success", "Recordatorio creado correctamente");
    }
    
    onClose();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Obtener fecha mínima (hoy)
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-slate-900 rounded-2xl border border-slate-700/50 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white flex items-center gap-3">
            <Calendar className="text-indigo-400" size={20} />
            {reminder ? "Editar Recordatorio" : "Nuevo Recordatorio"}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Título del recordatorio *
            </label>
            <input
              type="text"
              name="titulo"
              value={formData.titulo}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Ej: Seguimiento de venta"
              required
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Descripción
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              placeholder="Detalles adicionales del recordatorio..."
            />
          </div>

          {/* Cliente */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Cliente (opcional)
            </label>
            <select
              name="clienteId"
              value={formData.clienteId}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">Seleccionar cliente...</option>
              {clients?.map(cliente => (
                <option key={cliente._id} value={cliente._id}>
                  {cliente.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Tipo de recordatorio */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Tipo de recordatorio
            </label>
            <div className="grid grid-cols-2 gap-2">
              {tiposRecordatorio.map(tipo => {
                const Icon = tipo.icon;
                return (
                  <button
                    key={tipo.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, tipo: tipo.value }))}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
                      formData.tipo === tipo.value
                        ? `bg-${tipo.color}-600/20 border-${tipo.color}-500/50 text-${tipo.color}-400`
                        : 'bg-slate-800 border-slate-600 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    <Icon size={16} />
                    <span className="text-sm">{tipo.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Fecha y Hora */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Fecha *
              </label>
              <input
                type="date"
                name="fecha"
                value={formData.fecha}
                onChange={handleInputChange}
                min={today}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Hora *
              </label>
              <input
                type="time"
                name="hora"
                value={formData.hora}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Prioridad */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Prioridad
            </label>
            <div className="grid grid-cols-3 gap-2">
              {["baja", "media", "alta"].map(prioridad => (
                <button
                  key={prioridad}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, prioridad }))}
                  className={`px-3 py-2 rounded-lg border transition-all capitalize ${
                    formData.prioridad === prioridad
                      ? prioridad === 'alta'
                        ? 'bg-rose-600/20 border-rose-500/50 text-rose-400'
                        : prioridad === 'media'
                          ? 'bg-amber-600/20 border-amber-500/50 text-amber-400'
                          : 'bg-emerald-600/20 border-emerald-500/50 text-emerald-400'
                      : 'bg-slate-800 border-slate-600 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {prioridad}
                </button>
              ))}
            </div>
          </div>

          {/* Notificación */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="recordatorio"
              name="recordatorio"
              checked={formData.recordatorio}
              onChange={(e) => setFormData(prev => ({ ...prev, recordatorio: e.target.checked }))}
              className="w-4 h-4 text-indigo-600 bg-slate-800 border-slate-600 rounded focus:ring-indigo-500 focus:ring-2"
            />
            <label htmlFor="recordatorio" className="text-sm text-slate-300">
              Enviar notificación en la fecha y hora programadas
            </label>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 border border-slate-600/50 rounded-xl transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <Save size={16} />
              {reminder ? "Actualizar" : "Guardar"} Recordatorio
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
