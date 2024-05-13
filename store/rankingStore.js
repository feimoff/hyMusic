import {
  HYEventStore
} from "hy-event-store"

import {
  getPlaylistDetail
} from "../services/music"

// rankingsMap存储着对应的榜单和榜单的id
export const rankingsMap = {
  hotRanking: 3778678,
  newRanking: 3779629,
  originRanking: 2884035,
  upRanking: 19723756
}

const rankingStore = new HYEventStore({
  state: {
    hotRanking: {},
    newRanking: {},
    originRanking: {},
    upRanking: {}
  },
  actions: {
    fetchRankingDataAction(ctx) {
      for (const key in rankingsMap) {
        const id = rankingsMap[key]
        getPlaylistDetail(id).then(res => {
          ctx[key] = res.playlist
        })
      }
    }
  }
})

export default rankingStore