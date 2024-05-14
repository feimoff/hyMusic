import rankingStore from "../../store/rankingStore"
import {
  getSongMenuList
} from "../../services/music"
import playerStore from "../../store/playerStore"

Page({
  data: {
    banners: [],
    searchValue: '',
    // 歌单数据
    hotMenuList: [],
    recMenuList: [],
    // 榜单数据
    recRanking: [],
    isRankingData: false,
    rankingInfos: {},
  },
  onLoad() {
    this.fetchSongMenuList()
    const result = wx.getStorageSync('rankingInfos')
    if (!result) {
      rankingStore.onState("hotRanking", this.handleHotRanking)
      rankingStore.onState("newRanking", this.handleNewRanking)
      rankingStore.onState("originRanking", this.handleOriginRanking)
      rankingStore.onState("upRanking", this.handleUpRanking)
      rankingStore.dispatch("fetchRankingDataAction")
    } else {
      this.setData({
        rankingInfos: result,
        recRanking: result['hotRanking'].tracks.slice(0, 6),
        isRankingData: true
      })
    }
  },

  // 请求歌单数据
  // 注意：不需要用await，直接进行请求，这里的数据不需要分先后
  async fetchSongMenuList() {
    getSongMenuList("流行").then(res => {
      this.setData({
        hotMenuList: res.playlists
      })
    })
    getSongMenuList("华语").then(res => {
      this.setData({
        recMenuList: res.playlists
      })
    })
  },
  // 推荐歌曲右上角的更多点击
  onRecommendMoreClick() {
    wx.navigateTo({
      url: '/pages/detail-song/detail-song?type=ranking&key=hotRanking',
    })
  },
  // 监听song-item-v1的点击
  onSongItemTap(event) {
    const index = event.currentTarget.dataset.index
    playerStore.setState("playSongList", this.data?.rankingInfos["hotRanking"]?.tracks.slice(0, 6))
    playerStore.setState("playSongIndex", index)
  },
  // 搜索
  onSearchClick() {},
  // 使用重构后的通用函数来处理不同类型的榜单
  // 热歌榜
  handleHotRanking(value) {
    this.handleRanking('hotRanking', value);
  },
  // 新歌榜
  handleNewRanking(value) {
    this.handleRanking('newRanking', value);
  },
  // 原创榜
  handleOriginRanking(value) {
    this.handleRanking('originRanking', value);
  },
  // 飙升榜
  handleUpRanking(value) {
    this.handleRanking('upRanking', value);
  },
  // 通用榜单数据处理函数
  handleRanking(type, value) {
    if (!value.tracks) return;
    this.setData({
      isRankingData: true
    });
    if (type === "hotRanking") {
      this.setData({
        recRanking: value.tracks.slice(0, 6)
      })
    }
    const newRankingInfos = {
      ...this.data.rankingInfos,
      [type]: value
    };
    wx.setStorageSync('rankingInfos', newRankingInfos)
    this.setData({
      rankingInfos: newRankingInfos
    });
  },
  // 页面卸载
  onUnload() {
    rankingStore.offState("hotRanking", this.handleHotRanking)
    rankingStore.offState("newRanking", this.handleNewRanking)
    rankingStore.offState("originRanking", this.handleOriginRanking)
    rankingStore.offState("upRanking", this.handleUpRanking)
  }
})