
export interface User {
  name: string;
  email: string;
  avatarUrl: string;
}

export interface Appointment {
  id: string;
  title: string;
  date: string; // ISO string format
  attendees: string[];
  category: 'Work' | 'Personal' | 'Health' | 'Other';
  description?: string;
}

export interface ChatMessage {
  id:string;
  text: string;
  sender: 'user' | 'ai';
}

export interface AppointmentDetails {
    title?: string;
    date?: string;
    time?: string;
    attendees?: string[];
    isReadyToSchedule?: boolean;
    clarificationQuestion?: string;
}