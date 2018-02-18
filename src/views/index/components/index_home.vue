<template>
  <div class="home">
    <zf-scroll :data="dataCont" class="scroll" ref="scroll" :style="windowWidth">
      <ul>
        <router-link tag="li" to="/index/my-latelyPlay">
          <i class="iconfont icon-zuijinbofang"></i>
          <span>最近播放</span>
        </router-link>
        <router-link tag="li" to="/index/my-follow">
          <i class="iconfont icon-geshou"></i>
          <span>我的关注</span>
        </router-link>
        <router-link tag="li" to="/index/my-live">
          <i class="iconfont icon-icon-3"></i>
          <span>我喜欢的</span>
        </router-link>
      </ul>
      <!--自建歌单-->
      <my-song-sheet :title="myTitle"
                     :songSheet="songSheet"
                     noTitle="你还没有创建歌单哦"
                     @deleteConfirm="deleteConfirm"></my-song-sheet>
      <!--收藏歌单-->
      <my-song-sheet :title="collectionTitle"
                     :songSheet="collectSheet"
                     noTitle="你还没有收藏歌单哦"
                     @deleteConfirm="deleteConfirm"></my-song-sheet>
    </zf-scroll>
    <eject-tool ref="tool"
                :songItem="songItem"
                :Delete="Delete"
                :Share="Share"
                :Xiazai="Xiazai"
                @Delete="confirm"></eject-tool>
    <zf-confirm ref="confirm"
                title="确定要删除此歌单吗?"
                confirmBtnText="删除"
                @confirm="confirmClear"></zf-confirm>
  </div>
</template>
<script>
  import {mapState, mapMutations} from 'vuex'
  import MySongSheet from './my-songSheet'
  import {playListMixin} from 'common/js/mixin'

  export default {
    mixins: [playListMixin],
    components: {MySongSheet},
    props: {
      // navIndex
      navIndex: {
        type: Number,
        default: 0
      }
    },
    created() {
      this.Delete = true
      this.Share = true
      this.Xiazai = true
    },
    data() {
      return {
        songItem: {}
      }
    },
    computed: {
      ...mapState('home', [
        'songSheet',
        'collectSheet'
      ]),
      windowWidth() {
        return `width: ${window.innerWidth}px`
      },
      dataCont() {
        return this.songSheet.concat(this.collectSheet)
      },
      myTitle() {
        return `创建的歌单(${this.songSheet.length})`
      },
      collectionTitle() {
        return `收藏的歌单(${this.collectSheet.length})`
      },
      sheetData() {
        return this.songSheet.concat(this.collectSheet)
      }
    },
    methods: {
      ...mapMutations('home', [
        'noNew_songSheet',
        'delete_collectSheet'
      ]),
      // 弹出菜单
      deleteConfirm(item) {
        this.songItem = item
        this.$refs.tool.show()
      },
      confirm() {
        this.$refs.confirm.show()
      },
      // 删除歌单
      confirmClear() {
        // 删除自建的
        if (this.songItem.type === 'mySongSheet') {
          this.noNew_songSheet(this.songItem)
        } else {
          // 取消收藏的
          this.delete_collectSheet(this.songItem)
        }
      }
    }
  }
</script>
<style scoped lang="sass" type="text/sass">
  @import '~common/css/variable'
  @import '~common/css/mixin'
  .home
    height: 100%
    .scroll
      position: fixed
      top: 0
      bottom: 0
      overflow: hidden
      >div
        height: 100%
      ul
        height: 100%
        li
          display: flex
          align-items: center
        i
          flex: 0 0 .3rem
          padding-left: .1rem
          color: $color-d93f30
        span
          height: .4rem
          line-height: .4rem
          flex: 1
          border-bottom: 1px solid $color-00001
</style>
