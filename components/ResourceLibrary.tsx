
import React, { useState } from 'react';
import { LearningLog } from '../types';
import { ICONS } from '../constants';

interface ResourceLibraryProps {
  logs: LearningLog[];
}

const ResourceLibrary: React.FC<ResourceLibraryProps> = ({ logs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const allResources = logs.flatMap(l => l.resources.map(r => ({
    ...r,
    topic: l.topic,
    category: l.category,
    date: new Date(l.timestamp).toLocaleDateString()
  })));

  const filtered = allResources.filter(r => 
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.topic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Resource Library</h2>
          <p className="text-slate-500 text-sm">All your saved links in one organized place</p>
        </div>
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-white"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <p className="text-slate-400">No resources found matching your search.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(r => (
            <a
              key={r.id}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  {ICONS.link}
                </div>
                <div className="flex-1 overflow-hidden">
                  <h4 className="font-bold text-slate-800 truncate">{r.title}</h4>
                  <p className="text-[10px] uppercase font-bold text-indigo-500 tracking-wider">{r.category}</p>
                </div>
              </div>
              <div className="text-xs text-slate-500 line-clamp-2 mb-4 h-8">
                Context: {r.topic}
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <span className="text-[10px] text-slate-400 font-medium">Saved {r.date}</span>
                <span className="text-xs font-bold text-indigo-600 group-hover:translate-x-1 transition-transform">Visit Site →</span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResourceLibrary;
