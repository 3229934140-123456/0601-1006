import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import AlertCard from '@/components/AlertCard';
import EmptyState from '@/components/EmptyState';
import { mockAlerts, getAlertStats } from '@/data/alerts';
import type { AlertLevel } from '@/types';
import styles from './index.module.scss';

type FilterType = 'all' | AlertLevel;

const AlertsPage: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const stats = getAlertStats();

  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: '全部' },
    { key: 'P0', label: 'P0 严重' },
    { key: 'P1', label: 'P1 高危' },
    { key: 'P2', label: 'P2 警告' },
    { key: 'P3', label: 'P3 提示' }
  ];

  const filteredAlerts = useMemo(() => {
    let result = [...mockAlerts];

    if (activeFilter !== 'all') {
      result = result.filter(alert => alert.level === activeFilter);
    }

    if (searchText.trim()) {
      const keyword = searchText.toLowerCase();
      result = result.filter(
        alert =>
          alert.title.toLowerCase().includes(keyword) ||
          alert.service.toLowerCase().includes(keyword) ||
          alert.description.toLowerCase().includes(keyword)
      );
    }

    return result.sort((a, b) => {
      const levelOrder = { P0: 0, P1: 1, P2: 2, P3: 3 };
      const levelDiff = levelOrder[a.level] - levelOrder[b.level];
      if (levelDiff !== 0) return levelDiff;
      return new Date(b.triggerTime).getTime() - new Date(a.triggerTime).getTime();
    });
  }, [searchText, activeFilter]);

  const pendingAlerts = filteredAlerts.filter(a => a.status === 'pending');
  const processingAlerts = filteredAlerts.filter(
    a => a.status === 'acknowledged' || a.status === 'processing'
  );
  const resolvedAlerts = filteredAlerts.filter(a => a.status === 'resolved');

  const handleFilterClick = (key: FilterType) => {
    setActiveFilter(key);
  };

  const handlePullDownRefresh = () => {
    console.log('[AlertsPage] 下拉刷新');
    setTimeout(() => {
      Taro.stopPullDownRefresh();
      Taro.showToast({
        title: '刷新成功',
        icon: 'success'
      });
    }, 1000);
  };

  const handleNotificationClick = () => {
    console.log('[AlertsPage] 跳转到通知规则');
    Taro.navigateTo({
      url: '/pages/notification/index'
    });
  };

  const handleAlertClick = (alertId: string) => {
    console.log('[AlertsPage] 跳转到告警详情', alertId);
    Taro.navigateTo({
      url: `/pages/alert-detail/index?id=${alertId}`
    });
  };

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <View style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text className={styles.headerTitle}>告警中心</Text>
            <Text className={styles.headerSubtitle}>实时监控系统运行状态</Text>
          </View>
          <View
            style={{
              width: '64rpx',
              height: '64rpx',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onClick={handleNotificationClick}
          >
            <Text style={{ fontSize: '28rpx', color: '#fff' }}>⚙</Text>
          </View>
        </View>

        <View className={styles.statsRow}>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{stats.pending}</Text>
            <Text className={styles.statLabel}>待处理</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{stats.processing}</Text>
            <Text className={styles.statLabel}>处理中</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{stats.resolved}</Text>
            <Text className={styles.statLabel}>已解决</Text>
          </View>
          <View className={`${styles.statItem} ${styles.highlight}`}>
            <Text className={styles.statValue}>{stats.p0Count}</Text>
            <Text className={styles.statLabel}>P0 告警</Text>
          </View>
        </View>
      </View>

      <View className={styles.searchBar}>
        <View className={styles.searchIcon} />
        <Input
          className={styles.searchInput}
          placeholder="搜索告警名称、服务..."
          value={searchText}
          onInput={e => setSearchText(e.detail.value)}
          confirmType="search"
        />
      </View>

      <ScrollView
        className={styles.filterBar}
        scrollX
        enhanced
        showScrollbar={false}
      >
        {filters.map(filter => (
          <View
            key={filter.key}
            className={`${styles.filterItem} ${activeFilter === filter.key ? styles.active : ''}`}
            onClick={() => handleFilterClick(filter.key)}
          >
            <Text>{filter.label}</Text>
          </View>
        ))}
      </ScrollView>

      <View className={styles.listContainer}>
        {filteredAlerts.length === 0 ? (
          <View className={styles.emptyWrap}>
            <EmptyState
              title="暂无告警"
              description={searchText ? '没有找到匹配的告警信息' : '当前没有符合条件的告警'}
            />
          </View>
        ) : (
          <>
            {pendingAlerts.length > 0 && (
              <>
                <View className={styles.sectionTitle}>
                  <Text>待处理</Text>
                  <Text className={styles.sectionCount}>{pendingAlerts.length} 条</Text>
                </View>
                {pendingAlerts.map(alert => (
                  <AlertCard key={alert.id} alert={alert} />
                ))}
              </>
            )}

            {processingAlerts.length > 0 && (
              <>
                <View className={styles.sectionTitle}>
                  <Text>处理中</Text>
                  <Text className={styles.sectionCount}>{processingAlerts.length} 条</Text>
                </View>
                {processingAlerts.map(alert => (
                  <AlertCard key={alert.id} alert={alert} />
                ))}
              </>
            )}

            {resolvedAlerts.length > 0 && (
              <>
                <View className={styles.sectionTitle}>
                  <Text>已解决</Text>
                  <Text className={styles.sectionCount}>{resolvedAlerts.length} 条</Text>
                </View>
                {resolvedAlerts.map(alert => (
                  <AlertCard key={alert.id} alert={alert} />
                ))}
              </>
            )}
          </>
        )}
      </View>
    </View>
  );
};

export default AlertsPage;
