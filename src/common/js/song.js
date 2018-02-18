import {Base64} from 'js-base64'
import {getLyric} from 'api/lyric'

export default class Song {
  // 歌曲、歌手、专辑、mv、id、mid、name,
  // 歌曲长度, 歌曲封面,歌曲是否免费(0免费,1收费),歌曲url
  constructor({ songId, songMid, songName,
                singerId, singerMid, singerName,
                albumId, albumMid, albumName,
                mvId, mvVid, mvName,
                duration, image, isonly, url }) {
    this.songId = songId
    this.songMid = songMid
    this.songName = songName
    this.singerId = singerId
    this.singerMid = singerMid
    this.singerName = singerName
    this.albumId = albumId
    this.albumMid = albumMid
    this.albumName = albumName
    this.duration = duration
    this.image = image
    this.url = url
  }

  getLyric() {
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }
    return new Promise((resolve, reject) => {
      getLyric(this.songMid).then((res) => {
        if (res.retcode === 0) {
          this.lyric = Base64.decode(res.lyric)
          resolve(this.lyric)
        } else {
          reject('no lyric')
        }
      })
    })
  }
}

// 歌手详情页、歌单 实例song
export function createSong(item) {
  return new Song({
    songId: item.songid,
    songMid: item.songmid,
    songName: item.songname,
    singerId: filterSingerId(item.singer),
    singerMid: filterSingerMid(item.singer),
    singerName: filterSinger(item.singer),
    albumId: item.albumid,
    albumMid: item.albummid,
    albumName: item.albumname,
    mvId: '',
    mvVid: '',
    mvName: '',
    duration: item.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${item.albummid}.jpg?max_age=2592000`,
    url: `http://thirdparty.gtimg.com/C100${item.songmid}.m4a?fromtag=38`
  })
}

// 专辑歌曲 实例song
export function createAlbumSong(item) {
  return new Song({
    songId: item.songid,
    songMid: item.songmid,
    songName: item.songname,
    singerId: filterSingerId(item.singer),
    singerMid: filterSingerMid(item.singer),
    singerName: filterSinger(item.singer),
    albumId: item.albumid,
    albumMid: item.albummid,
    albumName: item.albumname,
    mvId: '',
    mvVid: '',
    mvName: '',
    duration: item.interval,
    isonly: item.isonly,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${item.albummid}.jpg?max_age=2592000`,
    url: filterSongUrl(item.songmid, item.isonly)
  })
}

// 返回歌手作者数组
export function filterSinger(singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach((s) => {
    ret.push(s.name)
  })
  return ret
}
// 返回歌手作者数组
export function filterSingerId(singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach((s) => {
    ret.push(s.id)
  })
  return ret
}
// 返回歌手mid数组
export function filterSingerMid (singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach((s) => {
    ret.push(s.mid)
  })

  return ret
}
// 专辑歌曲url
export function filterSongUrl (songmid, isonly) {
  return `http://dl.stream.qqmusic.qq.com/C1001${songmid.substring(1)}.m4a?fromtag=38`
  // return `http://thirdparty.gtimg.com/C100${songmid}.m4a?fromtag=38`
}
