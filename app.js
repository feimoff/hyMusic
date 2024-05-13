// app.js
App({
  globalData: {
    screenWidth: 375,
    screenHeight: 667,
    statusHeight: 20, //状态栏高度
    contentHeight: 500
  },
  onLaunch() {
    // 1.获取设备的信息
    wx.getSystemInfo({
      success: (res) => {
        this.globalData.screenWidth = res.screenWidth
        this.globalData.screenHeight = res.screenHeight
        this.globalData.statusHeight = res.statusBarHeight
        // 内容高度 = 屏幕总高度 - 状态栏高度
        // 微信小程序导航栏是44的高度
        this.globalData.contentHeight = res.screenHeight - res.statusBarHeight - 44
      },
    })

    wx.cloud.init({
      env: "music-db-test-0g2cqilqa6f7995b",
      traceUser: true
    })
  }
})