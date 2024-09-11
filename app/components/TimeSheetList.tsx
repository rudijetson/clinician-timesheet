import React from 'react';
import { Timesheet } from '../types';

interface TimesheetListProps {
  entries: Timesheet[];
  onClear: () => void;
}

const TimesheetList: React.FC<TimesheetListProps> = ({ entries, onClear }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Submitted Timesheets</h2>
      {entries.length === 0 ? (
        <p>No timesheets submitted yet.</p>
      ) : (
        <div>
          {entries.map((timesheet) => (
            <div key={timesheet.id} className="mb-6 p-4 border rounded">
              <h3 className="text-lg font-semibold">Week Ending: {timesheet.weekEndingDate}</h3>
              <ul className="mt-2">
                {timesheet.entries.map((entry, index) => (
                  <li key={index} className="mb-2 p-2 bg-gray-100 rounded">
                    <p>Client ID: {entry.clientId}</p>
                    <p>Hours Worked: {entry.hoursWorked}</p>
                    <p>Notes Complete: {entry.notesComplete ? 'Yes' : 'No'}</p>
                    <p>Comments: {entry.comments}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <button
            onClick={onClear}
            className="mt-4 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Clear All Entries
          </button>
        </div>
      )}
    </div>
  );
};

export default TimesheetList;
