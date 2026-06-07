import type { DutySchedule, DutyPerson } from '@/types';

export const mockDutyPersons: DutyPerson[] = [
  { id: 'p001', name: '张伟', phone: '13800138001', role: '一线值班工程师' },
  { id: 'p002', name: '李明', phone: '13800138002', role: 'DBA / 二线值班' },
  { id: 'p003', name: '王芳', phone: '13800138003', role: '缓存 / 中间件运维' },
  { id: 'p004', name: '赵强', phone: '13800138004', role: '中间件 / 消息队列' },
  { id: 'p005', name: '刘洋', phone: '13800138005', role: '网关 / 网络运维' },
  { id: 'p006', name: '陈静', phone: '13800138006', role: '系统运维工程师' },
  { id: 'p007', name: '孙磊', phone: '13800138007', role: '支付架构师' },
  { id: 'p008', name: '周涛', phone: '13800138008', role: '后端开发工程师' }
];

const generateDutySchedule = (): DutySchedule[] => {
  const schedules: DutySchedule[] = [];
  const today = new Date();

  for (let i = 0; i < 14; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i - 3);
    const dateStr = date.toISOString().split('T')[0];

    const dayIndex = i % mockDutyPersons.length;
    const nightIndex = (i + 3) % mockDutyPersons.length;

    schedules.push({
      date: dateStr,
      dayShift: mockDutyPersons[dayIndex],
      nightShift: mockDutyPersons[nightIndex]
    });
  }

  return schedules;
};

export const mockDutySchedule: DutySchedule[] = generateDutySchedule();

export const getCurrentDuty = (): { dayShift: DutyPerson; nightShift: DutyPerson } => {
  const today = new Date().toISOString().split('T')[0];
  const todaySchedule = mockDutySchedule.find(s => s.date === today);

  if (todaySchedule) {
    return {
      dayShift: todaySchedule.dayShift,
      nightShift: todaySchedule.nightShift
    };
  }

  return {
    dayShift: mockDutyPersons[0],
    nightShift: mockDutyPersons[3]
  };
};
