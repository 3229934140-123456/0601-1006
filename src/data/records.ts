import type { HandleRecord, HandleStep } from '@/types';

const now = Date.now();

const createSteps = (alertId: string, hasResolve: boolean): HandleStep[] => {
  const steps: HandleStep[] = [
    {
      id: `${alertId}-step-1`,
      time: new Date(now - 120 * 60 * 1000).toISOString(),
      operator: '张伟',
      content: '收到告警通知，开始排查问题',
      type: 'acknowledge'
    },
    {
      id: `${alertId}-step-2`,
      time: new Date(now - 110 * 60 * 1000).toISOString(),
      operator: '张伟',
      content: '登录服务器查看服务状态，发现 CPU 使用率过高',
      type: 'operation'
    },
    {
      id: `${alertId}-step-3`,
      time: new Date(now - 100 * 60 * 1000).toISOString(),
      operator: '张伟',
      content: '查看日志发现有大量慢查询，需要优化 SQL',
      type: 'comment'
    },
    {
      id: `${alertId}-step-4`,
      time: new Date(now - 90 * 60 * 1000).toISOString(),
      operator: '张伟',
      content: '联系开发团队进行代码优化',
      type: 'operation'
    }
  ];

  if (hasResolve) {
    steps.push({
      id: `${alertId}-step-5`,
      time: new Date(now - 60 * 60 * 1000).toISOString(),
      operator: '张伟',
      content: '问题已解决，服务恢复正常',
      type: 'resolve'
    });
  }

  return steps;
};

export const mockRecords: HandleRecord[] = [
  {
    id: 'record-001',
    alertId: 'alert-005',
    alertTitle: '接口响应时间超过 2 秒',
    level: 'P2',
    operator: '张伟',
    startTime: new Date(now - 120 * 60 * 1000).toISOString(),
    endTime: new Date(now - 60 * 60 * 1000).toISOString(),
    duration: 60,
    steps: createSteps('alert-005', true),
    screenshots: [],
    relatedTicket: 'TICKET-20240601-001',
    status: 'resolved'
  },
  {
    id: 'record-002',
    alertId: 'alert-008',
    alertTitle: '用户服务健康检查失败',
    level: 'P1',
    operator: '李明',
    startTime: new Date(now - 180 * 60 * 1000).toISOString(),
    endTime: new Date(now - 150 * 60 * 1000).toISOString(),
    duration: 30,
    steps: [
      {
        id: 'alert-008-step-1',
        time: new Date(now - 180 * 60 * 1000).toISOString(),
        operator: '李明',
        content: '告警触发，用户服务实例健康检查失败',
        type: 'acknowledge'
      },
      {
        id: 'alert-008-step-2',
        time: new Date(now - 175 * 60 * 1000).toISOString(),
        operator: '李明',
        content: '确认实例已被自动摘除，流量切换正常',
        type: 'operation'
      },
      {
        id: 'alert-008-step-3',
        time: new Date(now - 160 * 60 * 1000).toISOString(),
        operator: '李明',
        content: '重启异常实例，服务恢复正常',
        type: 'resolve'
      }
    ],
    screenshots: [],
    relatedTicket: 'TICKET-20240601-002',
    status: 'resolved'
  },
  {
    id: 'record-003',
    alertId: 'alert-002',
    alertTitle: '数据库主从延迟超过 10 秒',
    level: 'P1',
    operator: '李明',
    startTime: new Date(now - 45 * 60 * 1000).toISOString(),
    steps: [
      {
        id: 'alert-002-step-1',
        time: new Date(now - 45 * 60 * 1000).toISOString(),
        operator: '李明',
        content: '收到主从延迟告警，立即介入处理',
        type: 'acknowledge'
      },
      {
        id: 'alert-002-step-2',
        time: new Date(now - 35 * 60 * 1000).toISOString(),
        operator: '李明',
        content: '发现从库 IO 线程阻塞，正在分析原因',
        type: 'operation'
      }
    ],
    screenshots: [],
    status: 'processing'
  },
  {
    id: 'record-004',
    alertId: 'alert-007',
    alertTitle: '支付服务异常率超过 5%',
    level: 'P0',
    operator: '孙磊',
    startTime: new Date(now - 15 * 60 * 1000).toISOString(),
    steps: [
      {
        id: 'alert-007-step-1',
        time: new Date(now - 15 * 60 * 1000).toISOString(),
        operator: '孙磊',
        content: 'P0 级告警！支付服务异常率飙升',
        type: 'acknowledge'
      },
      {
        id: 'alert-007-step-2',
        time: new Date(now - 10 * 60 * 1000).toISOString(),
        operator: '孙磊',
        content: '正在回滚上一个版本的发布',
        type: 'operation'
      }
    ],
    screenshots: [],
    status: 'processing'
  },
  {
    id: 'record-005',
    alertId: 'alert-003',
    alertTitle: 'Redis 缓存命中率下降至 70%',
    level: 'P2',
    operator: '王芳',
    startTime: new Date(now - 90 * 60 * 1000).toISOString(),
    steps: [
      {
        id: 'alert-003-step-1',
        time: new Date(now - 90 * 60 * 1000).toISOString(),
        operator: '王芳',
        content: '缓存命中率下降，开始排查',
        type: 'acknowledge'
      },
      {
        id: 'alert-003-step-2',
        time: new Date(now - 75 * 60 * 1000).toISOString(),
        operator: '王芳',
        content: '发现热点 key 分布不均，正在调整缓存策略',
        type: 'operation'
      }
    ],
    screenshots: [],
    status: 'processing'
  }
];

export const getRecordStats = () => {
  const total = mockRecords.length;
  const resolved = mockRecords.filter(r => r.status === 'resolved').length;
  const processing = mockRecords.filter(r => r.status === 'processing').length;
  const avgDuration = Math.round(
    mockRecords.filter(r => r.duration).reduce((sum, r) => sum + (r.duration || 0), 0) /
    Math.max(mockRecords.filter(r => r.duration).length, 1)
  );

  return {
    total,
    resolved,
    processing,
    avgDuration
  };
};
