import type { TopologyNode, TopologyEdge, ServiceChange } from '@/types';

const now = Date.now();

export const mockNodes: TopologyNode[] = [
  { id: 'gateway', name: 'API Gateway', type: 'gateway', status: 'normal', alertCount: 0 },
  { id: 'order', name: '订单服务', type: 'service', status: 'error', alertCount: 2 },
  { id: 'payment', name: '支付服务', type: 'service', status: 'error', alertCount: 1 },
  { id: 'user', name: '用户服务', type: 'service', status: 'warning', alertCount: 1 },
  { id: 'product', name: '商品服务', type: 'service', status: 'normal', alertCount: 0 },
  { id: 'search', name: '搜索服务', type: 'service', status: 'warning', alertCount: 1 },
  { id: 'mysql', name: 'MySQL 主库', type: 'database', status: 'warning', alertCount: 1 },
  { id: 'mysql-slave', name: 'MySQL 从库', type: 'database', status: 'warning', alertCount: 0 },
  { id: 'redis', name: 'Redis 集群', type: 'cache', status: 'warning', alertCount: 1 },
  { id: 'kafka', name: 'Kafka 集群', type: 'mq', status: 'error', alertCount: 1 }
];

export const mockEdges: TopologyEdge[] = [
  { source: 'gateway', target: 'order' },
  { source: 'gateway', target: 'payment' },
  { source: 'gateway', target: 'user' },
  { source: 'gateway', target: 'product' },
  { source: 'gateway', target: 'search' },
  { source: 'order', target: 'payment' },
  { source: 'order', target: 'user' },
  { source: 'order', target: 'product' },
  { source: 'order', target: 'mysql' },
  { source: 'order', target: 'redis' },
  { source: 'order', target: 'kafka' },
  { source: 'payment', target: 'mysql' },
  { source: 'payment', target: 'redis' },
  { source: 'user', target: 'mysql' },
  { source: 'user', target: 'redis' },
  { source: 'product', target: 'mysql' },
  { source: 'product', target: 'redis' },
  { source: 'search', target: 'mysql-slave' },
  { source: 'mysql', target: 'mysql-slave' }
];

export const mockServiceChanges: ServiceChange[] = [
  {
    id: 'change-001',
    service: 'order-service',
    type: 'deploy',
    operator: '张伟',
    time: new Date(now - 30 * 60 * 1000).toISOString(),
    description: '发布 v2.3.1 版本，优化订单创建流程'
  },
  {
    id: 'change-002',
    service: 'mysql-master',
    type: 'config',
    operator: '李明',
    time: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
    description: '调整 innodb_buffer_pool_size 参数'
  },
  {
    id: 'change-003',
    service: 'payment-service',
    type: 'deploy',
    operator: '孙磊',
    time: new Date(now - 3 * 60 * 60 * 1000).toISOString(),
    description: '发布 v1.8.0 版本，新增微信支付渠道'
  },
  {
    id: 'change-004',
    service: 'redis-cluster',
    type: 'config',
    operator: '王芳',
    time: new Date(now - 5 * 60 * 60 * 1000).toISOString(),
    description: '扩容 2 个 Redis 节点'
  },
  {
    id: 'change-005',
    service: 'user-service',
    type: 'rollback',
    operator: '周涛',
    time: new Date(now - 8 * 60 * 60 * 1000).toISOString(),
    description: '回滚 v3.1.0 版本，存在登录异常问题'
  }
];
