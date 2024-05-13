import {
  getSongMenuTag,
  getSongMenuList
} from "../../services/music"

Page({
  data: {
    songMenus: []
  },
  onLoad() {
    const result = wx.getStorageSync('songMenus')
    if (!result) {
      this.fetchAllMenuList()
    } else {
      this.setData({
        songMenus: result
      })
    }
  },
  // 性能优化
  // 这个函数先发起所有的请求，等所有的请求都有结果之后
  // 再一次性设置data
  async fetchAllMenuList() {
    // 1.获取tags
    const tagRes = await getSongMenuTag()
    const tags = tagRes.tags
    // 2.根据tags去获取对应的歌单
    const allPromises = []
    for (const tag of tags) {
      const promise = getSongMenuList(tag.name)
      allPromises.push(promise)
    }
    // 3.获取到所有的数据之后, 调用一次setData
    Promise.all(allPromises).then(res => {
      console.log(res);
      this.setData({
        songMenus: res
      })
      wx.setStorageSync('songMenus', res)
    })
  }
})