export default defineAppConfig({
  pages: [
    'pages/alerts/index',
    'pages/topology/index',
    'pages/records/index',
    'pages/duty/index',
    'pages/review/index',
    'pages/alert-detail/index',
    'pages/notification/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#165DFF',
    navigationBarTitleText: '运维告警',
    navigationBarTextStyle: 'white',
    backgroundColor: '#F2F3F5'
  },
  tabBar: {
    color: '#86909C',
    selectedColor: '#165DFF',
    backgroundColor: '#FFFFFF',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/alerts/index',
        text: '告警'
      },
      {
        pagePath: 'pages/topology/index',
        text: '拓扑'
      },
      {
        pagePath: 'pages/records/index',
        text: '记录'
      },
      {
        pagePath: 'pages/duty/index',
        text: '值班'
      },
      {
        pagePath: 'pages/review/index',
        text: '复盘'
      }
    ]
  }
})
