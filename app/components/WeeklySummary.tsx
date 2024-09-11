import React from 'react';
import { WeeklyTimesheet } from '../types';

// Component props interface
interface WeeklySummaryProps {
  timesheet: WeeklyTimesheet;
}

const WeeklySummary: React.FC<WeeklySummaryProps> = ({ timesheet }) => {
  // Helper functions
  const calculateDailyTotal = (clients: WeeklyTimesheet['schedule'][number]['clients']) => 
    clients.reduce((total, client) => total + client.fee, 0);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
  };

  // Calculate weekly total
  const weeklyTotal = timesheet.schedule.reduce(
    (total, day) => total + calculateDailyTotal(day.clients), 0
  );

  // Array of day names
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Main render
  return (
    <div className="weekly-summary mt-4">
      <h2 className="text-lg font-semibold mb-2">Weekly Summary</h2>
      <div className="space-y-2">
        {timesheet.schedule.map((day, index) => (
          <div key={day.date} className="border p-2 rounded flex justify-between items-center">
            <div>
              <div className="font-medium">{dayNames[index]}</div>
              <div className="text-sm text-gray-500">{formatDate(day.date)}</div>
            </div>
            <div className="text-right">
              <div>Clients: {day.clients.length}</div>
              <div>Total: ${calculateDailyTotal(day.clients).toFixed(2)}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 text-right font-bold">
        Week Total: ${weeklyTotal.toFixed(2)}
      </div>
    </div>
  );
};

export default WeeklySummary;