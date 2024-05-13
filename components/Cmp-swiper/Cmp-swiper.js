import {
  getMusicBanner
} from "../../services/music"

import querySelect from "../../utils/querySelect"

Component({
  data: {
    banners: [],
    bannerHeight: 0
  },
  lifetimes: {
    ready: async function () {
      await this.fetchMusicBanner()
      querySelect(".banner-image", this).then(res => {
        this.setData({
          bannerHeight: res[0].height
        })
      })
    }
  },
  methods: {
    fetchMusicBanner: async function () {
      const banners = wx.getStorageSync('banners')
      if (!banners.length) {
        const res = await getMusicBanner()
        this.setData({
          banners: res.banners
        })
        wx.setStorageSync('banners', this.data.banners)
        return
      }
      this.setData({
        banners
      })
    },
  },
})