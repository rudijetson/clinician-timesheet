'use client';

import { useState, useEffect } from 'react';
import { Client, InsuranceProvider } from '../types';
import { insuranceProviders } from '../data/insuranceProviders';

const dummyClients: Client[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    insuranceProvider: insuranceProviders[0],
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    insuranceProvider: insuranceProviders[1],
  },
  {
    id: '3',
    firstName: 'Bob',
    lastName: 'Johnson',
    insuranceProvider: insuranceProviders[2],
  },
];

const useClients = () => {
  const [clients, setClients] = useState<Client[]>(dummyClients);

  useEffect(() => {
    // Simulating an API call
    const fetchClients = async () => {
      setClients(dummyClients);
    };

    fetchClients();
  }, []);

  return { clients };
};

export default useClients;
