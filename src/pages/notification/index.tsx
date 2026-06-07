import React, { useState } from 'react';
import { View, Text, Picker } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useNotificationStore } from '@/stores/notificationStore';
import type { AlertLevel } from '@/types';
import styles from './index.module.scss';

const NotificationPage: React.FC = () => {
  const {
    rules,
    dndEnabled,
    dndStartTime,
    dndEndTime,
    dndDays,
    channels,
    toggleRule,
    toggleDnd,
    setDndTime,
    toggleDndDay,
    toggleChannel
  } = useNotificationStore();

  const dayLabels = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

  const getRuleLevelText = (levels: AlertLevel[]) => {
    return levels.join(' / ');
  };

  const handleRuleClick = (rule: typeof rules[0]) => {
    console.log('[Notification] 点击规则详情', rule.id);
    Taro.showToast({
      title: '规则详情功能开发中',
      icon: 'none'
    });
  };

  const handleStartTimeChange = (e: any) => {
    const newStartTime = e.detail.value;
    console.log('[Notification] 修改开始时间', newStartTime);
    setDndTime(newStartTime, dndEndTime);
    Taro.showToast({
      title: '时间已更新',
      icon: 'success'
    });
  };

  const handleEndTimeChange = (e: any) => {
    const newEndTime = e.detail.value;
    console.log('[Notification] 修改结束时间', newEndTime);
    setDndTime(dndStartTime, newEndTime);
    Taro.showToast({
      title: '时间已更新',
      icon: 'success'
    });
  };

  const handleDayToggle = (index: number) => {
    console.log('[Notification] 切换日期', dayLabels[index]);
    toggleDndDay(index);
  };

  const channelNames: Record<string, string> = {
    push: '推送通知',
    sms: '短信通知',
    phone: '电话通知',
    email: '邮件通知'
  };

  const escalationRules = [
    { level: 'P0 级告警', time: '5 分钟未响应', desc: '自动升级给技术主管，同时发送短信和电话通知' },
    { level: 'P1 级告警', time: '15 分钟未响应', desc: '自动升级给团队负责人，发送推送和短信通知' },
    { level: 'P2 级告警', time: '30 分钟未响应', desc: '自动升级给值班组长，发送推送通知' }
  ];

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.title}>通知规则</Text>
        <Text className={styles.subtitle}>管理告警通知方式和免打扰设置</Text>
      </View>

      <View className={styles.dndCard}>
        <View className={styles.dndHeader}>
          <Text className={styles.dndTitle}>免打扰模式</Text>
          <View
            className={`${styles.dndSwitch} ${dndEnabled ? styles.active : ''}`}
            onClick={toggleDnd}
          />
        </View>

        <View className={styles.dndTime}>
          <Text className={styles.dndLabel}>开始时间</Text>
          <Picker mode="time" value={dndStartTime} onChange={handleStartTimeChange}>
            <View style={{ display: 'flex', alignItems: 'center' }}>
              <Text className={styles.dndValue}>{dndStartTime}</Text>
              <View className={styles.arrowIcon} />
            </View>
          </Picker>
        </View>

        <View className={styles.dndTime}>
          <Text className={styles.dndLabel}>结束时间</Text>
          <Picker mode="time" value={dndEndTime} onChange={handleEndTimeChange}>
            <View style={{ display: 'flex', alignItems: 'center' }}>
              <Text className={styles.dndValue}>{dndEndTime}</Text>
              <View className={styles.arrowIcon} />
            </View>
          </Picker>
        </View>

        <View className={styles.dndDays}>
          {dayLabels.map((day, index) => (
            <View
              key={day}
              className={`${styles.dayTag} ${dndDays[index] ? styles.active : ''}`}
              onClick={() => handleDayToggle(index)}
            >
              <Text>{day}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={{ padding: '0 32rpx' }}>
        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <View className={styles.sectionTitle}>
              <View className={styles.titleDot} />
              <Text>告警等级通知</Text>
            </View>
          </View>
          {rules.map((rule) => (
            <View
              key={rule.id}
              className={styles.ruleItem}
              onClick={() => handleRuleClick(rule)}
            >
              <View className={`${styles.ruleIcon} ${styles['level' + rule.level[0]]}`}>
                <Text className={`${styles.iconText} ${styles['level' + rule.level[0]]}`}>
                  {rule.level.length > 1 ? `${rule.level[0]}+` : rule.level[0]}
                </Text>
              </View>
              <View className={styles.ruleInfo}>
                <Text className={styles.ruleName}>{rule.name}</Text>
                <Text className={styles.ruleDesc}>
                  {getRuleLevelText(rule.level)} · {rule.channels.length} 种通知渠道
                </Text>
              </View>
              <View
                className={`${styles.ruleSwitch} ${rule.enabled ? styles.active : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleRule(rule.id);
                }}
              />
            </View>
          ))}
        </View>

        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <View className={styles.sectionTitle}>
              <View className={styles.titleDot} />
              <Text>通知渠道</Text>
            </View>
          </View>
          {Object.keys(channels).map((channel) => (
            <View key={channel} className={styles.channelItem}>
              <View className={styles.channelIcon}>
                <Text style={{ fontSize: '24rpx', color: '#165DFF', fontWeight: 'bold' }}>
                  {channel === 'push' ? '推' :
                   channel === 'sms' ? '信' :
                   channel === 'phone' ? '话' : '邮'}
                </Text>
              </View>
              <Text className={styles.channelName}>
                {channelNames[channel]}
              </Text>
              <View
                className={`${styles.channelSwitch} ${channels[channel as keyof typeof channels] ? styles.active : ''}`}
                onClick={() => toggleChannel(channel as keyof typeof channels)}
              />
            </View>
          ))}
        </View>

        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <View className={styles.sectionTitle}>
              <View className={styles.titleDot} />
              <Text>升级提醒规则</Text>
            </View>
          </View>
          {escalationRules.map((item, index) => (
            <View
              key={index}
              className={styles.escalationItem}
              onClick={() => {
                Taro.showToast({
                  title: '升级规则详情',
                  icon: 'none'
                });
              }}
            >
              <View className={styles.escalationHeader}>
                <Text className={styles.escalationLevel}>{item.level}</Text>
                <Text className={styles.escalationTime}>{item.time}</Text>
              </View>
              <Text className={styles.escalationDesc}>{item.desc}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default NotificationPage;
