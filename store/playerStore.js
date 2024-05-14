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

function findClosestLyricIndex(lyricInfos, currentTime) {
  let low = 0;
  let high = lyricInfos.length - 1;
  let closestIndex = 0;

  while (low <= high) {
    let mid = Math.floor((low + high) / 2);
    let midTime = lyricInfos[mid].time;

    if (midTime < currentTime) {
      low = mid + 1;
    } else if (midTime > currentTime) {
      high = mid - 1;
    } else {
      closestIndex = mid;
      break;
    }

    // Determine the closest index
    if (currentTime - lyricInfos[high].time < midTime - currentTime) {
      closestIndex = high;
    } else {
      closestIndex = mid;
    }
  }

  return closestIndex;
}

const playerStore = new HYEventStore({
  state: {
    id: "2124385868", // 歌曲id
    lyricInfos: [], // 歌词信息
    currentSong: {}, // 当前歌曲的信息
    currentTime: 0, // 当前时间
    currentLyricText: "", // 当前文本
    currentLyricIndex: -1, // 当前歌词的索引
    currentFlag: 0, // 设置当前
    durationTime: 0, // 播放时长,
    isPlaying: false, // 是否正在播放,

    playModeIndex: 0, // 歌曲播放模式 // 0:顺序播放 1:单曲循环 2:随机播放
    playSongList: [], // 播放列表
    playSongIndex: 0, // 播放列表中的index
  },
  actions: {
    // playMusicWithSongIdAction函数功能
    // 根据id播放音乐
    // 步骤过程
    // 0. 先将原来的数据重置
    // 1. 保存id
    // 2. 设置正在播放的标识
    // 3. 请求歌曲相关的数据
    // 3.1. 根据id获取歌曲的详情
    // 3.2. 根据id获取歌词的信息
    // 4. 播放当前的歌曲
    // 4.1 可以设置歌曲为自动播放
    // 5. 监听播放的进度更新事件（根据正在播放的标识判断，是否进入）
    // 5.1 获取当前播放时间
    // 5.2 设置歌词文本
    // 5.3 获取歌词的索引index和文本text
    // 5.4 改变歌词滚动页面的位置

    playMusicWithSongIdAction(ctx, id) {
    
      ctx.durationTime = 0
      ctx.currentSong = {}
      ctx.currentLyricIndex = -1
      ctx.currentLyricText = ""
      ctx.lyricInfos = []

      ctx.id = id
      ctx.isPlaying = true

      getSongDetail(id).then(res => {
        ctx.currentSong = res.songs[0]
        ctx.durationTime = res.songs[0].dt
      })
      getSongLyric(id).then(res => {
        const lrcString = res.lrc.lyric
        const lyricInfos = parseLyric(lrcString)
        ctx.lyricInfos = lyricInfos
      })


      audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
      audioContext.autoplay = true
      
      if (ctx.isPlaying) {
        // onTimeUpdate函数功能：监听音频播放进度更新事件
        audioContext.onTimeUpdate(() => {
          // 1.获取当前播放的时间
          ctx.currentTime = audioContext.currentTime * 1000
          // 2.匹配正确的歌词
          if (!ctx.lyricInfos.length) return
          let index = ctx.lyricInfos.length - 1
          for (let i = 0; i < ctx.lyricInfos.length; i++) {
            const info = ctx.lyricInfos[i]
            if (info.time > audioContext.currentTime * 1000) {
              index = i - 1
              break
            }
          }
          if (index === ctx.currentLyricIndex) return
          const currentLyricText = ctx.lyricInfos[index].text
          ctx.currentLyricText = currentLyricText
          ctx.currentLyricIndex = index
        })

        // 音乐播放的优化（当音乐正在播放时）
        // 1. 当音频由于缓冲而暂停时，自动暂停播放
        // 2. 一旦音频准备好播放，自动开始播放
        // 3. 当当前播放的音频结束时，如果不是单曲循环模式，就自动切换到播放列表中的下一首音乐
        // 当音频因为需要缓冲数据而暂停时（比如网络加载音频文件时），会触发
        audioContext.onWaiting(() => {
          audioContext.pause()
        })
        // 当音频的数据加载足够可以开始播放时，会触发
        audioContext.onCanplay(() => {
          audioContext.play()
        })
        // 当音频播放完成时，会触发
        audioContext.onEnded(() => {
          // 如果是单曲循环, 不需要切换下一首歌
          if (audioContext.loop) return
          // 切换下一首歌曲
          this.dispatch("playNewMusicAction")
        })
      }
    },
    // 改变歌曲播放的模式
    // 0:顺序播放 1:单曲循环 2:随机播放
    changePlayModeAction(ctx) {
      let modeIndex = ctx.playModeIndex
      modeIndex = modeIndex + 1
      if (modeIndex === 3) modeIndex = 0
      if (modeIndex === 1) audioContext.loop = true
      else audioContext.loop = false
      ctx.playModeIndex = modeIndex
    },

    // 播放新的音乐
    playNewMusicAction(ctx, isNext = true) {
      // 1.获取之前的数据
      const length = ctx.playSongList.length
      let index = ctx.playSongIndex
      // 2.根据之前的数据计算最新的索引
      switch (ctx.playModeIndex) {
        case 1:
        case 0: // 顺序播放
          index = isNext ? index + 1 : index - 1
          if (index === length) index = 0
          if (index === -1) index = length - 1
          break
        case 2: // 随机播放
          index = Math.floor(Math.random() * length)
          break
      }
      // 3.根据索引获取当前歌曲的信息
      const newSong = ctx.playSongList[index]
      // 开始播放新的歌曲
      this.dispatch("playMusicWithSongIdAction", newSong.id)
      // 4.保存最新的索引值
      ctx.playSongIndex = index
    }
  },
})


export default playerStore