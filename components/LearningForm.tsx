
import React, { useState } from 'react';
import { CATEGORIES, ICONS } from '../constants';
import { Resource } from '../types';

interface LearningFormProps {
  onSave: (data: { topic: string, category: string, takeaways: string[], resources: Resource[] }) => void;
}

const LearningForm: React.FC<LearningFormProps> = ({ onSave }) => {
  const [topic, setTopic] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [takeawayInput, setTakeawayInput] = useState('');
  const [takeaways, setTakeaways] = useState<string[]>([]);
  const [resourceTitle, setResourceTitle] = useState('');
  const [resourceUrl, setResourceUrl] = useState('');
  const [resources, setResources] = useState<Resource[]>([]);

  const handleAddTakeaway = (e: React.FormEvent) => {
    e.preventDefault();
    if (takeawayInput.trim()) {
      setTakeaways([...takeaways, takeawayInput.trim()]);
      setTakeawayInput('');
    }
  };

  const handleAddResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (resourceTitle.trim() && resourceUrl.trim()) {
      setResources([...resources, { 
        id: Math.random().toString(36).substr(2, 9), 
        title: resourceTitle, 
        url: resourceUrl 
      }]);
      setResourceTitle('');
      setResourceUrl('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic || !category) return;
    onSave({ topic, category, takeaways, resources });
    setTopic('');
    setTakeaways([]);
    setResources([]);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
        <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-black">1</span>
        What did you learn today?
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Topic Title</label>
            <input
              type="text"
              required
              placeholder="e.g. React Server Components, Docker Basics..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none bg-white"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700">Key Takeaways</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add a bullet point..."
              value={takeawayInput}
              onChange={(e) => setTakeawayInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTakeaway(e)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
            <button
              type="button"
              onClick={handleAddTakeaway}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors font-medium"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            {takeaways.map((t, i) => (
              <span key={i} className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-sm group">
                {t}
                <button type="button" onClick={() => setTakeaways(takeaways.filter((_, idx) => idx !== i))} className="hover:text-red-500 transition-colors">
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-1.5 p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <label className="text-sm font-semibold text-slate-700 block mb-3">Useful Resources (Optional)</label>
          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              placeholder="Resource name (e.g. MDN docs)"
              value={resourceTitle}
              onChange={(e) => setResourceTitle(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
            />
            <input
              type="url"
              placeholder="https://..."
              value={resourceUrl}
              onChange={(e) => setResourceUrl(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
            />
            <button
              type="button"
              onClick={handleAddResource}
              className="px-6 py-2.5 bg-white border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 rounded-xl transition-all font-medium text-sm shadow-sm"
            >
              Save Link
            </button>
          </div>
          <div className="space-y-2 mt-4">
            {resources.map((r) => (
              <div key={r.id} className="flex items-center justify-between text-xs py-2 px-3 bg-white rounded-lg border border-slate-100 shadow-sm">
                <div className="flex items-center gap-2 text-slate-600">
                  {ICONS.link}
                  <span className="font-semibold">{r.title}</span>
                  <span className="text-slate-400 truncate max-w-[150px]">{r.url}</span>
                </div>
                <button type="button" onClick={() => setResources(resources.filter(x => x.id !== r.id))} className="text-slate-400 hover:text-red-500">
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={!topic}
            className={`px-8 py-3 rounded-xl font-bold transition-all shadow-md active:scale-95 ${
              topic 
              ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200 hover:shadow-indigo-300' 
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            Log Learning Session
          </button>
        </div>
      </form>
    </div>
  );
};

export default LearningForm;
