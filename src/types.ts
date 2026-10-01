export interface Shift {
  id: string;
  location: string;
  color: string;
  date: string; // ISO yyyy-mm-dd
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  value: number; // R$
  paymentDate?: string; // ISO yyyy-mm-dd
  paid: boolean;
  notes?: string;
  createdAt: number;
  updatedAt: number;
}

export interface ShiftTemplate {
  id: string;
  name: string;
  location: string;
  color: string;
  startTime: string;
  endTime: string;
  value: number;
  notes?: string;
}

export interface Settings {
  theme: 'light' | 'dark';
  defaultColor: string;
}

export interface AppData {
  shifts: Shift[];
  templates: ShiftTemplate[];
  settings: Settings;
}

export interface PinHashData {
  salt: string;
  iv: string;
  verifier: string;
}

export interface PinAttempts {
  count: number;
  lockedUntil: number;
}

export const PRESET_COLORS = [
  '#0d9488', // teal-600
  '#2563eb', // blue-600
  '#dc2626', // red-600
  '#ea580c', // orange-600
  '#ca8a04', // yellow-600
  '#16a34a', // green-600
  '#9333ea', // purple-600
  '#db2777', // pink-600
  '#0891b2', // cyan-600
  '#4b5563', // gray-600
];
