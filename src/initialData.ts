import { Business, Staff, Client, Package, Booking, Payment, Service } from './types';

export const DEFAULT_BUSINESS: Business = {
  id: "biz-1",
  name: "Book App",
  type: "salon",
  ownerName: "Rajesh Sharma",
  phone: "9876543210",
  upiId: "9876543210@okaxis"
};

export const DEFAULT_STAFF: Staff[] = [
  {
    id: "staff-1",
    name: "Rajesh Sharma",
    role: "Owner / Master Stylist",
    workingHours: { start: "08:00", end: "21:00" },
    color: "bg-indigo-100 text-indigo-800 border-indigo-200",
    businessId: "biz-1"
  },
  {
    id: "staff-2",
    name: "Neha Gupta",
    role: "Senior Stylist",
    workingHours: { start: "09:00", end: "20:00" },
    color: "bg-emerald-100 text-emerald-800 border-emerald-200",
    businessId: "biz-1"
  },
  {
    id: "staff-3",
    name: "Vikram Malhotra",
    role: "Therapist & Skincare Expert",
    workingHours: { start: "10:00", end: "19:00" },
    color: "bg-amber-100 text-amber-800 border-amber-200",
    businessId: "biz-1"
  }
];

export const DEFAULT_SERVICES: Service[] = [
  // Salon
  { name: "Haircut & Styling (Men)", price: 450, durationMinutes: 30, category: "Hair" },
  { name: "Haircut & Blowdry (Women)", price: 1200, durationMinutes: 60, category: "Hair" },
  { name: "Global Hair Coloring", price: 3500, durationMinutes: 120, category: "Hair" },
  { name: "Premium Keratin Treatment", price: 6000, durationMinutes: 150, category: "Hair" },
  { name: "Beard Styling & Grooming", price: 250, durationMinutes: 20, category: "Hair" },
  // Spa
  { name: "Swedish Massage (60 min)", price: 2200, durationMinutes: 60, category: "Spa" },
  { name: "Deep Tissue Massage (90 min)", price: 3000, durationMinutes: 90, category: "Spa" },
  { name: "De-tan Facial Treatment", price: 1500, durationMinutes: 45, category: "Skin" },
  { name: "HydraFacial Glow", price: 4500, durationMinutes: 75, category: "Skin" },
  // Gym / Physio
  { name: "Personal Training Session", price: 1200, durationMinutes: 60, category: "Fitness" },
  { name: "Physiotherapy Consultation", price: 800, durationMinutes: 45, category: "Therapy" },
  { name: "Sports Rehabilitation", price: 1500, durationMinutes: 60, category: "Therapy" }
];

export const DEFAULT_CLIENTS: Client[] = [
  {
    id: "client-1",
    name: "Aarav Mehta",
    phone: "9820012345",
    notes: "Prefers light hold hair wax, regular client.",
    createdDate: "2026-07-01",
    birthday: "1995-04-12",
    businessId: "biz-1"
  },
  {
    id: "client-2",
    name: "Priya Patel",
    phone: "9876543210",
    notes: "Sensitive skin, always schedules evening skincare.",
    createdDate: "2026-07-03",
    birthday: "1992-11-20",
    businessId: "biz-1"
  },
  {
    id: "client-3",
    name: "Amit Sharma",
    phone: "9930098765",
    notes: "Requires deep shoulder work during massages.",
    createdDate: "2026-07-05",
    birthday: "1988-08-15",
    businessId: "biz-1"
  },
  {
    id: "client-4",
    name: "Ananya Iyer",
    phone: "9123456789",
    notes: "Regular global hair coloring, uses organic shampoo.",
    createdDate: "2026-07-10",
    birthday: "1998-01-30",
    businessId: "biz-1"
  },
  {
    id: "client-5",
    name: "Rohan Das",
    phone: "9811122233",
    notes: "Interested in premium packages.",
    createdDate: "2026-07-15",
    birthday: "1990-06-25",
    businessId: "biz-1"
  }
];

export const DEFAULT_PACKAGES: Package[] = [
  {
    id: "pkg-1",
    name: "Skincare Glow Package (5 Sessions)",
    clientPhone: "9876543210",
    totalSessions: 5,
    sessionsRemaining: 4,
    price: 18000,
    createdDate: "2026-07-05",
    expiryDate: "2026-10-05",
    businessId: "biz-1"
  }
];

export const DEFAULT_BOOKINGS: Booking[] = [
  {
    id: "booking-1",
    clientPhone: "9820012345",
    clientName: "Aarav Mehta",
    staffId: "staff-2",
    serviceName: "Haircut & Styling (Men)",
    dateTime: "2026-07-20T09:30",
    durationMinutes: 30,
    status: "completed",
    price: 450,
    businessId: "biz-1"
  },
  {
    id: "booking-2",
    clientPhone: "9876543210",
    clientName: "Priya Patel",
    staffId: "staff-1",
    serviceName: "HydraFacial Glow",
    dateTime: "2026-07-20T11:00",
    durationMinutes: 75,
    status: "confirmed",
    price: 4500,
    businessId: "biz-1"
  },
  {
    id: "booking-3",
    clientPhone: "9811122233",
    clientName: "Rohan Das",
    staffId: "staff-3",
    serviceName: "Deep Tissue Massage (90 min)",
    dateTime: "2026-07-20T15:00",
    durationMinutes: 90,
    status: "completed",
    price: 3000,
    businessId: "biz-1"
  }
];

export const DEFAULT_PAYMENTS: Payment[] = [
  {
    id: "pay-1",
    clientPhone: "9820012345",
    clientName: "Aarav Mehta",
    amount: 450,
    method: "upi",
    date: "2026-07-20",
    type: "booking",
    linkedBookingId: "booking-1",
    status: "paid",
    businessId: "biz-1"
  },
  {
    id: "pay-2",
    clientPhone: "9876543210",
    clientName: "Priya Patel",
    amount: 4500,
    method: "upi",
    date: "2026-07-20",
    type: "booking",
    linkedBookingId: "booking-2",
    status: "paid",
    businessId: "biz-1"
  },
  {
    id: "pay-3",
    clientPhone: "9811122233",
    clientName: "Rohan Das",
    amount: 3000,
    method: "upi",
    date: "2026-07-20",
    type: "booking",
    linkedBookingId: "booking-3",
    status: "paid",
    businessId: "biz-1"
  }
];

// Default UPI & Payment notifications
export const DEFAULT_LIVE_FEED = [
  {
    id: "tx-upi-101",
    timestamp: "2026-07-20T08:15:00.000Z",
    clientName: "Aarav Mehta",
    amount: 450,
    method: "upi",
    type: "upi_payment_received"
  },
  {
    id: "tx-upi-102",
    timestamp: "2026-07-20T08:10:00.000Z",
    clientName: "Rohan Das",
    amount: 3000,
    method: "upi",
    type: "upi_payment_received"
  },
  {
    id: "tx-manual-103",
    timestamp: "2026-07-20T08:05:00.000Z",
    clientName: "Amit Sharma",
    amount: 1500,
    method: "cash",
    type: "manual_settlement"
  }
];
