import { create } from 'zustand';
import { mockAlerts } from '@/data/alerts';
import type { Alert, AlertStatus } from '@/types';

interface AlertState {
  alerts: Alert[];
  getAlertById: (id: string) => Alert | undefined;
  acknowledgeAlert: (id: string) => void;
  silenceAlert: (id: string, durationMinutes: number) => void;
  unsilenceAlert: (id: string) => void;
  getStats: () => {
    total: number;
    pending: number;
    processing: number;
    resolved: number;
    p0Count: number;
  };
}

export const useAlertStore = create<AlertState>((set, get) => ({
  alerts: [...mockAlerts],

  getAlertById: (id: string) => {
    return get().alerts.find(alert => alert.id === id);
  },

  acknowledgeAlert: (id: string) => {
    set(state => ({
      alerts: state.alerts.map(alert =>
        alert.id === id
          ? {
              ...alert,
              status: 'acknowledged' as AlertStatus,
              acknowledgeTime: new Date().toISOString()
            }
          : alert
      )
    }));
  },

  silenceAlert: (id: string, durationMinutes: number) => {
    const silenceEndTime = new Date(Date.now() + durationMinutes * 60 * 1000).toISOString();
    set(state => ({
      alerts: state.alerts.map(alert =>
        alert.id === id
          ? { ...alert, isSilenced: true, silenceEndTime }
          : alert
      )
    }));
  },

  unsilenceAlert: (id: string) => {
    set(state => ({
      alerts: state.alerts.map(alert =>
        alert.id === id
          ? { ...alert, isSilenced: false, silenceEndTime: undefined }
          : alert
      )
    }));
  },

  getStats: () => {
    const { alerts } = get();
    const pending = alerts.filter(a => a.status === 'pending').length;
    const processing = alerts.filter(a => a.status === 'acknowledged' || a.status === 'processing').length;
    const resolved = alerts.filter(a => a.status === 'resolved').length;
    const p0Count = alerts.filter(a => a.level === 'P0' && a.status !== 'resolved').length;

    return {
      total: alerts.length,
      pending,
      processing,
      resolved,
      p0Count
    };
  }
}));
