'use client';

import { useState, useEffect } from 'react';
import { Clinician } from '../types';
import { insuranceProviders } from '../data/insuranceProviders';

const dummyClinicians: Clinician[] = [
  {
    id: '1',
    name: 'Dr. Alice Johnson',
    clients: [
      { id: '1', firstName: 'John', lastName: 'Doe', insuranceProvider: insuranceProviders[0] },
      { id: '2', firstName: 'Jane', lastName: 'Smith', insuranceProvider: insuranceProviders[1] },
    ],
  },
  {
    id: '2',
    name: 'Dr. Bob Williams',
    clients: [
      { id: '3', firstName: 'Emily', lastName: 'Brown', insuranceProvider: insuranceProviders[2] },
      { id: '4', firstName: 'Michael', lastName: 'Davis', insuranceProvider: insuranceProviders[3] },
    ],
  },
];

const useClinicians = () => {
  const [clinicians, setClinicians] = useState<Clinician[]>(dummyClinicians);
  const [selectedClinician, setSelectedClinician] = useState<Clinician | null>(null);

  useEffect(() => {
    // Simulating an API call
    const fetchClinicians = async () => {
      setClinicians(dummyClinicians);
      setSelectedClinician(dummyClinicians[0]); // Default to first clinician
    };

    fetchClinicians();
  }, []);

  return { clinicians, selectedClinician, setSelectedClinician };
};

export default useClinicians;
