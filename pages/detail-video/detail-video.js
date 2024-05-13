import {
  getMVUrl,
  getMVInfo,
} from "../../services/video"


Page({
  data: {
    id: 0,
    mvUrl: "",
    mvInfo: {},
    danmuList: [{
        text: "哈哈哈, 真好笑",
        color: "#00ff00",
        time: 5
      },
      {
        text: "哈哈哈, 真有趣",
        color: "#0000ff",
        time: 4
      },
      {
        text: "哈哈哈, 真好玩",
        color: "#ff00ff",
        time: 6
      },
      {
        text: "哈哈哈, 真搞笑",
        color: "#ffff00",
        time: 4
      },
      {
        text: "哈哈哈, 真有意思",
        color: "#00ffff",
        time: 5
      },
      {
        text: "哈哈哈, 真好笑啊",
        color: "#000000",
        time: 3
      }
    ]
  },
  onLoad(options) {
    // 1.获取id
    const id = options.id
    this.setData({
      id
    })
    // 2.请求数据
    this.fetchMVUrl()
    this.fetchMVInfo()
  },
  async fetchMVUrl() {
    const res = await getMVUrl(this.data.id)
    this.setData({
      mvUrl: res.data.url
    })
  },
  async fetchMVInfo() {
    const res = await getMVInfo(this.data.id)
    this.setData({
      mvInfo: res.data
    })
  },
})