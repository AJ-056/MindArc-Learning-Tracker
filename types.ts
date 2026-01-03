
export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Resource {
  id: string;
  title: string;
  url: string;
}

export interface LearningLog {
  id: string;
  userId: string;
  date: string;
  topic: string;
  category: string;
  takeaways: string[];
  resources: Resource[];
  timestamp: number;
}

export interface AppState {
  user: User | null;
  logs: LearningLog[];
  isLoading: boolean;
}

export type ViewType = 'dashboard' | 'timeline' | 'resources' | 'stats' | 'auth';
