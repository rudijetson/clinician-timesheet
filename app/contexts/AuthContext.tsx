'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Therapist } from '../types';

interface AuthContextType {
  therapist: Therapist | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [therapist, setTherapist] = useState<Therapist | null>(null);

  useEffect(() => {
    console.log('AuthProvider useEffect triggered');
    // Mock therapist data
    const mockTherapist: Therapist = {
      id: '1',
      name: 'Dr. Smith',
      clients: [
        { id: '1', firstName: 'John', lastName: 'Doe', fee: 100 },
        { id: '2', firstName: 'Jane', lastName: 'Smith', fee: 120 },
        { id: '3', firstName: 'Bob', lastName: 'Johnson', fee: 90 },
      ],
    };
    console.log('Setting mock therapist:', mockTherapist);
    setTherapist(mockTherapist);
  }, []);

  console.log('AuthProvider rendering, therapist:', therapist);

  return (
    <AuthContext.Provider value={{ therapist }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    console.error('useAuth called outside of AuthProvider');
    throw new Error('useAuth must be used within an AuthProvider');
  }
  console.log('useAuth called, returning:', context);
  return context;
};