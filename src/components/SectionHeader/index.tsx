import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

interface SectionHeaderProps {
  title: string;
  extra?: React.ReactNode;
  showDivider?: boolean;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  extra,
  showDivider = false
}) => {
  return (
    <View className={styles.header}>
      <View className={styles.titleRow}>
        <View className={styles.titleBar} />
        <Text className={styles.title}>{title}</Text>
        {extra && <View className={styles.extra}>{extra}</View>}
      </View>
      {showDivider && <View className={styles.divider} />}
    </View>
  );
};

export default SectionHeader;
