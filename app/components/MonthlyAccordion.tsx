import React, { useState } from 'react';
import { WeeklyTimesheet } from '../types';
import WeekSchedule from './WeekSchedule';

interface MonthlyAccordionProps {
  monthlyTimesheets: {
    month: string;
    timesheets: WeeklyTimesheet[];
  }[];
  clients: Client[];
  onAddClient: (date: string, clientId: string) => void;
  onRemoveClient: (date: string, clientId: string) => void;
  onWeekEndingChange: (date: string) => void;
}

const MonthlyAccordion: React.FC<MonthlyAccordionProps> = ({
  monthlyTimesheets,
  clients,
  onAddClient,
  onRemoveClient,
  onWeekEndingChange
}) => {
  const [openMonth, setOpenMonth] = useState<string | null>(null);

  const toggleMonth = (month: string) => {
    setOpenMonth(openMonth === month ? null : month);
  };

  return (
    <div className="monthly-accordion">
      {monthlyTimesheets.map(({ month, timesheets }) => (
        <div key={month} className="mb-4">
          <button
            className="w-full text-left p-4 bg-gray-100 hover:bg-gray-200 transition-colors"
            onClick={() => toggleMonth(month)}
          >
            <h2 className="text-xl font-semibold">{month}</h2>
          </button>
          {openMonth === month && (
            <div className="mt-2 space-y-4">
              {timesheets.map((timesheet) => (
                <WeekSchedule
                  key={timesheet.weekEndingDate}
                  timesheet={timesheet}
                  clients={clients}
                  onAddClient={onAddClient}
                  onRemoveClient={onRemoveClient}
                  onWeekEndingChange={onWeekEndingChange}
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MonthlyAccordion;
