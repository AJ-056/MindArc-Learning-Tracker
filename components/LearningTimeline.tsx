
import React, { useState } from 'react';
import { LearningLog } from '../types';
import { CATEGORIES, ICONS } from '../constants';

interface LearningTimelineProps {
  logs: LearningLog[];
}

const LearningTimeline: React.FC<LearningTimelineProps> = ({ logs }) => {
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = logs.filter(l => {
    const matchesCategory = filter === 'All' || l.category === filter;
    const matchesSearch = l.topic.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          l.takeaways.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
        <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-4">
          {ICONS.history}
        </div>
        <h3 className="text-lg font-semibold text-slate-700">No learnings logged yet</h3>
        <p className="text-slate-400 text-sm">Start tracking today to see your timeline build up!</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-slate-900">Learning Journey</h2>
          <p className="text-slate-500 text-sm">Your chronological history of growth</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 flex-1 max-w-2xl">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search topics or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-white shadow-sm transition-all"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar md:pb-0">
            <button
              onClick={() => setFilter('All')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                filter === 'All' 
                ? 'bg-slate-900 text-white border-slate-900 shadow-md' 
                : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
              }`}
            >
              All
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                  filter === cat 
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' 
                  : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredLogs.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-slate-100 shadow-sm">
          <div className="text-slate-300 mb-4 flex justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </div>
          <p className="text-slate-500 font-medium">No matches found for "{searchTerm}" in {filter === 'All' ? 'all categories' : filter}.</p>
          <button 
            onClick={() => {setSearchTerm(''); setFilter('All');}}
            className="mt-4 text-indigo-600 text-sm font-bold hover:underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="relative space-y-8 ml-4 border-l-2 border-slate-200 pl-8 pb-8">
          {filteredLogs.map((log) => (
            <div key={log.id} className="relative group">
              {/* Timeline Dot */}
              <div className="absolute -left-[41px] top-4 w-5 h-5 rounded-full border-4 border-white bg-indigo-500 shadow-sm transition-transform group-hover:scale-125 z-10"></div>
              
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md hover:border-indigo-200">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">{log.category}</span>
                    <h3 className="text-xl font-bold text-slate-800 mt-1">{log.topic}</h3>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{new Date(log.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                  </div>
                </div>

                <div className="space-y-4">
                  {log.takeaways.length > 0 && (
                    <div>
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Takeaways</h4>
                      <ul className="space-y-2">
                        {log.takeaways.map((t, i) => (
                          <li key={i} className="flex gap-2 text-sm text-slate-600">
                            <span className="text-indigo-400 font-bold">•</span>
                            {t}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {log.resources.length > 0 && (
                    <div>
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Saved Links</h4>
                      <div className="flex flex-wrap gap-2">
                        {log.resources.map(r => (
                          <a
                            key={r.id}
                            href={r.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 hover:bg-indigo-50 border border-slate-100 rounded-lg text-xs font-medium text-slate-600 hover:text-indigo-600 transition-colors"
                          >
                            {ICONS.link}
                            {r.title}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LearningTimeline;
