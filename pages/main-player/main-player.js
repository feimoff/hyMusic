import playerStore from "../../store/playerStore"
const app = getApp()

Page({
  data: {
    // 和状态栏相关
    pageTitles: ["歌曲", "歌词"],
    currentPage: 0,

    contentHeight: 0,
    statusHeight:0,

    id: "", // 歌曲id
    lyricInfos: [], // 歌词信息
    currentSong: {}, // 当前歌曲的信息
    durationTime: 0, // 播放时间
    currentPage: 0, // 当前页


  },
  onLoad(options) {
    // 0.获取设备信息
    this.setData({ 
      statusHeight: app.globalData.statusHeight,
      contentHeight: app.globalData.contentHeight
    })
    const lyricRes = wx.getStorageSync('lyricInfos')
    const currentRes = wx.getStorageSync('currentSong')
    if (!lyricRes.length && !currentRes) {
      console.log("发送");
      const id = "2124385868"
      playerStore.dispatch('playMusicWithSongIdAction', id)
      playerStore.onState('lyricInfos', this.handleLyricInfos)
      playerStore.onState('currentSong', this.handleCurrentSong)
    } else {
      this.setData({
        lyricInfos: lyricRes,
        currentSong: currentRes
      })
    }
  },
  // 通用函数
  handlePlayer(type, value) {
    this.setData({
      [type]: value
    })
    wx.setStorageSync(type, value)
  },
  // 处理歌词
  handleLyricInfos(value) {
    if (!value) return
    this.handlePlayer("lyricInfos", value)
  },
  // 处理当前歌曲
  handleCurrentSong(value) {
    if (!value) return
    this.handlePlayer("currentSong", value)
  },
  // 状态栏点击，切换歌曲/歌词
  onNavTabItemTap(event) {
    const index = event.currentTarget.dataset.index
    this.setData({
      currentPage: index
    })
  },
  // 点击切换轮播图
  onSwiperChange(event) {
    this.setData({ currentPage: event.detail.current })
  },
})