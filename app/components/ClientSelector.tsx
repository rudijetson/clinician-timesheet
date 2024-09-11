import React from 'react';
import { Client } from '../types';

interface ClientSelectorProps {
  clients: Client[];
  selectedClient: Client | null;
  onClientSelect: (client: Client) => void;
}

const ClientSelector: React.FC<ClientSelectorProps> = ({
  clients,
  selectedClient,
  onClientSelect,
}) => {
  const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const clientId = e.target.value;
    const client = clients.find((c) => c.id === clientId);
    if (client) {
      onClientSelect(client);
    }
  };

  return (
    <div className="client-selector">
      <label htmlFor="clientSelect">Select Client:</label>
      <select
        id="clientSelect"
        value={selectedClient?.id || ''}
        onChange={handleClientChange}
      >
        <option value="">-- Select a client --</option>
        {clients.map((client) => (
          <option key={client.id} value={client.id}>
            {`${client.firstName} ${client.lastName}`}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ClientSelector;
