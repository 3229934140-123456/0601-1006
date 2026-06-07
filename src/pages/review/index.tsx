import React, { useState } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { mockReviewItems, mockTroubleshootingGuides, getReviewStats } from '@/data/review';
import type { ReviewItem, TroubleshootingGuide } from '@/types';
import styles from './index.module.scss';

const ReviewPage: React.FC = () => {
  const stats = getReviewStats();
  const [guides, setGuides] = useState(mockTroubleshootingGuides);

  const handleFavoriteToggle = (guide: TroubleshootingGuide, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('[ReviewPage] 切换收藏', guide.id);
    setGuides(prev =>
      prev.map(g =>
        g.id === guide.id ? { ...g, isFavorite: !g.isFavorite } : g
      )
    );
    Taro.showToast({
      title: guide.isFavorite ? '已取消收藏' : '已收藏',
      icon: 'none'
    });
  };

  const handleReviewClick = (review: ReviewItem) => {
    console.log('[ReviewPage] 查看复盘详情', review.id);
    Taro.showToast({
      title: '查看复盘详情',
      icon: 'none'
    });
  };

  const handleNotificationClick = () => {
    console.log('[ReviewPage] 跳转到通知规则');
    Taro.navigateTo({
      url: '/pages/notification/index'
    });
  };

  const [showAllGuides, setShowAllGuides] = useState(false);

  const handleViewAllGuides = () => {
    console.log('[ReviewPage] 查看全部排查指南');
    setShowAllGuides(prev => !prev);
    Taro.showToast({
      title: showAllGuides ? '已收起' : '显示全部',
      icon: 'none'
    });
  };

  const metricData = [
    { label: 'P0 告警', value: stats.p0Count, percent: 100, color: '#F53F3F' },
    { label: 'P1 告警', value: 23, percent: 75, color: '#FF7D00' },
    { label: 'P2 告警', value: 56, percent: 50, color: '#FF9A2E' },
    { label: 'P3 告警', value: 72, percent: 35, color: '#165DFF' }
  ];

  const displayGuides = showAllGuides ? guides : guides.filter(g => g.isFavorite);

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <View style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text className={styles.headerTitle}>复盘中心</Text>
            <Text className={styles.headerSubtitle}>统计分析，持续改进</Text>
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

        <View className={styles.statsGrid}>
          <View className={styles.statCard}>
            <Text className={styles.statValue}>
              {stats.totalAlerts}
              <Text className={styles.statUnit}>起</Text>
            </Text>
            <Text className={styles.statLabel}>本月告警</Text>
          </View>
          <View className={styles.statCard}>
            <Text className={styles.statValue}>
              {stats.avgResponseTime}
              <Text className={styles.statUnit}>分钟</Text>
            </Text>
            <Text className={styles.statLabel}>平均响应</Text>
          </View>
          <View className={styles.statCard}>
            <Text className={styles.statValue}>
              {stats.avgResolveTime}
              <Text className={styles.statUnit}>分钟</Text>
            </Text>
            <Text className={styles.statLabel}>平均解决</Text>
          </View>
          <View className={styles.statCard}>
            <Text className={styles.statValue}>
              {stats.resolvedRate}
              <Text className={styles.statUnit}>%</Text>
            </Text>
            <Text className={styles.statLabel}>解决率</Text>
          </View>
        </View>
      </View>

      <View className={styles.content}>
        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>告警等级分布</Text>
          </View>
          <View className={styles.metricsChart}>
            {metricData.map((metric, index) => (
              <View key={index} className={styles.metricRow}>
                <Text className={styles.metricLabel}>{metric.label}</Text>
                <View className={styles.metricBar}>
                  <View
                    className={styles.metricFill}
                    style={{ width: `${metric.percent}%`, background: metric.color }}
                  />
                </View>
                <Text className={styles.metricValue}>{metric.value} 起</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>复盘报告</Text>
            <Text className={styles.sectionMore}>查看全部</Text>
          </View>

          {mockReviewItems.map((review: ReviewItem) => (
            <View
              key={review.id}
              className={styles.reviewCard}
              onClick={() => handleReviewClick(review)}
            >
              <Text className={styles.reviewTitle}>{review.title}</Text>
              <Text className={styles.reviewSummary}>{review.summary}</Text>
              <View className={styles.reviewStats}>
                <View className={styles.reviewStatItem}>
                  <Text className={styles.reviewStatValue}>{review.alertCount}</Text>
                  <Text className={styles.reviewStatLabel}>告警数</Text>
                </View>
                <View className={styles.reviewStatItem}>
                  <Text className={styles.reviewStatValue}>{review.avgResponseTime}分</Text>
                  <Text className={styles.reviewStatLabel}>平均响应</Text>
                </View>
                <View className={styles.reviewStatItem}>
                  <Text className={styles.reviewStatValue}>{review.avgResolveTime}分</Text>
                  <Text className={styles.reviewStatLabel}>平均解决</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>常用排查指南</Text>
            <Text className={styles.sectionMore} onClick={handleViewAllGuides}>
              {showAllGuides ? '收起' : '全部'}
            </Text>
          </View>

          <View className={styles.guideList}>
            {displayGuides.map((guide: TroubleshootingGuide) => (
              <View key={guide.id} className={styles.guideItem}>
                <View className={styles.guideContent}>
                  <Text className={styles.guideTitle}>{guide.title}</Text>
                  <View className={styles.guideMeta}>
                    <Text className={styles.guideCategory}>{guide.category}</Text>
                    <Text className={styles.guideUsage}>使用 {guide.usageCount} 次</Text>
                  </View>
                </View>
                <View
                  className={`${styles.favoriteIcon} ${guide.isFavorite ? styles.active : ''}`}
                  onClick={(e) => handleFavoriteToggle(guide, e)}
                />
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

export default ReviewPage;
