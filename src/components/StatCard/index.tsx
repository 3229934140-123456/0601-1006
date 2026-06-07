import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';

interface StatCardProps {
  label: string;
  value: number | string;
  unit?: string;
  color?: 'primary' | 'success' | 'warning' | 'error' | 'info';
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'flat';
  trendValue?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  unit,
  color = 'primary',
  icon,
  trend,
  trendValue
}) => {
  return (
    <View className={classnames(styles.card, styles[color])}>
      {icon && <View className={styles.iconWrap}>{icon}</View>}
      <View className={styles.content}>
        <View className={styles.valueRow}>
          <Text className={styles.value}>{value}</Text>
          {unit && <Text className={styles.unit}>{unit}</Text>}
        </View>
        <Text className={styles.label}>{label}</Text>
        {trend && trendValue && (
          <View className={classnames(styles.trend, styles[trend])}>
            <Text className={styles.trendText}>{trendValue}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default StatCard;
