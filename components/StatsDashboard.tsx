
import React from 'react';
import { LearningLog } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { CATEGORIES } from '../constants';

interface StatsDashboardProps {
  logs: LearningLog[];
}

const StatsDashboard: React.FC<StatsDashboardProps> = ({ logs }) => {
  // Prep chart data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();

  const activityData = last7Days.map(date => ({
    date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
    count: logs.filter(l => new Date(l.timestamp).toISOString().split('T')[0] === date).length
  }));

  const categoryDistribution = CATEGORIES.map(cat => ({
    name: cat,
    value: logs.filter(l => l.category === cat).length
  })).filter(c => c.value > 0);

  const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f43f5e', '#f59e0b', '#10b981', '#06b6d4', '#3b82f6'];

  const totalTakeaways = logs.reduce((acc, log) => acc + log.takeaways.length, 0);
  const totalResources = logs.reduce((acc, log) => acc + log.resources.length, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Sessions" value={logs.length} color="indigo" />
        <StatCard label="Categories" value={categoryDistribution.length} color="purple" />
        <StatCard label="Takeaways" value={totalTakeaways} color="emerald" />
        <StatCard label="Resources" value={totalResources} color="amber" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-6">Last 7 Days Activity</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-6">Learning Distribution</h3>
          <div className="h-[250px] w-full flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="hidden sm:block pl-4 space-y-1">
              {categoryDistribution.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2 text-xs">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <span className="text-slate-500">{entry.name}</span>
                  <span className="font-bold text-slate-800">{entry.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, color }: { label: string, value: number, color: string }) => (
  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <p className={`text-2xl font-black text-${color}-600`}>{value}</p>
  </div>
);

export default StatsDashboard;
