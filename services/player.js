import { hyRequest } from "./index"

// 获取歌曲详情
export function getSongDetail(ids) {
  return hyRequest.get({
    url: "/song/detail",
    data: {
      ids
    }
  })
}
// 获取歌词
export function getSongLyric(id) {
  return hyRequest.get({
    url: "/lyric",
    data: {
      id
    }
  })
}
