import React, { useState } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { getCurrentDuty, mockDutySchedule, mockDutyPersons } from '@/data/duty';
import type { DutyPerson, DutySchedule } from '@/types';
import styles from './index.module.scss';

const DutyPage: React.FC = () => {
  const currentDuty = getCurrentDuty();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const weekDays = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i - 3);
    weekDays.push({
      date: date.toISOString().split('T')[0],
      dayName: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][date.getDay()],
      dayNum: date.getDate(),
      isToday: date.toDateString() === today.toDateString()
    });
  }

  const handleCall = (person: DutyPerson) => {
    console.log('[DutyPage] 拨打电话', person.phone);
    Taro.makePhoneCall({
      phoneNumber: person.phone
    }).catch(err => {
      console.error('[DutyPage] 拨打电话失败', err);
    });
  };

  const handleSwitchDuty = () => {
    Taro.showActionSheet({
      itemList: mockDutyPersons.map(p => `${p.name} - ${p.role}`)
    }).then(res => {
      const person = mockDutyPersons[res.tapIndex];
      Taro.showModal({
        title: '确认换班',
        content: `确定要将值班人员更换为 ${person.name} 吗？`,
        success: (modalRes) => {
          if (modalRes.confirm) {
            console.log('[DutyPage] 更换值班人', person.name);
            Taro.showToast({
              title: '换班成功',
              icon: 'success'
            });
          }
        }
      });
    }).catch(err => {
      console.error('[DutyPage] 换班操作取消', err);
    });
  };

  const formatWeekDay = (dateStr: string) => {
    const date = new Date(dateStr);
    const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return weekDays[date.getDay()];
  };

  const formatDateShort = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.headerTitle}>值班表</Text>
        <Text className={styles.headerSubtitle}>查看值班安排，快速联系值班人员</Text>
      </View>

      <View className={styles.currentDutyCard}>
        <Text className={styles.cardTitle}>今日值班</Text>

        <View className={styles.dutyItem}>
          <View className={styles.dutyAvatar}>
            <Text className={styles.avatarText}>{currentDuty.dayShift.name.charAt(0)}</Text>
          </View>
          <View className={styles.dutyInfo}>
            <Text className={styles.dutyName}>{currentDuty.dayShift.name}</Text>
            <Text className={styles.dutyRole}>{currentDuty.dayShift.role}</Text>
            <Text className={styles.dutyType}>白班</Text>
          </View>
          <View className={styles.dutyActions}>
            <View
              className={`${styles.actionBtn} ${styles.call}`}
              onClick={() => handleCall(currentDuty.dayShift)}
            >
              <View className={styles.phoneIcon} />
            </View>
          </View>
        </View>

        <View className={styles.dutyItem}>
          <View className={styles.dutyAvatar}>
            <Text className={styles.avatarText}>{currentDuty.nightShift.name.charAt(0)}</Text>
          </View>
          <View className={styles.dutyInfo}>
            <Text className={styles.dutyName}>{currentDuty.nightShift.name}</Text>
            <Text className={styles.dutyRole}>{currentDuty.nightShift.role}</Text>
            <Text className={styles.dutyType}>夜班</Text>
          </View>
          <View className={styles.dutyActions}>
            <View
              className={`${styles.actionBtn} ${styles.call}`}
              onClick={() => handleCall(currentDuty.nightShift)}
            >
              <View className={styles.phoneIcon} />
            </View>
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>本周值班安排</Text>
          <View className={styles.switchBtn} onClick={handleSwitchDuty}>
            <Text>申请换班</Text>
          </View>
        </View>

        <View className={styles.weekNav}>
          {weekDays.map(day => (
            <View
              key={day.date}
              className={`${styles.weekDay} ${selectedDate === day.date ? styles.active : ''} ${day.isToday ? styles.today : ''}`}
              onClick={() => setSelectedDate(day.date)}
            >
              <Text className={styles.dayName}>{day.dayName}</Text>
              <Text className={styles.dayNum}>{day.dayNum}</Text>
            </View>
          ))}
        </View>

        <View className={styles.dutyScheduleList}>
          {mockDutySchedule.slice(0, 7).map((schedule: DutySchedule, index) => (
            <View key={index} className={styles.scheduleItem}>
              <View className={styles.scheduleDate}>
                <Text className={styles.scheduleDateText}>{formatDateShort(schedule.date)}</Text>
                <Text className={styles.scheduleDateWeek}>{formatWeekDay(schedule.date)}</Text>
              </View>
              <View className={styles.scheduleContent}>
                <View className={styles.shiftRow}>
                  <Text className={styles.shiftLabel}>白班</Text>
                  <Text className={styles.shiftPerson}>{schedule.dayShift.name}</Text>
                </View>
                <View className={styles.shiftRow}>
                  <Text className={styles.shiftLabel}>夜班</Text>
                  <Text className={styles.shiftPerson}>{schedule.nightShift.name}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default DutyPage;
