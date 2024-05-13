import {
  HYEventStore
} from 'hy-event-store'
import {
  getSongDetail,
  getSongLyric
} from "../services/player"
import {
  parseLyric
} from "../utils/parse-lyric"


export const audioContext = wx.createInnerAudioContext()


const playerStore = new HYEventStore({
  state: {
    id: "", // 歌曲id
    lyricInfos: [], // 歌词信息
    currentSong: {}, // 当前歌曲的信息
    durationTime: 0, // 播放时间
  },
  actions: {
    playMusicWithSongIdAction(ctx, id) {
      // 1.保存id
      ctx.id = id
      // 2.请求歌曲相关的数据
      getSongDetail(id).then(res => {
        ctx.currentSong = res.songs[0]
        ctx.durationTime = res.songs[0].dt
      })
      getSongLyric(id).then(res => {
        const lrcString = res.lrc.lyric
        const lyricInfos = parseLyric(lrcString)
        ctx.lyricInfos = lyricInfos
      })
    }
  }
})

export default playerStore