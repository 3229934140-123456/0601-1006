import type { Alert } from '@/types';

const now = Date.now();

export const mockAlerts: Alert[] = [
  {
    id: 'alert-001',
    title: '订单服务 CPU 使用率超过 90%',
    level: 'P0',
    status: 'pending',
    service: 'order-service',
    description: '订单服务在过去 5 分钟内 CPU 使用率持续超过 90%，可能影响下单流程。建议立即检查并扩容。',
    triggerTime: new Date(now - 3 * 60 * 1000).toISOString(),
    affectedServices: ['order-service', 'payment-service', 'user-service'],
    contact: {
      name: '张伟',
      phone: '13800138001',
      role: '一线值班'
    },
    isSilenced: false
  },
  {
    id: 'alert-002',
    title: '数据库主从延迟超过 10 秒',
    level: 'P1',
    status: 'acknowledged',
    service: 'mysql-master',
    description: 'MySQL 主从延迟持续超过 10 秒，可能导致数据不一致。请检查从库同步状态。',
    triggerTime: new Date(now - 15 * 60 * 1000).toISOString(),
    acknowledgeTime: new Date(now - 12 * 60 * 1000).toISOString(),
    affectedServices: ['mysql-master', 'mysql-slave-01', 'order-service', 'user-service'],
    contact: {
      name: '李明',
      phone: '13800138002',
      role: 'DBA'
    },
    isSilenced: false
  },
  {
    id: 'alert-003',
    title: 'Redis 缓存命中率下降至 70%',
    level: 'P2',
    status: 'processing',
    service: 'redis-cluster',
    description: 'Redis 集群整体缓存命中率从 95% 下降至 70%，可能导致数据库压力上升。',
    triggerTime: new Date(now - 45 * 60 * 1000).toISOString(),
    acknowledgeTime: new Date(now - 40 * 60 * 1000).toISOString(),
    affectedServices: ['redis-cluster', 'product-service', 'user-service'],
    contact: {
      name: '王芳',
      phone: '13800138003',
      role: '缓存运维'
    },
    isSilenced: false
  },
  {
    id: 'alert-004',
    title: '消息队列积压超过 10000 条',
    level: 'P1',
    status: 'pending',
    service: 'kafka-cluster',
    description: 'Kafka 订单主题消息积压超过 10000 条，消费速度跟不上生产速度。',
    triggerTime: new Date(now - 8 * 60 * 1000).toISOString(),
    affectedServices: ['kafka-cluster', 'order-consumer', 'payment-consumer'],
    contact: {
      name: '赵强',
      phone: '13800138004',
      role: '中间件运维'
    },
    isSilenced: false
  },
  {
    id: 'alert-005',
    title: '接口响应时间超过 2 秒',
    level: 'P2',
    status: 'resolved',
    service: 'api-gateway',
    description: 'API 网关部分接口响应时间超过 2 秒，影响用户体验。',
    triggerTime: new Date(now - 120 * 60 * 1000).toISOString(),
    acknowledgeTime: new Date(now - 115 * 60 * 1000).toISOString(),
    resolveTime: new Date(now - 60 * 60 * 1000).toISOString(),
    affectedServices: ['api-gateway', 'user-service'],
    contact: {
      name: '刘洋',
      phone: '13800138005',
      role: '网关运维'
    },
    isSilenced: false
  },
  {
    id: 'alert-006',
    title: '磁盘空间使用率超过 80%',
    level: 'P3',
    status: 'pending',
    service: 'log-server-01',
    description: '日志服务器磁盘空间使用率达到 85%，建议清理历史日志或扩容。',
    triggerTime: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
    affectedServices: ['log-server-01'],
    contact: {
      name: '陈静',
      phone: '13800138006',
      role: '运维工程师'
    },
    isSilenced: true,
    silenceEndTime: new Date(now + 4 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'alert-007',
    title: '支付服务异常率超过 5%',
    level: 'P0',
    status: 'processing',
    service: 'payment-service',
    description: '支付服务在过去 3 分钟内异常率达到 8%，严重影响支付流程。',
    triggerTime: new Date(now - 5 * 60 * 1000).toISOString(),
    acknowledgeTime: new Date(now - 4 * 60 * 1000).toISOString(),
    affectedServices: ['payment-service', 'order-service', 'wallet-service'],
    contact: {
      name: '孙磊',
      phone: '13800138007',
      role: '支付架构师'
    },
    isSilenced: false
  },
  {
    id: 'alert-008',
    title: '用户服务健康检查失败',
    level: 'P1',
    status: 'resolved',
    service: 'user-service',
    description: '用户服务其中一个实例健康检查失败，已自动摘除。',
    triggerTime: new Date(now - 180 * 60 * 1000).toISOString(),
    acknowledgeTime: new Date(now - 175 * 60 * 1000).toISOString(),
    resolveTime: new Date(now - 150 * 60 * 1000).toISOString(),
    affectedServices: ['user-service'],
    contact: {
      name: '周涛',
      phone: '13800138008',
      role: '后端开发'
    },
    isSilenced: false
  },
  {
    id: 'alert-009',
    title: '搜索服务响应变慢',
    level: 'P3',
    status: 'acknowledged',
    service: 'search-service',
    description: '搜索服务平均响应时间从 200ms 上升到 500ms，用户感知不明显但需要关注。',
    triggerTime: new Date(now - 90 * 60 * 1000).toISOString(),
    acknowledgeTime: new Date(now - 80 * 60 * 1000).toISOString(),
    affectedServices: ['search-service', 'elasticsearch-cluster'],
    contact: {
      name: '吴敏',
      phone: '13800138009',
      role: '搜索工程师'
    },
    isSilenced: false
  },
  {
    id: 'alert-010',
    title: '定时任务执行超时',
    level: 'P2',
    status: 'pending',
    service: 'job-scheduler',
    description: '数据对账定时任务执行时间超过 30 分钟，可能影响次日数据准确性。',
    triggerTime: new Date(now - 35 * 60 * 1000).toISOString(),
    affectedServices: ['job-scheduler', 'data-warehouse'],
    contact: {
      name: '郑浩',
      phone: '13800138010',
      role: '数据工程师'
    },
    isSilenced: false
  }
];

export const getAlertById = (id: string): Alert | undefined => {
  return mockAlerts.find(alert => alert.id === id);
};

export const getAlertStats = () => {
  const pending = mockAlerts.filter(a => a.status === 'pending').length;
  const processing = mockAlerts.filter(a => a.status === 'acknowledged' || a.status === 'processing').length;
  const resolved = mockAlerts.filter(a => a.status === 'resolved').length;
  const p0Count = mockAlerts.filter(a => a.level === 'P0' && a.status !== 'resolved').length;

  return {
    total: mockAlerts.length,
    pending,
    processing,
    resolved,
    p0Count
  };
};
