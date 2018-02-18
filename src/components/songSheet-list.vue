<template>
  <div class="songSheet-list">
    <div class="title" v-if="titleBar">
      <h3>{{navTitle}}</h3>
      <p>
        <span :class="hot" @click="selectSwitch(5)">最热</span>
        <span class="line">|</span>
        <span :class="newest" @click="selectSwitch(2)">最新</span>
      </p>
    </div>
    <ul>
      <li v-for="(item, index) in dataCont"
          :key="index"
          @click="selectItem(item)" :style="flex">
        <div class="img">
          <img v-lazy="imgUrl(item)">
          <span>{{listen_num(item) | getPlayback}}万</span>
        </div>
        <p class="text">{{title(item)}}</p>
        <p class="author" v-if="author(item)">{{author(item)}}</p>
      </li>
    </ul>
  </div>
</template>
<script>
  import {mapMutations, mapActions} from 'vuex'
  import {getPlayback} from 'common/js/util'

  export default {
    props: {
      data: {
        type: Array,
        default: () => []
      },
      // 长度
      len: {
        type: Number,
        default: -1
      },
      // 每行显示
      display: {
        type: Number,
        default: 3
      },
      // 数据类型来源
      typeData: {
        type: String,
        default: 'index'
      },
      // 是否带title
      titleBar: {
        type: Boolean,
        default: false
      },
      navTitle: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        select: true
      }
    },
    filters: {
      getPlayback
    },
    computed: {
      // 显示长度
      dataCont() {
        return this.len !== -1 ? this.data.slice(0, this.len) : this.data
      },
      // 每行几个
      flex() {
        if (this.display === 3) {
          return `flex: 0 0 33%`
        } else if (this.display === 2) {
          return `flex: 0 0 49%`
        }
      },
      hot() {
        return this.select ? 'active' : ''
      },
      newest() {
        return this.select ? '' : 'active'
      }
    },
    methods: {
      imgUrl(item) {
        switch (this.typeData) {
          case 'index':
            return item.cover
          case 'classify':
            return item.imgurl
          case 'classify-list':
            return item.cover_url_big
          case 'classify-plainList':
            return item.imgurl
        }
      },
      listen_num(item) {
        switch (this.typeData) {
          case 'index':
            return item.listen_num
          case 'classify':
            return item.listennum
          case 'classify-list':
            return item.access_num
          case 'classify-plainList':
            return item.listennum
        }
      },
      title(item) {
        switch (this.typeData) {
          case 'index':
            return item.title
          case 'classify':
            return item.dissname
          case 'classify-list':
            return item.title
          case 'classify-plainList':
            return item.dissname
        }
      },
      author(item) {
        switch (this.typeData) {
          case 'index':
            return ''
          case 'classify':
            return item.creator.name
          case 'classify-list':
            return item.creator_info.nick
          case 'classify-plainList':
            return item.creator.name
        }
      },
      // 跳转歌单详情
      selectItem(item) {
        let id
        switch (this.typeData) {
          case 'index':
            id = item.content_id
            break
          case 'classify':
            id = item.dissid
            break
          case 'classify-list':
            id = item.tid
            break
          case 'classify-plainList':
            id = item.dissid
            break
        }
        this.$router.push({
          path: `/index/songSheet?&id=${id}`
        })
      },
      selectSwitch(sortId) {
        this.select = !this.select
        this.$emit('selectSwitch', sortId)
      }
    }
  }
</script>
<style scoped lang="sass" type="text/sass">
  @import '~common/css/variable'
  @import '~common/css/mixin'

  .songSheet-list
    .title
      display: flex
      margin: 0 .2rem
      align-items: center
      h3
        flex: 1
        height: .5rem
        line-height: .5rem
      p
        .line
          padding: 0 .02rem
          color: $color-00003
        span.active
          color: $color-d93f30
    ul
      display: flex
      flex-wrap: wrap
      justify-content: space-between
      li
        padding-bottom: .12rem
        .img
          position: relative
          display: inline-block
          img
            width: 100%
          span
            position: absolute
            right: .05rem
            top: .05rem
            font-size: $font-size-1_0
            color: $color-fff
        .text
          @include no-warp-box(2)
          padding: .05rem .08rem 0
          font-size: $font-size-1_2
        .author
          font-size: $font-size-1_2
          padding: .05rem .08rem 0
          color: $color-999
</style>
