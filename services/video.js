import {
  hyRequest
} from "./index"

// MV排行
export function getTopMV(offset = 0, limit = 20) {
  return hyRequest.get({
    url: "/top/mv",
    data: {
      limit,
      offset
    }
  })
}
// mv 地址
export function getMVUrl(id) {
  return hyRequest.get({
    url: "/mv/url",
    data: {
      id
    }
  })
}

// 32462885
// 获取 mv 数据
export function getMVInfo(mvid) {
  return hyRequest.get({
    url: "/mv/detail",
    data: {
      mvid
    }
  })
}