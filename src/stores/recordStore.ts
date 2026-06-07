import { create } from 'zustand';
import { mockRecords } from '@/data/records';
import type { HandleRecord, HandleStep } from '@/types';

interface RecordState {
  records: HandleRecord[];
  getRecordByAlertId: (alertId: string) => HandleRecord | undefined;
  addStep: (alertId: string, content: string, operator?: string) => void;
  addScreenshot: (alertId: string, screenshotUrl: string) => void;
  getStats: () => {
    total: number;
    processing: number;
    resolved: number;
    avgDuration: number;
  };
}

export const useRecordStore = create<RecordState>((set, get) => ({
  records: [...mockRecords],

  getRecordByAlertId: (alertId: string) => {
    return get().records.find(r => r.alertId === alertId);
  },

  addStep: (alertId: string, content: string, operator = '当前值班人') => {
    const newStep: HandleStep = {
      id: `${alertId}-step-${Date.now()}`,
      time: new Date().toISOString(),
      operator,
      content,
      type: 'comment'
    };

    set(state => {
      const existingRecord = state.records.find(r => r.alertId === alertId);

      if (existingRecord) {
        return {
          records: state.records.map(r =>
            r.alertId === alertId
              ? { ...r, steps: [...r.steps, newStep] }
              : r
          )
        };
      }

      const alert = state.records.find(r => r.alertId === alertId);
      const newRecord: HandleRecord = {
        id: `record-${Date.now()}`,
        alertId,
        alertTitle: alert?.alertTitle || '告警处理记录',
        level: alert?.level || 'P2',
        operator,
        startTime: new Date().toISOString(),
        steps: [newStep],
        screenshots: [],
        status: 'processing'
      };

      return {
        records: [...state.records, newRecord]
      };
    });
  },

  addScreenshot: (alertId: string, screenshotUrl: string) => {
    set(state => {
      const existingRecord = state.records.find(r => r.alertId === alertId);

      if (existingRecord) {
        return {
          records: state.records.map(r =>
            r.alertId === alertId
              ? { ...r, screenshots: [...r.screenshots, screenshotUrl] }
              : r
          )
        };
      }

      const newRecord: HandleRecord = {
        id: `record-${Date.now()}`,
        alertId,
        alertTitle: '告警处理记录',
        level: 'P2',
        operator: '当前值班人',
        startTime: new Date().toISOString(),
        steps: [],
        screenshots: [screenshotUrl],
        status: 'processing'
      };

      return {
        records: [...state.records, newRecord]
      };
    });
  },

  getStats: () => {
    const { records } = get();
    const total = records.length;
    const resolved = records.filter(r => r.status === 'resolved').length;
    const processing = records.filter(r => r.status === 'processing').length;
    const recordsWithDuration = records.filter(r => r.duration);
    const avgDuration = recordsWithDuration.length > 0
      ? Math.round(
          recordsWithDuration.reduce((sum, r) => sum + (r.duration || 0), 0) /
          recordsWithDuration.length
        )
      : 0;

    return {
      total,
      resolved,
      processing,
      avgDuration
    };
  }
}));
