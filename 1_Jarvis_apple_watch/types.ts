
export interface Message {
  role: 'user' | 'jarvis';
  text: string;
  timestamp: Date;
  groundingLinks?: { title: string; uri: string }[];
}

export interface SystemStatus {
  cpu: number;
  memory: number;
  network: number;
  latency: number;
  location?: {
    lat: number;
    lng: number;
  };
}

export interface NewsItem {
  title: string;
  source: string;
  time: string;
}

export interface AgendaItem {
  time: string;
  task: string;
  priority: 'CRITICAL' | 'HIGH' | 'NORMAL';
}

export interface NotificationItem {
  id: string;
  type: 'SECURITY' | 'SYSTEM' | 'COMM';
  content: string;
  time: string;
}

export interface UserPreference {
  id: string;
  label: string;
  value: string;
  status: 'ACTIVE' | 'OFFLINE' | 'LOCKED';
}
