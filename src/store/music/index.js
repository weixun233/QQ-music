import {playMode, currentIndex} from 'common/js/config'
import {getRandomInt} from 'common/js/util'

export default {
  namespaced: true,
  state: {
    playing: false,               // 是否播放
    fullScreen: false,            // 播放器展开/收起
    playlist: [],                 // 播放列表
    playShowHide: true,           // 收起的播放器(显隐)
    mode: playMode.sequence,      // 播放模式
    currentIndex: -1              // 当前播放歌曲index
  },
  getters: {
    currentSong: state => {
      return state.playlist[state.currentIndex] || {}
    }
  },
  mutations: {
    set_playing(state, Boolean) {
      state.playing = Boolean
    },
    set_fullScreen(state, Boolean) {
      state.fullScreen = Boolean
    },
    set_playlist(state, Array) {
      state.playlist = Array.slice()
    },
    set_playShowHide(state, Boolean) {
      state.playShowHide = Boolean
    },
    set_mode(state, Number) {
      state.mode = Number
    },
    set_currentIndex(state, Number) {
      state.currentIndex = Number
    }
  },
  actions: {
    // 播放歌曲
    selectPlay({state, commit}, {list, index}) {
      let playlist = state.playlist
      let len = playlist.length

      if (len === 0) {
        commit('set_fullScreen', true)
      }
      commit('set_playing', true)
      commit('set_playlist', list)
      commit('set_currentIndex', index)
    },
    // 随机播放歌曲
    randomPlay({commit}, {list}) {
      commit('set_mode', playMode.random)
      commit('set_playlist', list)
      let index = getRandomInt(0, list.length)
      commit('set_currentIndex', index)
      commit('set_playing', true)
      commit('set_fullScreen', true)
    },
    // 添加歌曲并播放
    insertSong({commit, state}, song) {
      let playlist = state.playlist.slice()
      let currentIndex = state.currentIndex

      // 当前列表是否存在插入的歌曲 (返回index)
      let fpIndex = playlist.findIndex((item) => {
        return item.songId === song.songId
      })
      // 插入歌曲
      currentIndex++
      playlist.splice(currentIndex, 0, song)

      if (fpIndex > -1) {
        if (currentIndex > fpIndex) {
          playlist.splice(fpIndex, 1)
          currentIndex--
        } else {
          playlist.splice(fpIndex + 1, 1)
        }
      }

      commit('set_playlist', playlist)
      commit('set_currentIndex', currentIndex)
      commit('set_playing', true)
    },
    // 添加歌曲到队列
    insertSongQueue  ({commit, state}, song) {
      let playlist = state.playlist.slice()
      let playlistLen = playlist.length
      let currentIndex = state.currentIndex

      song.type = 'insert'
      playlist.splice(currentIndex + 1, 0, song)
      commit('set_playlist', playlist)
      if (playlistLen === 0) {
        commit('set_currentIndex', 0)
        commit('set_playing', true)
      }
    },
    // delete 当前播放歌单的type
    deleteInsertIcon({commit, state}) {
      let playlist = state.playlist.slice()
      let currentIndex = state.currentIndex

      playlist[currentIndex].type = ''
      commit('set_playlist', playlist)
    },
    // 批量+歌曲到队列
    batchInsertSongQueue({commit, state}, songs) {
      let playlist = state.playlist.slice()
      let playlistLen = playlist.length
      let currentIndex = state.currentIndex
      let len = songs.length

      for (let i = 0; i < len; i++) {
        songs[i].type = 'insert'
        // 插入歌曲
        playlist.splice(currentIndex, 0, songs[i])
        currentIndex++
      }
      commit('set_playlist', playlist)
      if (playlistLen === 0) {
        commit('set_currentIndex', 0)
        commit('set_playing', true)
      }
    },
    // 删除歌曲
    deleteSong({commit, state}, song) {
      let playlist = state.playlist.slice()
      let playing = state.playing
      let currentIndex = state.currentIndex
      let deleteIndex = currentIndex(playlist, song)

      playlist.splice(deleteIndex, 1)
      // 如果删除的歌曲在播放歌曲前面 或 播放的歌曲是最后一首并删除了他
      // currentIndex-1
      if (currentIndex > deleteIndex || currentIndex === playlist.length) {
        currentIndex--
      }

      commit('set_playlist', playlist)
      commit('set_currentIndex', currentIndex)
      // 如果列表为空 暂停播放
      const playingState = playlist.length > 0

      if (playing) {
        commit('set_playing', playingState)
      }
    },
    // 清空列表歌曲
    clearSong({commit}) {
      commit('set_playlist', [])
      commit('set_currentIndex', -1)
      commit('set_playing', false)
    }
  }
}
