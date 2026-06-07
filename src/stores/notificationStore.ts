import { create } from 'zustand';
import { mockNotificationRules } from '@/data/review';
import type { NotificationRule } from '@/types';

interface NotificationState {
  rules: NotificationRule[];
  dndEnabled: boolean;
  dndStartTime: string;
  dndEndTime: string;
  dndDays: boolean[];
  channels: {
    push: boolean;
    sms: boolean;
    phone: boolean;
    email: boolean;
  };
  toggleRule: (id: string) => void;
  toggleDnd: () => void;
  setDndTime: (start: string, end: string) => void;
  toggleDndDay: (dayIndex: number) => void;
  toggleChannel: (channel: keyof NotificationState['channels']) => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  rules: [...mockNotificationRules],
  dndEnabled: false,
  dndStartTime: '23:00',
  dndEndTime: '07:00',
  dndDays: [true, true, true, true, true, false, false],
  channels: {
    push: true,
    sms: false,
    phone: false,
    email: true
  },

  toggleRule: (id: string) => {
    set(state => ({
      rules: state.rules.map(rule =>
        rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
      )
    }));
  },

  toggleDnd: () => {
    set(state => ({
      dndEnabled: !state.dndEnabled
    }));
  },

  setDndTime: (start: string, end: string) => {
    set({
      dndStartTime: start,
      dndEndTime: end
    });
  },

  toggleDndDay: (dayIndex: number) => {
    set(state => {
      const newDays = [...state.dndDays];
      newDays[dayIndex] = !newDays[dayIndex];
      return { dndDays: newDays };
    });
  },

  toggleChannel: (channel: keyof NotificationState['channels']) => {
    set(state => ({
      channels: {
        ...state.channels,
        [channel]: !state.channels[channel]
      }
    }));
  }
}));
