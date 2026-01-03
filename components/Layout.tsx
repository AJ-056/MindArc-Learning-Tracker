
import React from 'react';
import { ViewType, User } from '../types';
import { ICONS } from '../constants';

interface LayoutProps {
  user: User | null;
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
  onLogout: () => void;
  onExport: () => void;
  onSystemExport: () => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ user, currentView, onNavigate, onLogout, onExport, onSystemExport, children }) => {
  if (!user) return <>{children}</>;

  const NavItem = ({ view, label, icon }: { view: ViewType, label: string, icon: React.ReactNode }) => (
    <button
      onClick={() => onNavigate(view)}
      className={`flex flex-col items-center justify-center py-2 px-4 transition-all ${
        currentView === view ? 'text-indigo-600 font-semibold' : 'text-slate-500 hover:text-slate-800'
      }`}
    >
      <div className={`${currentView === view ? 'scale-110' : ''}`}>{icon}</div>
      <span className="text-[10px] mt-1 uppercase tracking-wider">{label}</span>
    </button>
  );

  return (
    <div className="flex flex-col min-h-screen pb-24 md:pb-0 md:pl-64">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-200 flex-col z-20">
        <div className="p-8">
          <div className="flex items-center gap-3 text-indigo-600 font-bold text-xl tracking-tight" onClick={() => onNavigate('dashboard')}>
            {ICONS.brain}
            <span>MindArc</span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          <DesktopNavItem onClick={() => onNavigate('dashboard')} active={currentView === 'dashboard'} icon={ICONS.plus} label="Track Learning" />
          <DesktopNavItem onClick={() => onNavigate('timeline')} active={currentView === 'timeline'} icon={ICONS.history} label="Timeline" />
          <DesktopNavItem onClick={() => onNavigate('resources')} active={currentView === 'resources'} icon={ICONS.book} label="Resources" />
          <DesktopNavItem onClick={() => onNavigate('stats')} active={currentView === 'stats'} icon={ICONS.chart} label="Progress" />
        </nav>

        <div className="px-4 pb-4 space-y-2">
          <button 
            onClick={onExport}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-dashed border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-200 transition-all text-xs font-medium"
          >
            {ICONS.download}
            <span>Download Learning Data</span>
          </button>
          <button 
            onClick={onSystemExport}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-slate-300 hover:text-slate-500 transition-all text-[10px] font-bold uppercase tracking-widest"
          >
            Download System Logs
          </button>
        </div>

        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-50 rounded-xl p-4 flex items-center justify-between">
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium truncate">{user.name}</span>
              <span className="text-[10px] text-slate-400 truncate uppercase tracking-widest">{user.email}</span>
            </div>
            <button onClick={onLogout} title="Logout" className="text-slate-400 hover:text-red-500 transition-colors ml-2">
              {ICONS.logout}
            </button>
          </div>
        </div>
      </aside>

      {/* Bottom Nav - Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex flex-col z-50">
        <div className="flex justify-around items-center border-b border-slate-50">
          <NavItem view="dashboard" label="Track" icon={ICONS.plus} />
          <NavItem view="timeline" label="History" icon={ICONS.history} />
          <NavItem view="resources" label="Library" icon={ICONS.book} />
          <NavItem view="stats" label="Stats" icon={ICONS.chart} />
        </div>
        <div className="flex items-center justify-between px-6 py-2 bg-slate-50/50">
            <button onClick={onExport} className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              {ICONS.download} Export
            </button>
            <button onClick={onLogout} className="flex items-center gap-2 text-[10px] font-bold text-red-400 uppercase tracking-widest">
              Exit {ICONS.logout}
            </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 max-w-5xl mx-auto w-full">
        <header className="mb-8 md:hidden flex justify-between items-center">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-lg" onClick={() => onNavigate('dashboard')}>
            {ICONS.brain}
            <span>MindArc</span>
          </div>
          <div className="text-xs font-medium bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full">
            {user.name}
          </div>
        </header>
        {children}
      </main>
    </div>
  );
};

const DesktopNavItem = ({ onClick, active, icon, label }: { onClick: () => void, active: boolean, icon: React.ReactNode, label: string }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
      active ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-sm' : 'text-slate-600 hover:bg-slate-50'
    }`}
  >
    <div className={active ? 'text-indigo-600' : 'text-slate-400'}>{icon}</div>
    <span>{label}</span>
  </button>
);

export default Layout;
