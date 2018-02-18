import axios from 'axios'
import {commonParams} from './config'
import {getTurnJSON, getTurnSlashJSON} from 'common/js/util'

// api请求

// 歌单 (开始, 请求数量, 歌单类别)
export function getSongSheet ({sin, ein, songSheetId = 10000000, sortId = 5}) {
  const url = 'https://bird.ioliu.cn/v2'

  const data = Object.assign({}, commonParams, {
    url: 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg',
    picmid: 1,
    g_tk: 2140946421,
    jsonpCallback: 'getPlaylist',
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
    categoryId: songSheetId,
    sortId: sortId,
    sin: sin,
    ein: ein,
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

// 热门关键词 + 推荐歌单 + banner
export function getIndex () {
  const url = 'https://bird.ioliu.cn/v2'

  const data = Object.assign({}, commonParams, {
    url: 'https://u.y.qq.com/cgi-bin/musicu.fcg',
    callback: 'recom937522',
    jsonpCallback: 'recom937',
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
    data: `{"comm":{"ct":24},"category":{"method":"get_hot_category","param":{"qq":""},"module":"music.web_category_svr"},"recomPlaylist":{"method":"get_hot_recommend","param":{"async":1,"cmd":2},"module":"playlist.HotRecommendServer"},"playlist":{"method":"get_playlist_by_category","param":{"id":8,"curPage":1,"size":40,"order":5,"titleid":8},"module":"playlist.PlayListPlazaServer"},"new_song":{"module":"QQMusic.MusichallServer","method":"GetNewSong","param":{"type":0}},"new_album":{"module":"QQMusic.MusichallServer","method":"GetNewAlbum","param":{"type":0,"category":"-1","genre":0,"year":1,"company":-1,"sort":1,"start":0,"end":39}},"toplist":{"module":"music.web_toplist_svr","method":"get_toplist_index","param":{}},"focus":{"module":"QQMusic.MusichallServer","method":"GetFocus","param":{}}}`
  })

  return axios.get(url, {
    params: data
  }).then(res => {
    return getTurnSlashJSON(res)
  })
}
// 热门歌单请求
export function getHotSongSheet ({id, sortId = 5, size}) {
  const url = 'https://bird.ioliu.cn/v2'

  const data = Object.assign({}, commonParams, {
    url: 'https://u.y.qq.com/cgi-bin/musicu.fcg',
    callback: 'recom937522',
    jsonpCallback: 'recom937',
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
    data: `{"comm":{"ct":24},"playlist":{"method":"get_playlist_by_category","param":{"id":${id},"curPage":0,"size":${size},"order":${sortId},"titleid":${id}},"module":"playlist.PlayListPlazaServer"}}`
  })

  return axios.get(url, {
    params: data
  }).then(res => {
    return getTurnSlashJSON(res)
  })
}

// 歌单歌曲
export function getSongSheetList (id) {
  const url = 'https://bird.ioliu.cn/v2'

  const data = Object.assign({}, commonParams, {
    url: 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg',
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    disstid: id,
    jsonpCallback: 'playlistinfoCallback',
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
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

// 分类歌单列表
export function getSongSheetClass () {
  const url = 'https://bird.ioliu.cn/v2'

  const data = Object.assign({}, commonParams, {
    url: 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_tag_conf.fcg',
    jsonpCallback: 'getPlaylistTags',
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
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

// 专辑首页 banner + 专辑
export function getAlbum () {
  const url = 'https://bird.ioliu.cn/v2'

  const data = Object.assign({}, commonParams, {
    url: 'https://c.y.qq.com/v8/fcg-bin/musicmall.fcg',
    jsonpCallback: 'MusicJsonCallback061356496738099064',
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
    cmd: 'pc_index_new',
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

// 专辑详情
export function getAlbumCont (albumid) {
  const url = 'https://bird.ioliu.cn/v2'

  const data = Object.assign({}, commonParams, {
    url: 'https://c.y.qq.com/v8/fcg-bin/musicmall.fcg?cmd=get_album_buy_page',
    cmd: 'get_album_buy_page',
    albumid,
    g_tk: 151575365,
    jsonpCallback: 'MusicJsonCallback_digital',
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
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
// 专辑详情歌曲
export function getAlbumContSong (albummid) {
  const url = 'https://bird.ioliu.cn/v2'

  const data = Object.assign({}, commonParams, {
    url: 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_album_info_cp.fcg',
    albummid: albummid,
    g_tk: 151575365,
    jsonpCallback: 'albuminfoCallback',
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
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

// 电台列表
export function getRadio () {
  const url = 'https://bird.ioliu.cn/v2'

  const data = Object.assign({}, commonParams, {
    url: 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_radiolist.fcg',
    channel: 'radio',
    page: 'index',
    tpl: 'wk',
    new: 1,
    g_tk: 151575365,
    jsonpCallback: 'MusicJsonCallback5905578181646627',
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
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

// 电台详情歌曲 (无法找到该api)
export function getRadioSong (radioId) {
  const url = 'https://bird.ioliu.cn/v2'

  const data = Object.assign({}, commonParams, {
    url: 'https://u.y.qq.com/cgi-bin/musicu.fcg',
    callback: 'getradiosonglist4223521009657101',
    g_tk: 979472738,
    jsonpCallback: 'getradiosonglist4223521009657101',
    loginUin: 0,
    hostUin: 0,
    notice: 0,
    platform: 'yqq',
    needNewCode: 0,
    data: `{"songlist":{"module":"pf.radiosvr","method":"GetRadiosonglist","param":{"id":144,"firstplay":1,"num":10}},"radiolist":{"module":"pf.radiosvr","method":"GetRadiolist","param":{"ct":"24"}},"comm":{"ct":"24"}}`,
    headers: {
      referer: 'https://y.qq.com/',
      host: 'y.qq.com'
    }
  })

  return axios.get(url, {
    params: data
  }).then(res => {
    console.log(res)
    return getTurnJSON(res)
  })
}
