'use client';

import React, { useState } from 'react';
import { Client, Timesheet, TimesheetEntry } from '../types';
import ClientSelector from './ClientSelector';
import InsuranceDisplay from './InsuranceDisplay';

interface TimesheetFormProps {
  onSubmit: (timesheet: Timesheet) => void;
  clients: Client[];
  clinicianId: string;
}

const TimesheetForm: React.FC<TimesheetFormProps> = ({ onSubmit, clients, clinicianId }) => {
  const [weekEndingDate, setWeekEndingDate] = useState('');
  const [entries, setEntries] = useState<TimesheetEntry[]>([]);

  const handleAddEntry = (entry: TimesheetEntry) => {
    setEntries([...entries, entry]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTimesheet: Timesheet = {
      id: Date.now().toString(),
      clinicianId,
      weekEndingDate,
      entries,
    };
    onSubmit(newTimesheet);
    // Reset form
    setWeekEndingDate('');
    setEntries([]);
  };

  return (
    <form onSubmit={handleSubmit} className="timesheet-form">
      <div>
        <label htmlFor="weekEndingDate">Week Ending Date:</label>
        <input
          type="date"
          id="weekEndingDate"
          value={weekEndingDate}
          onChange={(e) => setWeekEndingDate(e.target.value)}
          required
        />
      </div>
      {entries.map((entry, index) => (
        <div key={index} className="mb-4 p-4 border rounded">
          <p>Client: {clients.find(c => c.id === entry.clientId)?.firstName} {clients.find(c => c.id === entry.clientId)?.lastName}</p>
          <p>Hours: {entry.hoursWorked}</p>
          <p>Notes Complete: {entry.notesComplete ? 'Yes' : 'No'}</p>
          <p>Comments: {entry.comments}</p>
        </div>
      ))}
      <EntryForm clients={clients} onAddEntry={handleAddEntry} />
      <button type="submit" disabled={entries.length === 0 || !weekEndingDate}>Submit Timesheet</button>
    </form>
  );
};

interface EntryFormProps {
  clients: Client[];
  onAddEntry: (entry: TimesheetEntry) => void;
}

const EntryForm: React.FC<EntryFormProps> = ({ clients, onAddEntry }) => {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [hoursWorked, setHoursWorked] = useState('');
  const [notesComplete, setNotesComplete] = useState(false);
  const [comments, setComments] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedClient) {
      onAddEntry({
        clientId: selectedClient.id,
        hoursWorked: parseFloat(hoursWorked),
        notesComplete,
        comments,
      });
      setSelectedClient(null);
      setHoursWorked('');
      setNotesComplete(false);
      setComments('');
    }
  };

  return (
    <div className="entry-form mb-4 p-4 border rounded">
      <ClientSelector
        clients={clients}
        selectedClient={selectedClient}
        onClientSelect={setSelectedClient}
      />
      {selectedClient && (
        <InsuranceDisplay insuranceProvider={selectedClient.insuranceProvider} />
      )}
      <div className="mb-2">
        <label htmlFor="hoursWorked">Hours Worked:</label>
        <input
          type="number"
          id="hoursWorked"
          value={hoursWorked}
          onChange={(e) => setHoursWorked(e.target.value)}
          placeholder="Hours worked"
          step="0.5"
          min="0"
          required
        />
      </div>
      <div className="mb-2">
        <label>
          <input
            type="checkbox"
            checked={notesComplete}
            onChange={(e) => setNotesComplete(e.target.checked)}
          />
          Notes Complete
        </label>
      </div>
      <div className="mb-2">
        <label htmlFor="comments">Comments:</label>
        <textarea
          id="comments"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          placeholder="Enter any comments here"
        />
      </div>
      <button type="button" onClick={handleSubmit} disabled={!selectedClient || !hoursWorked}>Add Entry</button>
    </div>
  );
};

export default TimesheetForm;
