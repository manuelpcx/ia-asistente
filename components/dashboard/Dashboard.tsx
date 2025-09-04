
import React from 'react';
import { Appointment } from '../../types';
import StatCard from './StatCard';
import AppointmentsChart from './AppointmentsChart';
import UpcomingAppointments from './UpcomingAppointments';

interface DashboardProps {
  appointments: Appointment[];
}

const CalendarIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const CheckCircleIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const UserGroupIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.28-1.25-1.44-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.28-1.25 1.44-1.857M12 12a3 3 0 100-6 3 3 0 000 6z" /></svg>;

const Dashboard: React.FC<DashboardProps> = ({ appointments }) => {
  const upcomingCount = appointments.filter(a => new Date(a.date) >= new Date()).length;
  const completedCount = appointments.length - upcomingCount;
  const totalAttendees = appointments.reduce((acc, curr) => acc + curr.attendees.length, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 mt-1">Here's an overview of your schedule.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Upcoming Appointments" value={upcomingCount.toString()} icon={<CalendarIcon />} color="blue" />
        <StatCard title="Completed Appointments" value={completedCount.toString()} icon={<CheckCircleIcon />} color="green" />
        <StatCard title="Total Attendees" value={totalAttendees.toString()} icon={<UserGroupIcon />} color="purple" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
        <div className="xl:col-span-3 bg-slate-800 p-6 rounded-lg shadow-inner">
          <h2 className="text-xl font-semibold text-white mb-4">Monthly Activity</h2>
          <div className="h-80">
            <AppointmentsChart appointments={appointments} />
          </div>
        </div>
        <div className="xl:col-span-2 bg-slate-800 p-6 rounded-lg shadow-inner">
           <UpcomingAppointments appointments={appointments} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
