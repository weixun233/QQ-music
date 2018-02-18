import {commonParams} from './config'
import axios from 'axios'
import {getTurnJSON} from 'common/js/util'

// 请求歌词数据
export function getLyric (mid) {
  const url = 'https://bird.ioliu.cn/v2'

  const data = Object.assign({}, commonParams, {
    url: 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg',
    songmid: mid,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    categoryId: 10000000,
    pcachetime: +new Date(),
    format: 'json',
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    }
  })

  return axios.get(url, {
    params: data
  }).then(res => {
    return getTurnJSON(res)
  })
}
