import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-blue-600 text-white p-4">
      <h1 className="text-2xl font-bold">Clinician Timesheet Playground</h1>
      <p className="text-sm">A simple platform for experimenting with timesheet submission</p>
    </header>
  );
};

export default Header;
