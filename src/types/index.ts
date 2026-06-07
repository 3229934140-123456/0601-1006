export type AlertLevel = 'P0' | 'P1' | 'P2' | 'P3';

export type AlertStatus = 'pending' | 'acknowledged' | 'processing' | 'resolved';

export interface Alert {
  id: string;
  title: string;
  level: AlertLevel;
  status: AlertStatus;
  service: string;
  description: string;
  triggerTime: string;
  acknowledgeTime?: string;
  resolveTime?: string;
  affectedServices: string[];
  contact: {
    name: string;
    phone: string;
    role: string;
  };
  isSilenced: boolean;
  silenceEndTime?: string;
}

export interface TopologyNode {
  id: string;
  name: string;
  type: 'service' | 'database' | 'cache' | 'mq' | 'gateway';
  status: 'normal' | 'warning' | 'error';
  alertCount: number;
}

export interface TopologyEdge {
  source: string;
  target: string;
}

export interface ServiceChange {
  id: string;
  service: string;
  type: 'deploy' | 'config' | 'rollback';
  operator: string;
  time: string;
  description: string;
}

export interface HandleRecord {
  id: string;
  alertId: string;
  alertTitle: string;
  level: AlertLevel;
  operator: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  steps: HandleStep[];
  screenshots: string[];
  relatedTicket?: string;
  status: 'processing' | 'resolved';
}

export interface HandleStep {
  id: string;
  time: string;
  operator: string;
  content: string;
  type: 'acknowledge' | 'operation' | 'comment' | 'resolve';
}

export interface DutyPerson {
  id: string;
  name: string;
  phone: string;
  role: string;
  avatar?: string;
}

export interface DutySchedule {
  date: string;
  dayShift: DutyPerson;
  nightShift: DutyPerson;
}

export interface NotificationRule {
  id: string;
  name: string;
  enabled: boolean;
  level: AlertLevel[];
  channels: ('push' | 'sms' | 'phone')[];
  quietHours?: {
    start: string;
    end: string;
  };
}

export interface ReviewItem {
  id: string;
  title: string;
  alertCount: number;
  avgResponseTime: number;
  avgResolveTime: number;
  date: string;
  summary: string;
}

export interface TroubleshootingGuide {
  id: string;
  title: string;
  content: string;
  category: string;
  isFavorite: boolean;
  usageCount: number;
}

export interface StatItem {
  label: string;
  value: number | string;
  unit?: string;
  trend?: 'up' | 'down' | 'flat';
  trendValue?: string;
}
