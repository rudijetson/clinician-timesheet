import React from 'react';
import { WeeklyTimesheet, Client } from '../types';

interface WeekScheduleProps {
  timesheet: WeeklyTimesheet;
  onAddClient: (date: string) => void;
  onRemoveClient: (date: string, clientId: string) => void;
}

const WeekSchedule: React.FC<WeekScheduleProps> = ({ timesheet, onAddClient, onRemoveClient }) => {
  return (
    <div className="week-schedule">
      <h2>Week Schedule</h2>
      <div className="grid grid-cols-7 gap-2">
        {timesheet.schedule.map((day) => (
          <div key={day.date} className="day-column">
            <h3>{new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}</h3>
            <p>{day.date}</p>
            {day.clients.map((client) => (
              <div key={client.id} className="client-entry">
                {client.firstName} {client.lastName}
                <button onClick={() => onRemoveClient(day.date, client.id)}>X</button>
              </div>
            ))}
            <button onClick={() => onAddClient(day.date)}>Add client</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeekSchedule;
