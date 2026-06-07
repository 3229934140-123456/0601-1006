import { create } from 'zustand';
import { mockDutySchedule, mockDutyPersons } from '@/data/duty';
import type { DutySchedule, DutyPerson } from '@/types';

interface DutyState {
  schedule: DutySchedule[];
  persons: DutyPerson[];
  getCurrentDuty: () => { dayShift: DutyPerson; nightShift: DutyPerson };
  getScheduleByDate: (date: string) => DutySchedule | undefined;
  getWeekSchedule: () => DutySchedule[];
  swapShift: (date: string, shiftType: 'day' | 'night', personId: string) => void;
}

export const useDutyStore = create<DutyState>((set, get) => ({
  schedule: [...mockDutySchedule],
  persons: [...mockDutyPersons],

  getCurrentDuty: () => {
    const { schedule } = get();
    const today = new Date().toISOString().split('T')[0];
    const todaySchedule = schedule.find(s => s.date === today);

    if (todaySchedule) {
      return {
        dayShift: todaySchedule.dayShift,
        nightShift: todaySchedule.nightShift
      };
    }

    const persons = get().persons;
    return {
      dayShift: persons[0],
      nightShift: persons[3]
    };
  },

  getScheduleByDate: (date: string) => {
    const { schedule } = get();
    return schedule.find(s => s.date === date);
  },

  getWeekSchedule: () => {
    const { schedule } = get();
    return schedule.slice(0, 7);
  },

  swapShift: (date: string, shiftType: 'day' | 'night', personId: string) => {
    const { persons } = get();
    const newPerson = persons.find(p => p.id === personId);
    if (!newPerson) return;

    set(state => ({
      schedule: state.schedule.map(s => {
        if (s.date === date) {
          if (shiftType === 'day') {
            return { ...s, dayShift: newPerson };
          } else {
            return { ...s, nightShift: newPerson };
          }
        }
        return s;
      })
    }));
  }
}));
