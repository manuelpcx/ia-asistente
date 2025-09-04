import React, { useMemo } from 'react';
import { Appointment } from '../../types';

interface UpcomingAppointmentsProps {
  appointments: Appointment[];
}

const CategoryBadge: React.FC<{ category: Appointment['category'] }> = ({ category }) => {
  const styles = {
    Work: 'bg-blue-500/20 text-blue-300',
    Personal: 'bg-purple-500/20 text-purple-300',
    Health: 'bg-green-500/20 text-green-300',
    Other: 'bg-slate-500/20 text-slate-300',
  };
  return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[category]}`}>{category}</span>;
};


const UpcomingAppointments: React.FC<UpcomingAppointmentsProps> = ({ appointments }) => {

  const upcoming = useMemo(() => {
    // Filter for appointments that are today or in the future
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Set to the beginning of today for comparison

    return appointments
      .filter(a => new Date(a.date) >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5);
  }, [appointments]);


  return (
    <div className="h-full flex flex-col">
      <h2 className="text-xl font-semibold text-white mb-4">Upcoming Schedule</h2>
      <div className="flex-1 overflow-y-auto pr-2 -mr-2">
        {upcoming.length > 0 ? (
          <ul className="space-y-4">
            {upcoming.map(apt => (
              <li key={apt.id} className="p-4 bg-slate-700/50 rounded-lg flex items-start space-x-4 transition hover:bg-slate-700">
                <div className="flex-shrink-0 flex flex-col items-center justify-center bg-slate-600 rounded-md w-12 h-12">
                    <span className="text-white text-lg font-bold">
                        {new Date(apt.date).toLocaleDateString('en-US', { day: 'numeric' })}
                    </span>
                    <span className="text-slate-300 text-xs">
                        {new Date(apt.date).toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white truncate">{apt.title}</p>
                  <p className="text-sm text-slate-400">{new Date(apt.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</p>
                  <div className="mt-2">
                    <CategoryBadge category={apt.category} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex items-center justify-center h-full text-center text-slate-500">
            <p>No upcoming appointments found. <br /> Use the assistant to schedule one!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcomingAppointments;
