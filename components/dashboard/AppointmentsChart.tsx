import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Appointment } from '../../types';

interface AppointmentsChartProps {
  appointments: Appointment[];
}

const AppointmentsChart: React.FC<AppointmentsChartProps> = ({ appointments }) => {
  const data = useMemo(() => {
    const monthCounts: { [key: string]: { Work: number, Personal: number, Health: number, Other: number } } = {};
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    appointments.forEach(appointment => {
      const monthIndex = new Date(appointment.date).getMonth();
      const monthName = monthNames[monthIndex];
      if (!monthCounts[monthName]) {
        monthCounts[monthName] = { Work: 0, Personal: 0, Health: 0, Other: 0 };
      }
      monthCounts[monthName][appointment.category]++;
    });

    return monthNames.map(name => ({
      name,
      Work: monthCounts[name]?.Work || 0,
      Personal: monthCounts[name]?.Personal || 0,
      Health: monthCounts[name]?.Health || 0,
      Other: monthCounts[name]?.Other || 0,
    })).filter(d => d.Work > 0 || d.Personal > 0 || d.Health > 0 || d.Other > 0);
  }, [appointments]);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-slate-500">
        <p>No appointment data to display for this year.</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
        <XAxis dataKey="name" stroke="#94a3b8" />
        <YAxis stroke="#94a3b8" />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(30, 41, 59, 0.9)',
            borderColor: '#475569',
            borderRadius: '0.5rem',
          }}
          cursor={{ fill: 'rgba(71, 85, 105, 0.5)' }}
        />
        <Legend wrapperStyle={{ color: '#cbd5e1' }} />
        <Bar dataKey="Work" stackId="a" fill="#60a5fa" name="Work" />
        <Bar dataKey="Personal" stackId="a" fill="#a78bfa" name="Personal" />
        <Bar dataKey="Health" stackId="a" fill="#4ade80" name="Health" />
        <Bar dataKey="Other" stackId="a" fill="#94a3b8" name="Other" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default AppointmentsChart;
