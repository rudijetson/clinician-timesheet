import React from 'react';
import { InsuranceProvider } from '../types';

interface InsuranceDisplayProps {
  insuranceProvider?: InsuranceProvider;
}

const InsuranceDisplay: React.FC<InsuranceDisplayProps> = ({ insuranceProvider }) => {
  if (!insuranceProvider) {
    return <div className="insurance-display">No insurance provider information available.</div>;
  }

  return (
    <div className="insurance-display">
      <p>Insurance Provider: {insuranceProvider.name}</p>
      <p>Rate: ${insuranceProvider.rate}/hour</p>
    </div>
  );
};

export default InsuranceDisplay;
