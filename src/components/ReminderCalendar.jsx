import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Calendar, Clock, Bell, User, MessageSquare, Phone } from "lucide-react";

export default function ReminderCalendar({ reminders, onReminderClick, selectedDate, onDateSelect }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatShortDate = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const getRemindersForDate = (date) => {
    const dateStr = formatShortDate(date);
    return reminders.filter(reminder => reminder.fecha === dateStr);
  };

  const getPriorityColor = (prioridad) => {
    switch (prioridad) {
      case 'alta': return 'bg-rose-500';
      case 'media': return 'bg-amber-500';
      case 'baja': return 'bg-emerald-500';
      default: return 'bg-slate-500';
    }
  };

  const getTypeIcon = (tipo) => {
    switch (tipo) {
      case 'cita': return Calendar;
      case 'reunion': return User;
      case 'tarea': return Clock;
      default: return Bell;
    }
  };

  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const dayReminders = getRemindersForDate(date);
      days.push({
        date,
        day: i,
        reminders: dayReminders,
        isToday: formatShortDate(date) === formatShortDate(new Date()),
        isSelected: selectedDate && formatShortDate(date) === formatShortDate(selectedDate)
      });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(newMonth.getMonth() - 1);
      } else {
        newMonth.setMonth(newMonth.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const handleDayClick = (day) => {
    if (day) {
      onDateSelect(day.date);
    }
  };

  const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigateMonth('prev')}
          className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
        >
          <ChevronLeft size={20} />
        </button>
        
        <h3 className="text-xl font-semibold text-white">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        
        <button
          onClick={() => navigateMonth('next')}
          className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Week days */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-center text-xs font-medium text-slate-500 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar days */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => (
          <div
            key={index}
            onClick={() => handleDayClick(day)}
            className={`
              relative min-h-[60px] p-1 border border-slate-800 rounded-lg cursor-pointer transition-all
              ${!day ? 'cursor-default' : 'hover:bg-slate-800 hover:border-slate-700'}
              ${day?.isToday ? 'bg-indigo-600/20 border-indigo-500/50' : ''}
              ${day?.isSelected ? 'bg-indigo-600/30 border-indigo-400' : ''}
            `}
          >
            {day && (
              <>
                <div className="text-sm text-slate-300 mb-1">
                  {day.day}
                </div>
                
                {/* Reminder indicators */}
                <div className="space-y-1">
                  {day.reminders.slice(0, 3).map((reminder, idx) => {
                    const Icon = getTypeIcon(reminder.tipo);
                    return (
                      <div
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          onReminderClick(reminder);
                        }}
                        className="flex items-center gap-1 text-xs p-1 rounded cursor-pointer hover:bg-slate-700/50"
                      >
                        <div className={`w-2 h-2 rounded-full ${getPriorityColor(reminder.prioridad)}`} />
                        <span className="text-slate-400 truncate">
                          {reminder.titulo.substring(0, 8)}...
                        </span>
                      </div>
                    );
                  })}
                  
                  {day.reminders.length > 3 && (
                    <div className="text-xs text-slate-500 pl-1">
                      +{day.reminders.length - 3} más
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-slate-800">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-rose-500" />
              <span>Alta</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Media</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Baja</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar size={12} />
            <span>Hoy</span>
          </div>
        </div>
      </div>
    </div>
  );
}
