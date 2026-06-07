import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';

interface StatusTagProps {
  type: 'level' | 'status' | 'success' | 'warning' | 'error' | 'info';
  text: string;
  level?: 'P0' | 'P1' | 'P2' | 'P3';
  size?: 'small' | 'medium' | 'large';
}

const StatusTag: React.FC<StatusTagProps> = ({ type, text, level, size = 'medium' }) => {
  const getLevelClass = () => {
    if (type !== 'level') return '';
    switch (level) {
      case 'P0': return styles.levelP0;
      case 'P1': return styles.levelP1;
      case 'P2': return styles.levelP2;
      case 'P3': return styles.levelP3;
      default: return styles.levelP3;
    }
  };

  const getTypeClass = () => {
    switch (type) {
      case 'success': return styles.success;
      case 'warning': return styles.warning;
      case 'error': return styles.error;
      case 'info': return styles.info;
      default: return '';
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case 'small': return styles.small;
      case 'large': return styles.large;
      default: return styles.medium;
    }
  };

  return (
    <View className={classnames(
      styles.tag,
      getLevelClass(),
      getTypeClass(),
      getSizeClass()
    )}>
      <Text className={styles.text}>{text}</Text>
    </View>
  );
};

export default StatusTag;
