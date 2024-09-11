import React from 'react';
import { format, parseISO, eachDayOfInterval, startOfWeek, endOfWeek } from 'date-fns';
import { WeeklySchedule, Client, Clinician, ScheduledAppointment, InsuranceProvider } from '../types';

interface WeekScheduleProps {
  weeklySchedule: WeeklySchedule | null;
  clinician: Clinician;
  clients: Client[];
  insuranceProviders: InsuranceProvider[];
  onAddAppointment: (date: string, clientId: string) => void;
  onRemoveAppointment: (date: string, clientId: string) => void;
}

const WeekSchedule: React.FC<WeekScheduleProps> = ({ 
  weeklySchedule, 
  clinician,
  clients, 
  insuranceProviders,
  onAddAppointment, 
  onRemoveAppointment 
}) => {
  if (!weeklySchedule) {
    return <div>No schedule available for this week.</div>;
  }

  const weekStart = startOfWeek(parseISO(weeklySchedule.weekStartDate));
  const weekEnd = endOfWeek(weekStart);
  const daysOfWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const getAppointmentsForDay = (date: Date): ScheduledAppointment[] => {
    const dateString = format(date, 'yyyy-MM-dd');
    return weeklySchedule.appointments.filter(apt => apt.date === dateString);
  };

  const getInsuranceProviderName = (clientId: string): string => {
    const client = clients.find(c => c.id === clientId);
    if (client) {
      const provider = insuranceProviders.find(ip => ip.id === client.insuranceProviderId);
      return provider ? provider.name : 'Unknown Provider';
    }
    return 'Unknown Provider';
  };

  const renderDayCell = (date: Date) => {
    const appointments = getAppointmentsForDay(date);
    
    return (
      <div key={date.toISOString()} className="border p-2 rounded shadow-sm h-full">
        <div className="font-medium text-sm mb-1">{format(date, 'EEEE')}</div>
        <div className="text-gray-500 text-xs mb-2">{format(date, 'MM/dd')}</div>
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
                <span>{client ? `${client.firstName} ${client.lastName} (${getInsuranceProviderName(client.id)})` : 'Unknown Client'}</span>
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
        <select 
          onChange={(e) => onAddAppointment(format(date, 'yyyy-MM-dd'), e.target.value)}
          className="w-full mt-1 p-1 border rounded text-xs"
          value=""
        >
          <option value="">+ Add Client</option>
          {clients
            .filter(c => !appointments.some(apt => apt.clientId === c.id))
            .map(client => (
              <option key={client.id} value={client.id}>
                {client.firstName} {client.lastName} ({getInsuranceProviderName(client.id)})
              </option>
            ))
          }
        </select>
      </div>
    );
  };

  return (
    <div className="week-schedule">
      <h2 className="text-xl font-semibold mb-4">{clinician.name}'s Schedule</h2>
      <div className="grid grid-cols-7 gap-2">
        {daysOfWeek.map(day => renderDayCell(day))}
      </div>
    </div>
  );
};

export default WeekSchedule;