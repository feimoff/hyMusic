import rankingStore from "../../store/rankingStore"
import {
  getPlaylistDetail
} from "../../services/music"

Page({
  data: {
    type: "ranking",
    key: "newRanking",
    songInfo: {},
    result: {},
    id: ""
  },

  onLoad(options) {
    const result = wx.getStorageSync('rankingInfos')
    const menuRes = wx.getStorageSync('songMenuInfos')
    this.data.result = result
    let type = options.type
    this.setData({
      type
    })
    if (type === "ranking") {
      const key = options.key
      this.data.key = key
      if (!result) {
        rankingStore.onState(key, this.handleRanking)
      } else {
        this.setData({
          songInfo: result[key]
        })
      }
    } else if (type === "menu") {
      if (!menuRes) {
        const id = options.id
        this.data.id = id
        this.fetchMenuSongInfo()
      } else {
        this.setData({ 
          songInfo: menuRes
        })
      }
    }
  },
  handleRanking(value) {
    this.setData({
      songInfo: value
    })
    wx.setNavigationBarTitle({
      title: value.name,
    })
  },

  async fetchMenuSongInfo() {
    const res = await getPlaylistDetail(this.data.id)
    this.setData({
      songInfo: res.playlist
    })
    // 存储歌单数据
    wx.setStorageSync('songMenuInfos', res.playlist)
  },

  onUnload() {
    if (!this.data.result) {
      if (this.data.type === "ranking") {
        rankingStore.offState(this.data.key, this.handleRanking)
      }
    }
  }
})