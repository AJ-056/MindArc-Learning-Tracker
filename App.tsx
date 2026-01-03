
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { auth, firebaseEnabled } from './services/firebase';
import { ViewType, User, LearningLog, AppState } from './types';
import { backend } from './services/backend';
import { mockBackend } from './services/mockBackend';
import { getLearningSummary } from './services/geminiService';
import { logger } from './services/systemLogger';
import Layout from './components/Layout';
import AuthForm from './components/AuthForm';
import LearningForm from './components/LearningForm';
import LearningTimeline from './components/LearningTimeline';
import ResourceLibrary from './components/ResourceLibrary';
import StatsDashboard from './components/StatsDashboard';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    user: null,
    logs: [],
    isLoading: true
  });
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'waiting' | 'error'>('idle');
  const [errorUrl, setErrorUrl] = useState<string | null>(null);
  
  const activeBackend = firebaseEnabled ? backend : mockBackend;
  const loadAttemptRef = useRef(0);

  const loadUserData = useCallback(async (user: User) => {
    const attempt = ++loadAttemptRef.current;
    setState(prev => ({ ...prev, isLoading: true }));
    setSyncStatus('idle');
    setErrorUrl(null);
    
    // Safety timeout for UI feedback
    const timeoutId = setTimeout(() => {
      if (loadAttemptRef.current === attempt) setSyncStatus('waiting');
    }, 6000);

    try {
      const logs = await activeBackend.getLogs(user.id);
      clearTimeout(timeoutId);
      
      if (loadAttemptRef.current === attempt) {
        setState({ user, logs, isLoading: false });
        setSyncStatus('idle');
        
        if (logs.length > 0) {
          getLearningSummary(logs)
            .then(summary => setAiInsight(summary))
            .catch(() => setAiInsight(null));
        }
      }
    } catch (error: any) {
      clearTimeout(timeoutId);
      console.error("Sync Failure:", error);
      
      if (loadAttemptRef.current === attempt) {
        setState(prev => ({ ...prev, isLoading: false }));
        setSyncStatus('error');
        if (error.indexUrl) {
          setErrorUrl(error.indexUrl);
        }
      }
    }
  }, [activeBackend]);

  useEffect(() => {
    if (firebaseEnabled && auth) {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          const user: User = {
            id: firebaseUser.uid,
            email: firebaseUser.email!,
            name: firebaseUser.displayName || 'Learner'
          };
          loadUserData(user);
        } else {
          setState({ user: null, logs: [], isLoading: false });
        }
      });
      return () => unsubscribe();
    } else {
      const localSession = mockBackend.getCurrentSession();
      if (localSession) {
        loadUserData(localSession);
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    }
  }, [loadUserData]);

  const handleLogin = async (email: string, password?: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      if (firebaseEnabled) {
        await backend.signIn(email, password!);
      } else {
        const user = await mockBackend.signIn(email);
        loadUserData(user);
      }
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const handleSignUp = async (email: string, password?: string, name?: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      if (firebaseEnabled) {
        await backend.signUp(email, password!, name!);
      } else {
        const user = await mockBackend.signUp(email, name!);
        loadUserData(user);
      }
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const handleLogout = async () => {
    if (firebaseEnabled) {
      await backend.signOut();
    } else {
      mockBackend.signOut();
    }
    setState({ user: null, logs: [], isLoading: false });
    setAiInsight(null);
    setCurrentView('dashboard');
  };

  const handleSaveLog = async (logData: Omit<LearningLog, 'id' | 'userId' | 'timestamp'>) => {
    if (!state.user) return;
    try {
      const newLog = await activeBackend.saveLog({
        ...logData,
        userId: state.user.id,
        date: new Date().toISOString()
      });
      
      const updatedLogs = [newLog, ...state.logs];
      setState(prev => ({ ...prev, logs: updatedLogs }));
      
      getLearningSummary(updatedLogs).then(summary => setAiInsight(summary)).catch(() => {});
    } catch (err) {
      console.error("Failed to save log:", err);
      alert("Error saving log. Check your connection.");
    }
  };

  const handleExportLogs = () => {
    if (state.logs.length === 0) return alert("No logs to export!");
    const dataStr = JSON.stringify(state.logs, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', `mindarc-learning-${new Date().toISOString().split('T')[0]}.json`);
    linkElement.click();
  };

  const handleDownloadSystemLogs = () => {
    logger.downloadLogs();
  };

  if (state.isLoading && !state.user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-6"></div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Syncing with Cloud</h2>
        <p className="text-slate-500 text-sm max-w-xs mx-auto mb-8">
          This usually takes less than 2 seconds...
        </p>
        
        {(syncStatus !== 'idle' || errorUrl) && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-500 space-y-4 max-w-sm">
            <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl text-left">
              <p className="text-amber-800 text-xs font-bold mb-2 uppercase tracking-widest">Action Required</p>
              <p className="text-amber-700 text-xs leading-relaxed">
                {errorUrl 
                  ? "Firestore requires a search index. Click the button below to generate it automatically." 
                  : "Sync is taking longer than usual. This is almost always due to a missing 'Composite Index' in Firestore."}
              </p>
              {errorUrl && (
                <a 
                  href={errorUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-4 block w-full text-center py-2 bg-amber-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-amber-700 transition-colors"
                >
                  Create Firestore Index
                </a>
              )}
            </div>
            <div className="flex gap-2 justify-center">
               <button onClick={() => window.location.reload()} className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-lg">Retry</button>
               <button onClick={handleDownloadSystemLogs} className="px-4 py-2 bg-white text-slate-500 text-xs font-bold rounded-xl border border-slate-200">System Logs</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (!state.user) {
    return (
      <div className="relative">
        <AuthForm 
          onLogin={handleLogin} 
          onSignUp={handleSignUp} 
          isLoading={state.isLoading} 
          isFirebaseEnabled={firebaseEnabled}
        />
        <div className="fixed bottom-4 left-0 right-0 text-center">
            <button 
              onClick={handleDownloadSystemLogs}
              className="text-[10px] uppercase tracking-widest font-black text-slate-300 hover:text-slate-500 transition-colors"
            >
              Debug Logs
            </button>
        </div>
      </div>
    );
  }

  return (
    <Layout 
      user={state.user} 
      currentView={currentView} 
      onNavigate={setCurrentView} 
      onLogout={handleLogout}
      onExport={handleExportLogs}
      onSystemExport={handleDownloadSystemLogs}
    >
      <div className="space-y-8">
        {aiInsight && currentView === 'dashboard' && (
          <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-6 text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
             <div className="absolute right-0 bottom-0 opacity-10 scale-150 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.5a2.5 2.5 0 0 0-4.96-.46 2.5 2.5 0 0 0-1.98 3 2.5 2.5 0 0 0 .94 4.82 2.5 2.5 0 0 0 0 4.28 2.5 2.5 0 0 0-1.94 4.3 2.5 2.5 0 0 0 4.54 1.4 2.5 2.5 0 0 0 3.4 0 2.5 2.5 0 0 0 4.54-1.4 2.5 2.5 0 0 0-1.94-4.3 2.5 2.5 0 0 0 0-4.28 2.5 2.5 0 0 0 .94-4.82 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 12 4.5Z"/></svg>
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-indigo-100 text-xs font-bold uppercase tracking-widest mb-2">
                <span className="flex h-2 w-2 rounded-full bg-indigo-300 animate-pulse"></span>
                AI Progress Report
              </div>
              <p className="text-lg font-medium leading-relaxed italic">"{aiInsight}"</p>
            </div>
          </div>
        )}
        {currentView === 'dashboard' && <LearningForm onSave={handleSaveLog} />}
        {currentView === 'timeline' && <LearningTimeline logs={state.logs} />}
        {currentView === 'resources' && <ResourceLibrary logs={state.logs} />}
        {currentView === 'stats' && <StatsDashboard logs={state.logs} />}
      </div>
    </Layout>
  );
};

export default App;