import React from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import StatusTag from '@/components/StatusTag';
import { formatTime, getStatusText, getStatusColor } from '@/utils/format';
import type { Alert } from '@/types';
import styles from './index.module.scss';

interface AlertCardProps {
  alert: Alert;
  onClick?: (alert: Alert) => void;
  showActions?: boolean;
}

const AlertCard: React.FC<AlertCardProps> = ({ alert, onClick, showActions = true }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(alert);
    } else {
      Taro.navigateTo({
        url: `/pages/alert-detail/index?id=${alert.id}`
      });
    }
  };

  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    Taro.makePhoneCall({
      phoneNumber: alert.contact.phone
    }).catch(err => {
      console.error('[AlertCard] 拨打电话失败', err);
    });
  };

  const handleAcknowledge = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('[AlertCard] 确认告警', alert.id);
    Taro.showToast({
      title: '已确认',
      icon: 'success'
    });
  };

  return (
    <View
      className={classnames(styles.card, styles[`level${alert.level}`])}
      onClick={handleClick}
    >
      <View className={styles.header}>
        <View className={styles.left}>
          <StatusTag type="level" level={alert.level} text={alert.level} size="medium" />
          <View
            className={styles.statusDot}
            style={{ backgroundColor: getStatusColor(alert.status) }}
          />
          <Text className={styles.statusText}>{getStatusText(alert.status)}</Text>
        </View>
        {alert.isSilenced && (
          <View className={styles.silencedBadge}>
            <Text className={styles.silencedText}>已静默</Text>
          </View>
        )}
      </View>

      <Text className={styles.title}>{alert.title}</Text>
      <Text className={styles.service}>{alert.service}</Text>
      <Text className={styles.description}>{alert.description}</Text>

      <View className={styles.affectedRow}>
        <Text className={styles.affectedLabel}>影响服务：</Text>
        <View className={styles.affectedList}>
          {alert.affectedServices.slice(0, 3).map((service, index) => (
            <View key={index} className={styles.affectedTag}>
              <Text className={styles.affectedTagText}>{service}</Text>
            </View>
          ))}
          {alert.affectedServices.length > 3 && (
            <View className={styles.affectedMore}>
              <Text className={styles.affectedMoreText}>+{alert.affectedServices.length - 3}</Text>
            </View>
          )}
        </View>
      </View>

      <View className={styles.footer}>
        <View className={styles.timeRow}>
          <Text className={styles.timeText}>{formatTime(alert.triggerTime)}</Text>
        </View>
        <View className={styles.contactRow}>
          <Text className={styles.contactLabel}>联系人：</Text>
          <Text className={styles.contactName}>{alert.contact.name}</Text>
          <Text className={styles.contactRole}>({alert.contact.role})</Text>
        </View>
      </View>

      {showActions && alert.status === 'pending' && (
        <View className={styles.actions}>
          <View className={styles.actionBtn} onClick={handleCall}>
            <Text className={styles.actionBtnText}>拨打电话</Text>
          </View>
          <View className={classnames(styles.actionBtn, styles.primaryBtn)} onClick={handleAcknowledge}>
            <Text className={styles.primaryBtnText}>确认告警</Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default AlertCard;
