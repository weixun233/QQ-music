import cache from 'common/js/cache'
import {insertArray, deleteArray} from 'common/js/config'

const playHistoryLen = 100      // 最近播放历史len
const favoriteListLen = 300     // 我喜欢的len
const songSheetLen = 20         // 自建歌单
const collectSheetLen = 30      // 收藏的歌单
const followSingerLen = 2000       // // 关注的歌手

export default {
  namespaced: true,
  state: {
    singer: {},
    sheet: {},
    playHistory: cache.getLocal('playHistory', []),       // 最近播放历史
    favoriteList: cache.getLocal('favoriteList', []),     // 我喜欢的
    songSheet: cache.getLocal('songSheet', []),           // 自建歌单列表
    collectSheet: cache.getLocal('collectSheet', []),     // 收藏的歌单
    followSinger: cache.getLocal('followSinger', [])     // 关注的歌手
  },
  getters: {
    // 判断是否为关注
    ifFollow: state => {
      const index = state.followSinger.findIndex((item) => {
        return item.singer_id === state.singer.singer_id
      })
      return index > -1
    },
    // 判断是否为收藏
    ifCollect: state => {
      const index = state.collectSheet.findIndex((item) => {
        return item.disstid === state.sheet.disstid
      })
      return index > -1
    }
  },
  mutations: {

    set_singer(state, data) {
      state.singer = data
    },
    set_sheet(state, data) {
      state.sheet = data
    },

    // 最近播放历史
    set_playHistory(state, song) {
      let arr = cache.getLocal('playHistory', [])

      arr = insertArray(arr, song, (item) => {
        return item.songId === song.songId
      }, playHistoryLen)

      state.playHistory = arr
      cache.setLocal('playHistory', arr)
    },
    // 清空播放历史
    clear_playHistory(state) {
      state.playHistory = []
      cache.setLocal('playHistory', [])
    },

    // 我喜欢的
    set_favoriteList(state, song) {
      let arr = cache.getLocal('favoriteList', [])

      insertArray(arr, song, (item) => {
        return item.songId === song.songId
      }, favoriteListLen)

      state.favoriteList = arr
      cache.setLocal('favoriteList', arr)
    },
    // 删除
    delete_favoriteList(state, song) {
      let arr = cache.getLocal('favoriteList', [])

      deleteArray(arr, (item) => {
        return item.songId === song.songId
      }, favoriteListLen)

      state.favoriteList = arr
      cache.setLocal('favoriteList', arr)
    },
    // 批量删除
    batchDelete_favoriteList(state, songs) {
      let arr = cache.getLocal('favoriteList', [])
      let len = songs.length

      for (let i = 0; i < len; i++) {
        deleteArray(arr, (item) => {
          return item.songId === songs[i].songId
        })
      }

      state.favoriteList = arr
      cache.setLocal('favoriteList', arr)
    },

    // 创建歌单
    new_songSheet(state, title) {
      let arr = cache.getLocal('songSheet', [])
      let sheet = {
        title: title,
        imgurl: 'http://p1.music.126.net/txPfd4kGL0IQ3ylbug334g==/7996748070674609.jpg?param=200y200',
        songlist: [],
        songLength: 0,
        type: 'mySongSheet'
      }

      arr.push(sheet)

      state.songSheet = arr
      cache.setLocal('songSheet', arr)
    },
    // 删除歌单
    noNew_songSheet(state, songSheet) {
      let arr = cache.getLocal('songSheet', [])

      deleteArray(arr, (item) => {
        return item.title === songSheet.title
      })

      state.songSheet = arr
      cache.setLocal('songSheet', arr)
    },
    // 删除歌单歌曲
    delete_songSheet(state, {song, index}) {
      let arr = cache.getLocal('songSheet', [])
      deleteArray(arr[index].songlist, (item) => {
        return item.songId === song.songId
      })
      state.songSheet = arr
      cache.setLocal('songSheet', arr)
    },
    // 批量delete 歌单歌曲
    batchDelete_songSheet(state, {songs, index}) {
      let arr = cache.getLocal('songSheet', [])
      let len = songs.length

      for (let i = 0; i < len; i++) {
        deleteArray(arr[index].songlist, (item) => {
          return item.songId === songs[i].songId
        })
      }

      state.songSheet = arr
      cache.setLocal('songSheet', arr)
    },
    // 添加歌曲到歌单
    set_songSheet(state, {song, index}) {
      let arr = cache.getLocal('songSheet', [])

      insertArray(arr[index].songlist, song, (item) => {
        return item.songId === song.songId
      }, favoriteListLen)

      state.songSheet = arr
      cache.setLocal('songSheet', arr)
    },
    // 批量添加歌曲到歌单
    batchSet_songSheet(state, {songs, index}) {
      let arr = cache.getLocal('songSheet', [])
      let len = songs.length

      for (let i = 0; i < len; i++) {
        insertArray(arr[index].songlist, songs[i], (item) => {
          return item.songId === songs[i].songId
        }, favoriteListLen)
      }

      arr[index].songLength = arr[index].songlist.length

      state.songSheet = arr
      cache.setLocal('songSheet', arr)
    },

    // 收藏歌单
    set_collectSheet(state, {songSheet, len}) {
      let arr = cache.getLocal('collectSheet', [])

      songSheet.songLength = len
      insertArray(arr, songSheet, (item) => {
        return item.dissid === songSheet.dissid
      }, collectSheetLen)

      state.collectSheet = arr
      cache.setLocal('collectSheet', arr)
    },
    // 取消收藏
    delete_collectSheet(state, songSheet) {
      let arr = cache.getLocal('collectSheet', [])

      deleteArray(arr, (item) => {
        return item.disstid === songSheet.disstid
      })

      state.collectSheet = arr
      cache.setLocal('collectSheet', arr)
    },

    // 关注
    set_followSinger(state, singer) {
      let arr = cache.getLocal('followSinger', [])

      insertArray(arr, singer, (item) => {
        return item.singer_id === singer.singer_id
      }, followSingerLen)

      state.followSinger = arr
      cache.setLocal('followSinger', arr)
    },
    // 取消关注
    delete_followSinger(state, singer) {
      let arr = cache.getLocal('followSinger', [])

      deleteArray(arr, (item) => {
        return item.singer_id === singer.singer_id
      })

      state.followSinger = arr
      cache.setLocal('followSinger', arr)
    }
  },
  actions: {}
}
