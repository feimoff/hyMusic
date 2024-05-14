import playerStore, {
  audioContext
} from "../../store/playerStore"
import {
  throttle
} from 'underscore'
const app = getApp()
// 模式名称
const modeNames = ["order", "repeat", "random"]
Page({
  data: {
    stateKeys: ["id", "lyricInfos", "currentSong", "durationTime", "currentTime", "currentLyricText", "isPlaying", "playModeIndex", "currentLyricIndex"],
    // 和状态栏相关
    pageTitles: ["歌曲", "歌词"],
    currentPage: 0,
    // 设备信息
    contentHeight: 0,
    statusHeight: 0,
    // 滑块
    sliderValue: 0,

    id: "2124385868", // 歌曲id
    lyricInfos: [], // 歌词信息
    currentSong: {}, // 当前歌曲的信息
    durationTime: 0, // 播放时间
    currentPage: 0, // 当前页
    currentTime: 0, // 当前时间
    currentLyricText: "", // 当前歌词文本
    currentLyricIndex: -1, // 当前歌词索引
    lyricScrollTop: 0, // 歌词距离的高度

    playSongList: [], // 歌单列表
    playSongIndex: 0, // 当前歌曲所在列表的索引

    isPlaying: false, // 是否正在播放
    isWaiting: false, // 播放是否处于等待状态
    isSliderChanging: false, // 滑块是否正在滑动
  },
  onLoad(options) {
    // 0.获取设备信息
    this.setData({
      statusHeight: app.globalData.statusHeight,
      contentHeight: app.globalData.contentHeight
    })
    const id = options.id
    if (id) {
      playerStore.dispatch('playMusicWithSongIdAction', id)
    }
    playerStore.onStates(["playSongList", "playSongIndex"], this.getPlaySongInfosHandler)
    // stateKeys通过写成数组的形式可，好处：以一次性监听所有的属性
    playerStore.onStates(this.data.stateKeys, this.getPlayerInfosHandler)
  },

  updateProgress: throttle(function (currentTime) {
    if (this.data.isSliderChanging) return
    // 1.记录当前的时间 2.修改sliderValue
    const sliderValue = currentTime / this.data.durationTime * 100
    this.setData({
      currentTime,
      sliderValue
    })
  }, 800, {
    leading: false,
    trailing: false
  }),
  // 点击导航栏箭头返回上一级
  onNavBackTap() {
    wx.navigateBack()
  },
  // 滑块完成一次拖动后触发的事件
  // 松下手指的那一刻
  onSliderChange(event) {
    // 歌曲播放需要等待的标识
    this.data.isWaiting = true
    // 1.获取点击滑块位置对应的value
    const value = event.detail.value
    // 2.计算出要播放的位置时间
    const currentTime = value / 100 * this.data.durationTime
    // 3.设置播放器, 播放计算出的时间
    setTimeout(() => {
      audioContext.seek(currentTime / 1000)
      this.setData({
        currentTime,
        sliderValue: value,
        isSliderChanging: false,
        isPlaying: true
      })
      this.data.isWaiting = false
    }, 500)
  },
  // 滑块拖动过程中触发的事件
  onSliderChanging: throttle(function (event) {
    // 1.获取滑动到的位置的value
    const value = event.detail.value
    // 2.根据当前的值, 计算出对应的时间
    const currentTime = value / 100 * this.data.durationTime
    this.setData({
      currentTime
    })
    // 3.当前正在滑动
    this.data.isSliderChanging = true
  }, 100),
  // 共享数据的处理函数
  // 歌单列表
  getPlaySongInfosHandler({
    playSongList,
    playSongIndex
  }) {
    if (playSongList) {
      this.setData({
        playSongList
      })
    }
    if (playSongIndex !== undefined) {
      this.setData({
        playSongIndex
      })
    }
  },
  // 歌曲数据
  getPlayerInfosHandler({
    id,
    lyricInfos,
    currentSong,
    durationTime,
    currentTime,
    currentLyricText,
    currentLyricIndex,
    isPlaying,
    playModeIndex
  }) {
    if (id !== undefined) {
      this.setData({
        id
      })
    }
    if (lyricInfos) {
      this.setData({
        lyricInfos
      })
      wx.setStorageSync('lyricInfos', lyricInfos)
    }
    if (currentSong) {
      this.setData({
        currentSong
      })
      wx.setStorageSync('currentSong', currentSong)
    }
    if (durationTime !== undefined) {
      this.setData({
        durationTime
      })
    }
    if (currentTime !== undefined) {
      this.updateProgress(currentTime)
    }
    if (currentLyricText) {
      this.setData({
        currentLyricText,

      })
    }
    if (currentLyricIndex !== undefined) {
      this.setData({
        currentLyricIndex,
        lyricScrollTop: currentLyricIndex * 35
      })
    }
    if (isPlaying !== undefined) {
      this.setData({
        isPlaying
      })
    }
    if (playModeIndex !== undefined) {
      this.setData({
        playModeName: modeNames[playModeIndex]
      })
    }
  },
  // 点击上一首/下一首的按钮
  onPrevBtnTap() {
    playerStore.dispatch("playNewMusicAction", false)
  },
  onNextBtnTap() {
    playerStore.dispatch("playNewMusicAction")
  },
  // 点击播放/暂停按钮，改变播放的状态
  onPlayOrPauseTap() {
    if (!audioContext.paused) {
      audioContext.pause()
      this.setData({
        isPlaying: false
      })
    } else {
      audioContext.play()
      this.setData({
        isPlaying: true
      })
    }
  },
  // 点击播放模式按钮
  onModeBtnTap() {
    playerStore.dispatch("changePlayModeAction")
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
    this.setData({
      currentPage: event.detail.current
    })
  },
  // 页面卸载监听
  onUnload() {
    playerStore.offStates(["playSongList", "playSongIndex"], this.getPlaySongInfosHandler)
    playerStore.offStates(this.data.stateKeys, this.getPlayerInfosHandler)
  }
})