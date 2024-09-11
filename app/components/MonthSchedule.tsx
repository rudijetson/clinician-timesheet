import React from 'react';
import { startOfMonth, endOfMonth, eachDayOfInterval, format, parseISO, isSameMonth } from 'date-fns';
import { WeeklySchedule, Client, Clinician, ScheduledAppointment, InsuranceProvider } from '../types';

// Props interface
interface MonthScheduleProps {
  weeklySchedules: WeeklySchedule[];
  clinician: Clinician;
  clients: Client[];
  insuranceProviders: InsuranceProvider[];
  onAddAppointment: (date: string, clientId: string) => void;
  onRemoveAppointment: (date: string, clientId: string) => void;
  selectedMonth: string;
}

const MonthSchedule: React.FC<MonthScheduleProps> = ({ 
  weeklySchedules, 
  clinician,
  clients, 
  insuranceProviders,
  onAddAppointment, 
  onRemoveAppointment,
  selectedMonth
}) => {
  // Helper functions
  const getAppointmentsForDay = (date: Date): ScheduledAppointment[] => {
    const dateString = format(date, 'yyyy-MM-dd');
    return weeklySchedules.flatMap(schedule => 
      schedule.appointments.filter(apt => apt.date === dateString)
    );
  };

  const getInsuranceProviderName = (clientId: string): string => {
    const client = clients.find(c => c.id === clientId);
    if (client) {
      const provider = insuranceProviders.find(ip => ip.id === client.insuranceProviderId);
      return provider ? provider.name : 'Unknown Provider';
    }
    return 'Unknown Provider';
  };

  // Selected month dates
  const [year, month] = selectedMonth.split('-').map(Number);
  const monthStart = startOfMonth(new Date(year, month - 1));
  const monthEnd = endOfMonth(monthStart);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Render day cell
  const renderDayCell = (date: Date) => {
    const appointments = getAppointmentsForDay(date);
    const isCurrentMonth = isSameMonth(date, monthStart);
    
    return (
      <div key={date.toISOString()} className={`border p-2 rounded shadow-sm h-full ${isCurrentMonth ? 'bg-white' : 'bg-gray-100'}`}>
        <div className="font-medium text-sm mb-1">{format(date, 'dd')}</div>
        <div className="space-y-1 mb-2 max-h-32 overflow-y-auto">
          {appointments.map((apt) => {
            const client = clients.find(c => c.id === apt.clientId);
            return (
              <div 
                key={`${apt.clientId}-${apt.date}`} 
                className={`flex justify-between items-center p-1 rounded text-xs ${
                  apt.paymentStatus === 'paid' ? 'bg-green-100' : 
                  apt.paymentStatus === 'lapse' ? 'bg-yellow-100' : 
                  apt.paymentStatus === 'cancelled' ? 'bg-red-100' : 'bg-gray-100'
                }`}
              >
                <span>{client ? `${client.firstName} ${client.lastName.charAt(0)}.` : 'Unknown'}</span>
                <button 
                  onClick={() => onRemoveAppointment(apt.date, apt.clientId)}
                  className="text-red-500 hover:text-red-700"
                >
                  X
                </button>
              </div>
            );
          })}
        </div>
        {isCurrentMonth && (
          <select 
            onChange={(e) => onAddAppointment(format(date, 'yyyy-MM-dd'), e.target.value)}
            className="w-full mt-1 p-1 border rounded text-xs"
            value=""
          >
            <option value="">+ Add</option>
            {clients
              .filter(c => !appointments.some(apt => apt.clientId === c.id))
              .map(client => (
                <option key={client.id} value={client.id}>
                  {client.firstName} {client.lastName.charAt(0)}. ({getInsuranceProviderName(client.id)})
                </option>
              ))
            }
          </select>
        )}
      </div>
    );
  };

  // Main render
  return (
    <div className="month-schedule">
      <h2 className="text-xl font-semibold mb-4">{clinician.name}'s Schedule for {format(monthStart, 'MMMM yyyy')}</h2>
      <div className="grid grid-cols-7 gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center font-bold">{day}</div>
        ))}
        {daysInMonth.map(day => renderDayCell(day))}
      </div>
    </div>
  );
};

export default MonthSchedule;