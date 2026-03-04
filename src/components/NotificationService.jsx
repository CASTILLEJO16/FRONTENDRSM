class NotificationService {
  constructor() {
    this.notifications = [];
    this.checkInterval = null;
    this.permission = 'default';
  }

  // Solicitar permiso de notificación
  async requestPermission() {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      this.permission = permission;
      return permission === 'granted';
    }
    return false;
  }

  // Mostrar notificación del sistema
  showNotification(title, options = {}) {
    if ('Notification' in window && this.permission === 'granted') {
      return new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options
      });
    }
    
    // Fallback: mostrar alerta en la aplicación
    this.showInAppNotification(title, options.body);
  }

  // Notificación dentro de la app
  showInAppNotification(title, message) {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 z-[9999] bg-slate-900 border border-slate-700 text-white p-4 rounded-xl shadow-soft-lg max-w-sm animate-slide-in';
    notification.innerHTML = `
      <div class="flex items-start gap-3">
        <div class="flex-shrink-0">
          <div class="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
            </svg>
          </div>
        </div>
        <div class="flex-1">
          <div class="font-medium text-white">${title}</div>
          <div class="text-sm text-slate-400 mt-1">${message}</div>
        </div>
        <button onclick="this.parentElement.parentElement.remove()" class="flex-shrink-0 text-slate-400 hover:text-white">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    `;

    document.body.appendChild(notification);

    // Auto-eliminar después de 5 segundos
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 5000);
  }

  // Iniciar verificación de recordatorios
  startChecking(reminders) {
    // Limpiar intervalo anterior
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }

    // Verificar cada minuto
    this.checkInterval = setInterval(() => {
      this.checkReminders(reminders);
    }, 60000); // 1 minuto

    // Verificar inmediatamente
    this.checkReminders(reminders);
  }

  // Detener verificación
  stopChecking() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  // Verificar recordatorios pendientes
  checkReminders(reminders) {
    const now = new Date();
    
    reminders.forEach(reminder => {
      if (reminder.estado !== 'pendiente' || !reminder.recordatorio) {
        return;
      }

      const reminderDateTime = new Date(reminder.fecha + 'T' + reminder.hora);
      
      // Verificar si es hora del recordatorio (con tolerancia de 1 minuto)
      const timeDiff = Math.abs(now - reminderDateTime);
      const isTime = timeDiff <= 60000; // 1 minuto

      if (isTime) {
        this.showReminderNotification(reminder);
      }
    });
  }

  // Mostrar notificación de recordatorio
  showReminderNotification(reminder) {
    const title = `📅 Recordatorio: ${reminder.titulo}`;
    const message = reminder.descripcion || reminder.titulo;
    
    // Notificación del sistema
    this.showNotification(title, {
      body: message,
      tag: reminder.id,
      requireInteraction: true,
      actions: [
        {
          action: 'complete',
          title: 'Completar'
        },
        {
          action: 'snooze',
          title: 'Posponer'
        }
      ]
    });

    // Marcar como notificado
    reminder.notificado = true;
    reminder.estado = 'notificado';
  }

  // Programar recordatorio específico
  scheduleReminder(reminder) {
    const reminderDateTime = new Date(reminder.fecha + 'T' + reminder.hora);
    const now = new Date();
    const timeUntilReminder = reminderDateTime - now;

    if (timeUntilReminder > 0 && reminder.recordatorio) {
      setTimeout(() => {
        this.showReminderNotification(reminder);
      }, timeUntilReminder);
    }
  }

  // Obtener recordatorios del localStorage con clave de usuario
  getStoredReminders(userKey = 'reminders') {
    try {
      const stored = localStorage.getItem(userKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error al obtener recordatorios:', error);
      return [];
    }
  }

  // Guardar recordatorios en localStorage con clave de usuario
  saveReminders(reminders, userKey = 'reminders') {
    try {
      localStorage.setItem(userKey, JSON.stringify(reminders));
    } catch (error) {
      console.error('Error al guardar recordatorios:', error);
    }
  }

  // Agregar nuevo recordatorio
  addReminder(reminder, userKey = 'reminders') {
    const reminders = this.getStoredReminders(userKey);
    reminders.push(reminder);
    this.saveReminders(reminders, userKey);
    this.scheduleReminder(reminder);
    return reminder;
  }

  // Actualizar recordatorio
  updateReminder(updatedReminder, userKey = 'reminders') {
    const reminders = this.getStoredReminders(userKey);
    const index = reminders.findIndex(r => r.id === updatedReminder.id);
    
    if (index !== -1) {
      reminders[index] = updatedReminder;
      this.saveReminders(reminders, userKey);
      this.scheduleReminder(updatedReminder);
    }
    
    return updatedReminder;
  }

  // Eliminar recordatorio
  deleteReminder(reminderId, userKey = 'reminders') {
    const reminders = this.getStoredReminders(userKey);
    const filtered = reminders.filter(r => r.id !== reminderId);
    this.saveReminders(filtered, userKey);
    return filtered;
  }

  // Marcar como completado
  completeReminder(reminderId, userKey = 'reminders') {
    const reminders = this.getStoredReminders(userKey);
    const reminder = reminders.find(r => r.id === reminderId);
    
    if (reminder) {
      reminder.estado = 'completado';
      reminder.fechaCompletado = new Date().toISOString();
      this.saveReminders(reminders, userKey);
    }
    
    return reminder;
  }
}

// Exportar instancia única
export const notificationService = new NotificationService();
