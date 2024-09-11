// Clinician type
export interface Clinician {
    id: string;
    name: string;
    specialization: string;
    hourlyRate: number;
  }
  
  // Insurance Provider type
  export interface InsuranceProvider {
    id: string;
    name: string;
    rate: number;
  }
  
  // Client type
  export interface Client {
    id: string;
    firstName: string;
    lastName: string;
    insuranceProviderId: string;
    assignedClinicianId: string;
  }
  
  // Scheduled Appointment type
  export interface ScheduledAppointment {
    clientId: string;
    date: string;
    status: 'scheduled' | 'completed' | 'cancelled';
    paymentStatus: 'unpaid' | 'paid' | 'lapse' | 'cancelled';
  }
  
  // Weekly Schedule type
  export interface WeeklySchedule {
    clinicianId: string;
    weekStartDate: string;
    appointments: ScheduledAppointment[];
  }