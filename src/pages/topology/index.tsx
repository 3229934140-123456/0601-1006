import React from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { mockNodes, mockServiceChanges } from '@/data/topology';
import { formatTime } from '@/utils/format';
import type { ServiceChange } from '@/types';
import styles from './index.module.scss';

const TopologyPage: React.FC = () => {
  const errorNodes = mockNodes.filter(n => n.status === 'error').length;
  const warningNodes = mockNodes.filter(n => n.status === 'warning').length;
  const normalNodes = mockNodes.filter(n => n.status === 'normal').length;

  const nodePositions = [
    { id: 'gateway', x: 280, y: 20 },
    { id: 'order', x: 80, y: 140 },
    { id: 'payment', x: 260, y: 140 },
    { id: 'user', x: 440, y: 140 },
    { id: 'product', x: 80, y: 260 },
    { id: 'search', x: 440, y: 260 },
    { id: 'mysql', x: 180, y: 380 },
    { id: 'mysql-slave', x: 380, y: 380 },
    { id: 'redis', x: 80, y: 380 },
    { id: 'kafka', x: 480, y: 380 }
  ];

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      gateway: 'GW',
      service: 'SVC',
      database: 'DB',
      cache: 'RED',
      mq: 'MQ'
    };
    return labels[type] || type;
  };

  const getChangeTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      deploy: '发布',
      config: '配置',
      rollback: '回滚'
    };
    return labels[type] || type;
  };

  const handleNodeClick = (nodeId: string) => {
    console.log('[TopologyPage] 点击节点', nodeId);
    Taro.showToast({
      title: `查看 ${nodeId} 详情`,
      icon: 'none'
    });
  };

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.headerTitle}>服务拓扑</Text>
        <Text className={styles.headerSubtitle}>实时监控服务健康状态</Text>

        <View className={styles.statsRow}>
          <View className={styles.statItem}>
            <Text className={`${styles.statValue} ${'error'}`}>{errorNodes}</Text>
            <Text className={styles.statLabel}>异常</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={`${styles.statValue} ${'warning'}`}>{warningNodes}</Text>
            <Text className={styles.statLabel}>警告</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={`${styles.statValue} ${'normal'}`}>{normalNodes}</Text>
            <Text className={styles.statLabel}>正常</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{mockNodes.length}</Text>
            <Text className={styles.statLabel}>服务总数</Text>
          </View>
        </View>
      </View>

      <View className={styles.content}>
        <View className={styles.topologyCard}>
          <Text className={styles.cardTitle}>系统架构概览</Text>
          <View className={styles.topologyView}>
            {nodePositions.map(pos => {
              const node = mockNodes.find(n => n.id === pos.id);
              if (!node) return null;
              return (
                <View
                  key={node.id}
                  className={`${styles.node} ${styles[node.status]}`}
                  style={{ left: `${pos.x}rpx`, top: `${pos.y}rpx` }}
                  onClick={() => handleNodeClick(node.id)}
                >
                  <View className={`${styles.nodeIcon} ${styles[node.type]}`}>
                    {getTypeLabel(node.type)}
                  </View>
                  <Text className={styles.nodeName}>{node.name}</Text>
                  {node.alertCount > 0 && (
                    <View className={styles.nodeAlertBadge}>{node.alertCount}</View>
                  )}
                </View>
              );
            })}
          </View>

          <View className={styles.legend}>
            <View className={styles.legendItem}>
              <View className={`${styles.legendDot} ${styles.error}`} />
              <Text className={styles.legendText}>异常</Text>
            </View>
            <View className={styles.legendItem}>
              <View className={`${styles.legendDot} ${styles.warning}`} />
              <Text className={styles.legendText}>警告</Text>
            </View>
            <View className={styles.legendItem}>
              <View className={`${styles.legendDot} ${styles.normal}`} />
              <Text className={styles.legendText}>正常</Text>
            </View>
          </View>
        </View>

        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>最近变更</Text>
            <Text className={styles.sectionMore}>查看全部</Text>
          </View>

          {mockServiceChanges.slice(0, 3).map((change: ServiceChange) => (
            <View key={change.id} className={styles.changeItem}>
              <View className={`${styles.changeType} ${styles[change.type]}`}>
                {getChangeTypeLabel(change.type)}
              </View>
              <View className={styles.changeContent}>
                <Text className={styles.changeTitle}>{change.service}</Text>
                <Text className={styles.changeDesc}>{change.description}</Text>
                <View className={styles.changeMeta}>
                  <Text className={styles.changeOperator}>操作人：{change.operator}</Text>
                  <Text className={styles.changeTime}>{formatTime(change.time)}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default TopologyPage;
