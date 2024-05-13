import {
  getTopMV
} from "../../services/video"

Page({
  data: {
    videoList: [],
    offset: 0,
    hasMore: true
  },
  onLoad() {
    this.fetchTopMV().then(() => {
      console.log(this.data.videoList.length);
    })
  },
  async fetchTopMV() {
    let index = 0
    const res = await getTopMV(this.data.offset)
    let newVideoList = [...this.data.videoList, ...res.data]
    newVideoList = newVideoList.map(item => {
      item.index = index++
      return item
    })
    this.setData({
      videoList: newVideoList
    })
    this.data.offset = this.data.videoList.length
    this.data.hasMore = res.hasMore
  },
  async onReachBottom() {
    if (!this.data.hasMore) return
    wx.showLoading({
      title: '加载中',
    })
    await this.fetchTopMV()
    wx.hideLoading()
  },
  async onPullDownRefresh() {
    this.setData({
      videoList: []
    })
    this.data.offset = 0
    this.data.hasMore = true
    await this.fetchTopMV()
    wx.stopPullDownRefresh()
  },
  itemDataClick(event) {
    const item = event.currentTarget.dataset.item
    wx.navigateTo({
      url: `/pages/detail-video/detail-video?id=${item.id}`,
    })
  }
})