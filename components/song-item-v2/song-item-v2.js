Component({
  properties: {
    itemData: {
      type: Object,
      value: {}
    },
    index: {
      type: Number,
      value: -1
    },
  },
  methods: {
    onSongItemTap() {
      const id = this.properties.itemData.id
      wx.navigateTo({
        url: `/pages/main-player/main-player?id=${id}`,
      })
    }
  }
})