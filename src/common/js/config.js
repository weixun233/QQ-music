export const playMode = {
  sequence: 0,  // 顺序播放
  loop: 1,      // 循环播放
  random: 2     // 随机播放
}

// 添加数据 (数组、val、函数、maxLen)
export function insertArray(arr, val, compare, maxLen) {
  const index = arr.findIndex(compare)
  // 在第一条 不用处理 return出去
  if (index === 0) {
    return
  }
  // 非第一条删除
  if (index > 0) {
    arr.splice(index, 1)
  }
  arr.unshift(val)
  // 超出，抛出最后一条
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }

  return arr
}

// 删除数据 (数组, 函数)
export function deleteArray (arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }

  return arr
}

// 当前列表是否存在插入的歌曲 (返回index)
export function currentIndex (list, song) {
  return list.findIndex((item) => {
    if (song.id) {
      return item.id === song.id
    } else if (song.songid) {
      return item.songid === song.songid
    }
  })
}
