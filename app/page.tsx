'use client';

import React, { useState, useEffect } from 'react';
import MonthSchedule from './components/MonthSchedule';
import AdminDashboard from './components/AdminDashboard';
import { Clinician, Client, WeeklySchedule, InsuranceProvider } from './types';
import { clinicians } from './data/clinicians';
import { clients } from './data/clients';
import { insuranceProviders } from './data/insuranceProviders';
import { eachWeekOfInterval, startOfMonth, endOfMonth, format, addMonths } from 'date-fns';

// Helper function to generate month options
const generateMonthOptions = () => {
  const options = [];
  for (let i = 0; i < 12; i++) {
    const date = addMonths(new Date(2024, 0, 1), i);
    options.push({
      value: format(date, 'yyyy-MM'),
      label: format(date, 'MMMM yyyy')
    });
  }
  return options;
};

export default function Home() {
  // State declarations
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedClinicianId, setSelectedClinicianId] = useState<string>('');
  const [weeklySchedules, setWeeklySchedules] = useState<WeeklySchedule[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>(format(new Date(), 'yyyy-MM'));

  // Initialize schedules for the selected month
  useEffect(() => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const monthStart = startOfMonth(new Date(year, month - 1));
    const monthEnd = endOfMonth(monthStart);
    const weeksInMonth = eachWeekOfInterval({
      start: monthStart,
      end: monthEnd,
    });

    const initialSchedules = clinicians.flatMap(clinician => 
      weeksInMonth.map(weekStart => ({
        clinicianId: clinician.id,
        weekStartDate: format(weekStart, 'yyyy-MM-dd'),
        appointments: []
      }))
    );

    setWeeklySchedules(initialSchedules);
    if (clinicians.length > 0) {
      setSelectedClinicianId(clinicians[0].id);
    }
  }, [selectedMonth]);

  // Handler for adding an appointment
  const handleAddAppointment = (clinicianId: string, date: string, clientId: string) => {
    setWeeklySchedules(prevSchedules => 
      prevSchedules.map(schedule => 
        schedule.clinicianId === clinicianId && 
        new Date(schedule.weekStartDate) <= new Date(date) && 
        new Date(schedule.weekStartDate).setDate(new Date(schedule.weekStartDate).getDate() + 6) >= new Date(date)
          ? {
              ...schedule,
              appointments: [
                ...schedule.appointments,
                { clientId, date, status: 'scheduled', paymentStatus: 'unpaid' }
              ]
            }
          : schedule
      )
    );
  };

  // Handler for removing an appointment
  const handleRemoveAppointment = (clinicianId: string, date: string, clientId: string) => {
    setWeeklySchedules(prevSchedules => 
      prevSchedules.map(schedule => 
        schedule.clinicianId === clinicianId
          ? {
              ...schedule,
              appointments: schedule.appointments.filter(
                apt => !(apt.date === date && apt.clientId === clientId)
              )
            }
          : schedule
      )
    );
  };

  // Handler for updating payment status
  const handleUpdatePaymentStatus = (clinicianId: string, date: string, clientId: string, status: 'unpaid' | 'paid' | 'lapse' | 'cancelled') => {
    setWeeklySchedules(prevSchedules => 
      prevSchedules.map(schedule => 
        schedule.clinicianId === clinicianId
          ? {
              ...schedule,
              appointments: schedule.appointments.map(apt => 
                apt.date === date && apt.clientId === clientId
                  ? { ...apt, paymentStatus: status }
                  : apt
              )
            }
          : schedule
      )
    );
  };

  // Handler for changing selected clinician
  const handleClinicianChange = (clinicianId: string) => {
    setSelectedClinicianId(clinicianId);
  };

  // Render
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Clinician Timesheet System</h1>
      <div className="mb-4">
        <button
          onClick={() => setIsAdmin(!isAdmin)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Switch to {isAdmin ? 'Clinician' : 'Admin'} View
        </button>
      </div>
      <div className="mb-4">
        <label htmlFor="monthSelect" className="block text-sm font-medium text-gray-700">Select Month:</label>
        <select
          id="monthSelect"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          {generateMonthOptions().map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>
      {isAdmin ? (
        <AdminDashboard 
          clinicians={clinicians}
          clients={clients}
          insuranceProviders={insuranceProviders}
          weeklySchedules={weeklySchedules}
          onUpdatePaymentStatus={handleUpdatePaymentStatus}
          selectedMonth={selectedMonth}
        />
      ) : (
        <>
          {/* Clinician selector */}
          <div className="mb-4">
            <label htmlFor="clinicianSelect" className="block text-sm font-medium text-gray-700">Select Clinician:</label>
            <select
              id="clinicianSelect"
              value={selectedClinicianId}
              onChange={(e) => handleClinicianChange(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              {clinicians.map((clinician) => (
                <option key={clinician.id} value={clinician.id}>{clinician.name}</option>
              ))}
            </select>
          </div>
          <MonthSchedule
            weeklySchedules={weeklySchedules.filter(schedule => schedule.clinicianId === selectedClinicianId)}
            clinician={clinicians.find(c => c.id === selectedClinicianId) || clinicians[0]}
            clients={clients.filter(client => client.assignedClinicianId === selectedClinicianId)}
            insuranceProviders={insuranceProviders}
            onAddAppointment={(date, clientId) => handleAddAppointment(selectedClinicianId, date, clientId)}
            onRemoveAppointment={(date, clientId) => handleRemoveAppointment(selectedClinicianId, date, clientId)}
            selectedMonth={selectedMonth}
          />
        </>
      )}
    </main>
  );
}