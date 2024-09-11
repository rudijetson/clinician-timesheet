import React from 'react';
import { WeeklyTimesheet, ClientAppointment } from '../types';

interface FinancialReportProps {
  timesheets: Record<string, WeeklyTimesheet[]>;
}

const FinancialReport: React.FC<FinancialReportProps> = ({ timesheets }) => {
  const calculateMonthlyRevenue = () => {
    const monthlyRevenue: Record<string, number> = {};

    Object.entries(timesheets).forEach(([month, sheets]) => {
      monthlyRevenue[month] = sheets.reduce((monthTotal, sheet) => {
        return monthTotal + sheet.schedule.reduce((weekTotal, day) => {
          return weekTotal + day.clients.reduce((dayTotal, client) => {
            return dayTotal + (client as ClientAppointment).dailyRate;
          }, 0);
        }, 0);
      }, 0);
    });

    return monthlyRevenue;
  };

  const calculateTotalRevenue = (monthlyRevenue: Record<string, number>) => {
    return Object.values(monthlyRevenue).reduce((total, amount) => total + amount, 0);
  };

  const monthlyRevenue = calculateMonthlyRevenue();
  const totalRevenue = calculateTotalRevenue(monthlyRevenue);

  return (
    <div className="financial-report">
      <h2 className="text-2xl font-bold mb-4">Financial Report</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(monthlyRevenue).map(([month, revenue]) => (
          <div key={month} className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold">{month}</h3>
            <p className="text-2xl font-bold text-green-600">${revenue.toFixed(2)}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 bg-gray-100 p-4 rounded shadow">
        <h3 className="text-xl font-semibold">Total Revenue</h3>
        <p className="text-3xl font-bold text-green-600">${totalRevenue.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default FinancialReport;