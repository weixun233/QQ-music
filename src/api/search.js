import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'
import {getTurnJSON} from 'common/js/util'

// 热门关键词
export function getHotKey() {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'

  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    needNewCode: 1,
    _: +new Date()
  })

  return jsonp(url, data, options)
}

// 搜索关键词 关键词、页数、是否直达(是否包含歌手)、每次请求数量
export function getSearch({query, page, zhida, perpage}) {
  const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'

  const data = Object.assign({}, commonParams, {
    w: query,
    p: page,
    catZhida: zhida ? 1 : 0,
    zhidaqu: 1,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    perpage,
    n: 20,
    remoteplace: 'txt.mqq.all',
    uid: 0,
    platform: 'h5',
    needNewCode: 1,
    _: +new Date()
  })

  return jsonp(url, data, options)
}
