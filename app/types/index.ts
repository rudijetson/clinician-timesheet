export interface Clinician {
    id: string;
    name: string;
    specialization: string;
    hourlyRate: number;
  }
  
  export interface Client {
    id: string;
    firstName: string;
    lastName: string;
    insuranceProviderId: string;
    assignedClinicianId: string;
  }
  
  export interface InsuranceProvider {
    name: string;
    rate: number;
  }
  
  export interface ScheduledAppointment {
    clientId: string;
    date: string;
    status: 'scheduled' | 'completed' | 'cancelled';
    paymentStatus: 'unpaid' | 'paid' | 'lapse' | 'cancelled';
  }
  
  export interface WeeklySchedule {
    clinicianId: string;
    weekStartDate: string;
    appointments: ScheduledAppointment[];
  }
  
  export interface DailySchedule {
    date: string;
    appointments: ScheduledAppointment[];
  }