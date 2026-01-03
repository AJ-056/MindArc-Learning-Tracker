
import { User, LearningLog } from '../types';

const STORAGE_KEYS = {
  USERS: 'mindarc_users',
  LOGS: 'mindarc_logs',
  SESSION: 'mindarc_session'
};

export const mockBackend = {
  // Auth
  signUp: async (email: string, name: string, _password?: string): Promise<User> => {
    const users: User[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    if (users.find(u => u.email === email)) throw new Error('User already exists');
    
    const newUser: User = { id: Math.random().toString(36).substr(2, 9), email, name };
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([...users, newUser]));
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(newUser));
    return newUser;
  },

  signIn: async (email: string, _password?: string): Promise<User> => {
    const users: User[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const user = users.find(u => u.email === email);
    if (!user) throw new Error('User not found. Please sign up.');
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(user));
    return user;
  },

  getCurrentSession: (): User | null => {
    const session = localStorage.getItem(STORAGE_KEYS.SESSION);
    return session ? JSON.parse(session) : null;
  },

  signOut: () => {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
  },

  // Learning Logs
  // Fixed: Corrected the signature to include userId and date so that the resulting newLog object is a valid LearningLog
  saveLog: async (logData: Omit<LearningLog, 'id' | 'timestamp'>): Promise<LearningLog> => {
    const logs: LearningLog[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.LOGS) || '[]');
    const newLog: LearningLog = {
      ...logData,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now()
    };
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify([newLog, ...logs]));
    return newLog;
  },

  getLogs: async (userId: string): Promise<LearningLog[]> => {
    const logs: LearningLog[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.LOGS) || '[]');
    return logs.filter(l => l.userId === userId);
  }
};
