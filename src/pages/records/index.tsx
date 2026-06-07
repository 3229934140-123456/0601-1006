import React, { useState, useMemo } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import EmptyState from '@/components/EmptyState';
import { mockRecords, getRecordStats } from '@/data/records';
import { formatTime, formatDuration } from '@/utils/format';
import type { HandleRecord, HandleStep } from '@/types';
import styles from './index.module.scss';

type TabType = 'all' | 'processing' | 'resolved';

const RecordsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const stats = getRecordStats();

  const tabs: { key: TabType; label: string }[] = [
    { key: 'all', label: '全部' },
    { key: 'processing', label: '处理中' },
    { key: 'resolved', label: '已完成' }
  ];

  const filteredRecords = useMemo(() => {
    if (activeTab === 'all') return mockRecords;
    return mockRecords.filter(r => r.status === activeTab);
  }, [activeTab]);

  const getStepTypeText = (type: string) => {
    const map: Record<string, string> = {
      acknowledge: '确认告警',
      operation: '操作处理',
      comment: '备注说明',
      resolve: '问题解决'
    };
    return map[type] || type;
  };

  const handleRecordClick = (record: HandleRecord) => {
    console.log('[RecordsPage] 查看记录详情', record.id);
    Taro.navigateTo({
      url: `/pages/alert-detail/index?id=${record.alertId}`
    });
  };

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.headerTitle}>处理记录</Text>
        <Text className={styles.headerSubtitle}>追踪告警处理全流程</Text>

        <View className={styles.statsRow}>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{stats.total}</Text>
            <Text className={styles.statLabel}>总记录</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{stats.processing}</Text>
            <Text className={styles.statLabel}>处理中</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{stats.resolved}</Text>
            <Text className={styles.statLabel}>已解决</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{stats.avgDuration}</Text>
            <Text className={styles.statLabel}>平均耗时(分)</Text>
          </View>
        </View>
      </View>

      <View className={styles.content}>
        <View className={styles.filterBar}>
          {tabs.map(tab => (
            <View
              key={tab.key}
              className={`${styles.filterTab} ${activeTab === tab.key ? styles.active : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              <Text>{tab.label}</Text>
            </View>
          ))}
        </View>

        {filteredRecords.length === 0 ? (
          <View className={styles.emptyWrap}>
            <EmptyState
              title="暂无处理记录"
              description="当前没有符合条件的处理记录"
            />
          </View>
        ) : (
          filteredRecords.map((record: HandleRecord) => (
            <View
              key={record.id}
              className={styles.recordCard}
              onClick={() => handleRecordClick(record)}
            >
              <View className={styles.recordHeader}>
                <Text className={styles.recordTitle}>{record.alertTitle}</Text>
                <View className={`${styles.recordLevel} ${styles[record.level]}`}>
                  <Text>{record.level}</Text>
                </View>
              </View>

              <View className={styles.recordMeta}>
                <View className={styles.metaItem}>
                  <Text className={styles.metaLabel}>处理人：</Text>
                  <Text className={styles.metaValue}>{record.operator}</Text>
                </View>
                <View className={styles.metaItem}>
                  <Text className={styles.metaLabel}>开始时间：</Text>
                  <Text className={styles.metaValue}>{formatTime(record.startTime)}</Text>
                </View>
              </View>

              {record.steps.length > 0 && (
                <View className={styles.stepList}>
                  {record.steps.slice(0, 2).map((step: HandleStep) => (
                    <View key={step.id} className={styles.stepItem}>
                      <View className={`${styles.stepDot} ${styles[step.type]}`} />
                      <View className={styles.stepContent}>
                        <Text className={styles.stepText}>{step.content}</Text>
                        <View className={styles.stepMeta}>
                          <Text>{step.operator}</Text>
                          <Text>{formatTime(step.time)}</Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              )}

              <View className={styles.recordStatus}>
                <View className={`${styles.statusDot} ${styles[record.status]}`} />
                <Text className={`${styles.statusText} ${styles[record.status]}`}>
                  {record.status === 'processing' ? '处理中' : '已解决'}
                </Text>
                {record.duration && (
                  <Text className={styles.durationText}>
                    耗时 {formatDuration(record.duration)}
                  </Text>
                )}
              </View>
            </View>
          ))
        )}
      </View>
    </View>
  );
};

export default RecordsPage;
