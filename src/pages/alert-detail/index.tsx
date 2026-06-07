import React, { useState } from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro, { useRouter, useDidShow } from '@tarojs/taro';
import { useAlertStore } from '@/stores/alertStore';
import { useRecordStore } from '@/stores/recordStore';
import { formatDateTime, formatTime } from '@/utils/format';
import type { HandleStep } from '@/types';
import styles from './index.module.scss';

const AlertDetailPage: React.FC = () => {
  const router = useRouter();
  const alertId = router.params.id || 'alert-001';

  const { getAlertById, acknowledgeAlert, silenceAlert, unsilenceAlert } = useAlertStore();
  const { getRecordByAlertId, addStep, addScreenshot } = useRecordStore();

  const alert = getAlertById(alertId);
  const record = getRecordByAlertId(alertId);
  const [, forceUpdate] = useState(0);

  useDidShow(() => {
    forceUpdate(n => n + 1);
  });

  if (!alert) {
    return (
      <View className={styles.page}>
        <View style={{ padding: '100rpx', textAlign: 'center' }}>
          <Text>告警不存在</Text>
        </View>
      </View>
    );
  }

  const isSilenced = alert.isSilenced;

  const handleCall = () => {
    console.log('[AlertDetail] 拨打联系人电话', alert.contact.phone);
    Taro.makePhoneCall({
      phoneNumber: alert.contact.phone
    }).catch(err => {
      console.error('[AlertDetail] 拨打电话失败', err);
    });
  };

  const handleAcknowledge = () => {
    console.log('[AlertDetail] 确认告警', alert.id);
    acknowledgeAlert(alert.id);
    addStep(alert.id, '已确认告警，开始处理', '当前值班人');
    Taro.showToast({
      title: '已确认告警',
      icon: 'success'
    });
  };

  const handleSilence = () => {
    console.log('[AlertDetail] 静默告警', alert.id);
    Taro.showActionSheet({
      itemList: ['静默 30 分钟', '静默 1 小时', '静默 2 小时', '取消静默']
    }).then(res => {
      const options = [
        { label: '静默 30 分钟', minutes: 30 },
        { label: '静默 1 小时', minutes: 60 },
        { label: '静默 2 小时', minutes: 120 },
        { label: '取消静默', minutes: 0 }
      ];
      const selected = options[res.tapIndex];

      if (selected.minutes === 0) {
        unsilenceAlert(alert.id);
        Taro.showToast({
          title: '已取消静默',
          icon: 'success'
        });
      } else {
        silenceAlert(alert.id, selected.minutes);
        Taro.showToast({
          title: `已${selected.label}`,
          icon: 'success'
        });
      }
    }).catch(err => {
      console.error('[AlertDetail] 静默操作取消', err);
    });
  };

  const handleUploadScreenshot = () => {
    console.log('[AlertDetail] 上传截图');
    Taro.chooseImage({
      count: 9,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        console.log('[AlertDetail] 选择图片成功', res.tempFilePaths);
        res.tempFilePaths.forEach((path: string) => {
          addScreenshot(alert.id, path);
        });
        Taro.showToast({
          title: `已添加 ${res.tempFilePaths.length} 张截图`,
          icon: 'success'
        });
      },
      fail: (err) => {
        console.error('[AlertDetail] 选择图片失败', err);
      }
    });
  };

  const handleAddStep = () => {
    console.log('[AlertDetail] 添加处理步骤');
    Taro.showModal({
      title: '记录处理步骤',
      editable: true,
      placeholderText: '请输入处理内容...',
      success: (res) => {
        if (res.confirm && res.content) {
          console.log('[AlertDetail] 添加步骤内容:', res.content);
          addStep(alert.id, res.content, '当前值班人');
          Taro.showToast({
            title: '已记录',
            icon: 'success'
          });
        }
      }
    });
  };

  const handleRelatedTicket = () => {
    console.log('[AlertDetail] 关联故障单');
    Taro.showToast({
      title: '关联故障单功能',
      icon: 'none'
    });
  };

  const handleUpgrade = () => {
    console.log('[AlertDetail] 推送升级提醒');
    Taro.showModal({
      title: '升级提醒',
      content: '确定要推送升级提醒给上级吗？',
      success: (res) => {
        if (res.confirm) {
          console.log('[AlertDetail] 已推送升级提醒');
          addStep(alert.id, '已推送升级提醒，等待上级响应', '当前值班人');
          Taro.showToast({
            title: '已推送升级提醒',
            icon: 'success'
          });
        }
      }
    });
  };

  const steps: HandleStep[] = record?.steps || [
    {
      id: 'step-0',
      time: alert.triggerTime,
      operator: '系统',
      content: '告警触发',
      type: 'acknowledge'
    }
  ];

  const screenshots = record?.screenshots || [];

  const getStepTypeText = (type: string) => {
    const map: Record<string, string> = {
      acknowledge: '确认告警',
      operation: '操作处理',
      comment: '备注说明',
      resolve: '问题解决'
    };
    return map[type] || type;
  };

  return (
    <View className={styles.page}>
      <View className={`${styles.alertHeader} ${styles['level' + alert.level]}`}>
        <View className={styles.alertLevel}>
          <Text>{alert.level} 级告警</Text>
        </View>
        <Text className={styles.alertTitle}>{alert.title}</Text>
        <Text className={styles.alertService}>{alert.service}</Text>
        <View style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Text className={styles.alertTime}>触发时间：{formatDateTime(alert.triggerTime)}</Text>
          {isSilenced && (
            <View style={{
              padding: '4rpx 16rpx',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '8rpx'
            }}>
              <Text style={{ fontSize: '22rpx', color: '#fff' }}>已静默</Text>
            </View>
          )}
        </View>
      </View>

      <View className={styles.content}>
        <View className={styles.section}>
          <View className={styles.sectionTitle}>
            <View className={styles.titleBar} />
            <Text>告警描述</Text>
          </View>
          <Text className={styles.descriptionText}>{alert.description}</Text>
        </View>

        <View className={styles.section}>
          <View className={styles.sectionTitle}>
            <View className={styles.titleBar} />
            <Text>影响服务</Text>
          </View>
          <View className={styles.affectedList}>
            {alert.affectedServices.map((service, index) => (
              <View key={index} className={styles.affectedTag}>
                <Text className={styles.affectedTagText}>{service}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.section}>
          <View className={styles.sectionTitle}>
            <View className={styles.titleBar} />
            <Text>一线联系人</Text>
          </View>
          <View className={styles.contactCard}>
            <View className={styles.contactAvatar}>
              <Text className={styles.avatarText}>{alert.contact.name.charAt(0)}</Text>
            </View>
            <View className={styles.contactInfo}>
              <Text className={styles.contactName}>{alert.contact.name}</Text>
              <Text className={styles.contactRole}>{alert.contact.role}</Text>
            </View>
            <View className={styles.callBtn} onClick={handleCall}>
              <View className={styles.callIcon} />
            </View>
          </View>
        </View>

        <View className={styles.section}>
          <View className={styles.sectionTitle}>
            <View className={styles.titleBar} />
            <Text>处理记录</Text>
            <Text
              style={{
                marginLeft: 'auto',
                fontSize: '24rpx',
                color: '#165DFF',
                fontWeight: 'normal'
              }}
              onClick={handleAddStep}
            >
              添加步骤
            </Text>
          </View>
          <View className={styles.stepTimeline}>
            {steps.map((step: HandleStep) => (
              <View key={step.id} className={styles.stepItem}>
                <View className={`${styles.stepDot} ${styles[step.type]}`} />
                <View className={styles.stepContent}>
                  <View className={styles.stepHeader}>
                    <Text className={styles.stepOperator}>
                      {step.operator} · {getStepTypeText(step.type)}
                    </Text>
                    <Text className={styles.stepTime}>{formatTime(step.time)}</Text>
                  </View>
                  <Text className={styles.stepText}>{step.content}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.section}>
          <View className={styles.sectionTitle}>
            <View className={styles.titleBar} />
            <Text>相关截图</Text>
            <Text
              style={{
                marginLeft: 'auto',
                fontSize: '24rpx',
                color: '#165DFF',
                fontWeight: 'normal'
              }}
              onClick={handleUploadScreenshot}
            >
              上传
            </Text>
          </View>
          <View className={styles.screenshotList}>
            {screenshots.map((src, index) => (
              <Image
                key={index}
                className={styles.screenshotItem}
                src={src}
                mode="aspectFill"
                onClick={() => {
                  Taro.previewImage({
                    urls: screenshots,
                    current: src
                  });
                }}
              />
            ))}
            <View className={`${styles.screenshotItem} ${styles.addBtn}`} onClick={handleUploadScreenshot}>
              <Text className={styles.plusIcon}>+</Text>
            </View>
          </View>
        </View>

        <View className={styles.section}>
          <View className={styles.sectionTitle}>
            <View className={styles.titleBar} />
            <Text>更多信息</Text>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>告警状态</Text>
            <Text className={styles.infoValue}>
              {alert.status === 'pending' ? '待处理' :
               alert.status === 'acknowledged' ? '已确认' :
               alert.status === 'processing' ? '处理中' : '已解决'}
            </Text>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>关联故障单</Text>
            <Text className={styles.infoValue} onClick={handleRelatedTicket}>
              {record?.relatedTicket || '点击关联'}
            </Text>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>静默状态</Text>
            <Text
              className={styles.infoValue}
              style={{ color: isSilenced ? '#F53F3F' : '#00B42A' }}
              onClick={handleSilence}
            >
              {isSilenced ? '已静默' : '未静默'}
            </Text>
          </View>
        </View>
      </View>

      <View className={styles.bottomActions}>
        <View className={styles.actionBtn} onClick={handleSilence}>
          <Text className={styles.actionBtnText}>{isSilenced ? '取消静默' : '静默通知'}</Text>
        </View>
        <View className={styles.actionBtn} onClick={handleUpgrade}>
          <Text className={styles.actionBtnText}>升级提醒</Text>
        </View>
        {alert.status === 'pending' && (
          <View className={`${styles.actionBtn} ${styles.primary}`} onClick={handleAcknowledge}>
            <Text className={styles.actionBtnText}>确认告警</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default AlertDetailPage;
