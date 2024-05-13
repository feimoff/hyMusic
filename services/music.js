import {
  hyRequest
} from "./index"

// 获取轮播图数据
export function getMusicBanner(type = 0) {
  return hyRequest.get({
    url: "/banner",
    data: {
      type
    }
  })
}
// 获取榜单数据
export function getPlaylistDetail(id) {
  return hyRequest.get({
    url: "/playlist/detail",
    data: {
      id
    }
  })
}
// 获取歌单数据
export function getSongMenuList(cat = "全部", limit = 6, offset = 0) {
  return hyRequest.get({
    url: "/top/playlist",
    data: {
      cat,
      limit,
      offset
    }
  })
}
// 热门歌单分类的tag
export function getSongMenuTag() {
  return hyRequest.get({
    url: "/playlist/hot",
  })
}