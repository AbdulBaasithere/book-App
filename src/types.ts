export type BusinessType = string;

export interface Business {
  id: string;
  name: string;
  type: BusinessType;
  ownerName: string;
  phone: string;
  upiId?: string;
}

export interface Staff {
  id: string;
  name: string;
  role: string;
  workingHours: {
    start: string; // "HH:MM" format
    end: string;   // "HH:MM" format
  };
  color: string; // Tailwind color class or hex (e.g. "bg-teal-100 text-teal-800")
  businessId?: string;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  notes: string;
  createdDate: string;
  birthday?: string; // "YYYY-MM-DD" or "MM-DD" format
  businessId?: string;
}

export interface Package {
  id: string;
  name: string;
  clientPhone: string;
  totalSessions: number;
  sessionsRemaining: number;
  price: number;
  expiryDate: string; // "YYYY-MM-DD"
  createdDate: string; // "YYYY-MM-DD"
  businessId?: string;
}

export interface Booking {
  id: string;
  clientPhone: string;
  clientName: string;
  staffId: string;
  serviceName: string;
  dateTime: string; // ISO String or "YYYY-MM-DDTHH:MM"
  durationMinutes: number;
  status: 'confirmed' | 'completed' | 'no-show' | 'cancelled';
  notes?: string;
  linkedPackageId?: string; // If this booking decrements a package
  price: number;
  businessId?: string;
}

export interface Payment {
  id: string;
  clientPhone: string;
  clientName: string;
  amount: number;
  method: 'cash' | 'upi' | 'card';
  date: string; // ISO date or "YYYY-MM-DD"
  type: 'booking' | 'package_purchase' | 'manual_settlement';
  linkedBookingId?: string;
  linkedPackageId?: string;
  status: 'paid' | 'due';
  businessId?: string;
}

export interface Service {
  name: string;
  price: number;
  durationMinutes: number;
  category: string;
}
