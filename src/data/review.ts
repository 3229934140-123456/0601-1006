import type { ReviewItem, TroubleshootingGuide, NotificationRule } from '@/types';

const now = Date.now();

export const mockReviewItems: ReviewItem[] = [
  {
    id: 'review-001',
    title: '本周告警复盘',
    alertCount: 42,
    avgResponseTime: 8,
    avgResolveTime: 45,
    date: new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString(),
    summary: '本周告警数量较上周下降 15%，P0 级告警 2 起，主要集中在支付和订单服务。平均响应时间 8 分钟，较上周提升 20%。'
  },
  {
    id: 'review-002',
    title: '6月告警复盘',
    alertCount: 156,
    avgResponseTime: 12,
    avgResolveTime: 60,
    date: new Date(now - 30 * 24 * 60 * 60 * 1000).toISOString(),
    summary: '6月共发生 156 起告警，其中 P0 级 5 起，P1 级 23 起。主要原因包括：数据库性能问题（35%）、服务发布导致（28%）、硬件故障（15%）。'
  },
  {
    id: 'review-003',
    title: '支付服务专项复盘',
    alertCount: 18,
    avgResponseTime: 5,
    avgResolveTime: 30,
    date: new Date(now - 14 * 24 * 60 * 60 * 1000).toISOString(),
    summary: '支付服务近两周告警 18 起，主要集中在支付高峰期。已完成支付链路优化，预计可降低 40% 告警量。'
  }
];

export const mockTroubleshootingGuides: TroubleshootingGuide[] = [
  {
    id: 'guide-001',
    title: '数据库主从延迟排查指南',
    content: '1. 检查从库 IO 线程状态\n2. 查看主库 binlog 生成速度\n3. 检查从库服务器负载\n4. 分析慢查询影响\n5. 考虑并行复制配置',
    category: '数据库',
    isFavorite: true,
    usageCount: 28
  },
  {
    id: 'guide-002',
    title: '服务 CPU 过高排查步骤',
    content: '1. top 命令查看进程 CPU 占用\n2. jstack/jmap 分析线程状态\n3. 查看是否有 Full GC\n4. 检查是否有死循环\n5. 分析请求量变化',
    category: '应用服务',
    isFavorite: true,
    usageCount: 35
  },
  {
    id: 'guide-003',
    title: 'Redis 缓存命中率下降排查',
    content: '1. 查看热点 key 分布\n2. 检查缓存过期策略\n3. 分析内存使用情况\n4. 检查是否有缓存穿透\n5. 考虑增加缓存节点',
    category: '缓存',
    isFavorite: true,
    usageCount: 19
  },
  {
    id: 'guide-004',
    title: '消息队列积压处理方案',
    content: '1. 查看消费组堆积情况\n2. 检查消费者是否正常运行\n3. 分析消息生产速率变化\n4. 考虑增加消费者数量\n5. 检查是否有异常消息阻塞',
    category: '消息队列',
    isFavorite: false,
    usageCount: 12
  },
  {
    id: 'guide-005',
    title: '接口响应慢排查指南',
    content: '1. 查看接口响应时间趋势\n2. 分析慢查询日志\n3. 检查依赖服务状态\n4. 查看网络延迟情况\n5. 考虑缓存优化方案',
    category: '应用服务',
    isFavorite: false,
    usageCount: 22
  }
];

export const mockNotificationRules: NotificationRule[] = [
  {
    id: 'rule-001',
    name: '严重告警立即通知',
    enabled: true,
    level: ['P0', 'P1'],
    channels: ['push', 'sms', 'phone'],
    quietHours: {
      start: '22:00',
      end: '08:00'
    }
  },
  {
    id: 'rule-002',
    name: '普通告警推送通知',
    enabled: true,
    level: ['P2', 'P3'],
    channels: ['push']
  },
  {
    id: 'rule-003',
    name: '值班期间全量通知',
    enabled: true,
    level: ['P0', 'P1', 'P2', 'P3'],
    channels: ['push', 'sms']
  }
];

export const getReviewStats = () => {
  return {
    totalAlerts: 156,
    avgResponseTime: 12,
    avgResolveTime: 60,
    resolvedRate: 95,
    mttr: 45,
    p0Count: 5
  };
};
