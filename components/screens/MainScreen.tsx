import React, { useState, useCallback, useEffect } from 'react';
import { User, Appointment } from '../../types';
import Header from '../shared/Header';
import Dashboard from '../dashboard/Dashboard';
import ChatAssistant from '../chat/ChatAssistant';
import { listUpcomingEvents, createCalendarEvent } from '../../services/googleCalendarService';

interface MainScreenProps {
  user: User;
  accessToken: string;
  onLogout: () => void;
}

const MainScreen: React.FC<MainScreenProps> = ({ user, accessToken, onLogout }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const events = await listUpcomingEvents(accessToken);
      setAppointments(events);
    } catch (err) {
      setError('Failed to load your calendar. Please try refreshing the page.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleScheduleAppointment = useCallback(async (newAppointmentDetails: Omit<Appointment, 'id' | 'category' | 'description'>) => {
    try {
        const newEvent = await createCalendarEvent(accessToken, newAppointmentDetails);
        // Add the new event to the list and re-sort
        setAppointments(prev => 
            [...prev, newEvent].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        );
    } catch (error) {
        console.error("Failed to schedule appointment:", error);
        // Optionally, inform the user in the chat that scheduling failed.
        // This would require passing a callback down to the ChatAssistant.
        throw error; // re-throw to be caught in ChatAssistant
    }
  }, [accessToken]);
  
  const renderContent = () => {
    if (isLoading) {
      return <div className="flex items-center justify-center h-full"><p className="text-slate-400 text-lg">Loading your calendar...</p></div>;
    }
    if (error) {
      return <div className="flex items-center justify-center h-full"><p className="text-red-400 text-lg">{error}</p></div>;
    }
    return <Dashboard appointments={appointments} />;
  };

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-slate-200">
      <Header user={user} onLogout={onLogout} />
      <main className="flex-1 overflow-hidden p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
          <div className="lg:col-span-2 h-full overflow-y-auto rounded-lg bg-slate-800/50 p-6 shadow-lg backdrop-blur-sm">
            {renderContent()}
          </div>
          <div className="lg:col-span-1 h-full flex flex-col rounded-lg bg-slate-800/50 shadow-lg backdrop-blur-sm">
            <ChatAssistant onScheduleAppointment={handleScheduleAppointment} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainScreen;
