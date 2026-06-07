export const formatTime = (timeStr: string): string => {
  const date = new Date(timeStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 7) return `${days}天前`;

  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');

  return `${month}-${day} ${hour}:${minute}`;
};

export const formatDuration = (minutes: number): string => {
  if (minutes < 60) return `${minutes}分钟`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours < 24) return `${hours}小时${mins > 0 ? mins + '分钟' : ''}`;
  const days = Math.floor(hours / 24);
  const remainHours = hours % 24;
  return `${days}天${remainHours > 0 ? remainHours + '小时' : ''}`;
};

export const formatDateTime = (timeStr: string): string => {
  const date = new Date(timeStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hour}:${minute}`;
};

export const getLevelColor = (level: string): string => {
  const colorMap: Record<string, string> = {
    P0: '#F53F3F',
    P1: '#FF7D00',
    P2: '#FF9A2E',
    P3: '#165DFF'
  };
  return colorMap[level] || '#165DFF';
};

export const getLevelBgColor = (level: string): string => {
  const colorMap: Record<string, string> = {
    P0: 'rgba(245, 63, 63, 0.12)',
    P1: 'rgba(255, 125, 0, 0.12)',
    P2: 'rgba(255, 154, 46, 0.12)',
    P3: 'rgba(22, 93, 255, 0.12)'
  };
  return colorMap[level] || 'rgba(22, 93, 255, 0.12)';
};

export const getStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    pending: '待处理',
    acknowledged: '已确认',
    processing: '处理中',
    resolved: '已解决'
  };
  return statusMap[status] || status;
};

export const getStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    pending: '#F53F3F',
    acknowledged: '#FF7D00',
    processing: '#165DFF',
    resolved: '#00B42A'
  };
  return colorMap[status] || '#86909C';
};
