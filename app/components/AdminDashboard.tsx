import React, { useState } from 'react';
import { Clinician, Client, WeeklySchedule, ScheduledAppointment, InsuranceProvider } from '../types';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isWithinInterval } from 'date-fns';

// Props interface
interface AdminDashboardProps {
  clinicians: Clinician[];
  clients: Client[];
  insuranceProviders: InsuranceProvider[];
  weeklySchedules: WeeklySchedule[];
  onUpdatePaymentStatus: (clinicianId: string, date: string, clientId: string, status: ScheduledAppointment['paymentStatus']) => void;
  selectedMonth: string;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  clinicians, 
  clients, 
  insuranceProviders,
  weeklySchedules, 
  onUpdatePaymentStatus,
  selectedMonth
}) => {
  // State for selected clinician
  const [selectedClinicianId, setSelectedClinicianId] = useState<string>(clinicians[0]?.id || '');

  // Helper functions
  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client ? `${client.firstName} ${client.lastName}` : 'Unknown Client';
  };

  const getInsuranceProviderName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    if (client) {
      const provider = insuranceProviders.find(ip => ip.id === client.insuranceProviderId);
      return provider ? provider.name : 'Unknown Provider';
    }
    return 'Unknown Provider';
  };

  // Get selected clinician's schedules
  const selectedSchedules = weeklySchedules.filter(schedule => schedule.clinicianId === selectedClinicianId);

  // Get all appointments for the selected month
  const [year, month] = selectedMonth.split('-').map(Number);
  const monthStart = startOfMonth(new Date(year, month - 1));
  const monthEnd = endOfMonth(monthStart);
  
  const allAppointments = selectedSchedules.flatMap(schedule => 
    schedule.appointments.filter(apt => {
      const aptDate = parseISO(apt.date);
      return isWithinInterval(aptDate, { start: monthStart, end: monthEnd });
    })
  );

  // Render function
  return (
    <div className="admin-dashboard">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>

      {/* Clinician selector */}
      <div className="mb-4">
        <label htmlFor="clinicianSelect" className="block text-sm font-medium text-gray-700">Select Clinician:</label>
        <select
          id="clinicianSelect"
          value={selectedClinicianId}
          onChange={(e) => setSelectedClinicianId(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          {clinicians.map((clinician) => (
            <option key={clinician.id} value={clinician.id}>{clinician.name}</option>
          ))}
        </select>
      </div>

      {/* Appointments table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Insurance Provider</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {allAppointments.map((appointment, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(parseISO(appointment.date), 'MMM dd, yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {getClientName(appointment.clientId)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {getInsuranceProviderName(appointment.clientId)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {appointment.status}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {appointment.paymentStatus}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <select
                    value={appointment.paymentStatus}
                    onChange={(e) => onUpdatePaymentStatus(
                      selectedClinicianId, 
                      appointment.date, 
                      appointment.clientId, 
                      e.target.value as ScheduledAppointment['paymentStatus']
                    )}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    <option value="unpaid">Unpaid</option>
                    <option value="paid">Paid</option>
                    <option value="lapse">Lapse</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* No appointments message */}
      {allAppointments.length === 0 && (
        <p className="text-center text-gray-500 mt-4">No appointments for the selected month and clinician.</p>
      )}
    </div>
  );
};

export default AdminDashboard;