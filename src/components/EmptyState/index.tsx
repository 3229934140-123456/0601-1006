import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

interface EmptyStateProps {
  title?: string;
  description?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = '暂无数据',
  description = ''
}) => {
  return (
    <View className={styles.empty}>
      <View className={styles.icon}>
        <View className={styles.iconCircle}>
          <View className={styles.iconLine} />
          <View className={styles.iconDot} />
        </View>
      </View>
      <Text className={styles.title}>{title}</Text>
      {description && <Text className={styles.description}>{description}</Text>}
    </View>
  );
};

export default EmptyState;
