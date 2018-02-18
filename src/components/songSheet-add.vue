<template>
  <zf-eject-bottom ref="songSheetAdd">
    <div class="control" @touchstate.stop @click.stop>
      <h3>添加到歌单</h3>
      <div class="scroll-wrapper">
        <zf-scroll :data="songSheet" class="scroll">
          <div>
            <div class="addSong" @click.stop="EjectSongSheet">
              <i class="iconfont icon-jia"></i>
              <span>新建歌单</span>
            </div>
            <ul v-if="songSheet.length > 0">
              <li v-for="(item, index) in songSheet" @click.stop="addSong(index, item)" :key="index">{{item.title}}</li>
            </ul>
          </div>
        </zf-scroll>
      </div>
      <!--没有歌单提示-->
      <zf-no-result class="no-result" title="你还没有自己的歌单哦! 快去新建一个吧" v-if="songSheet.length === 0"></zf-no-result>
      <!--// 新建歌单弹出-->
      <zf-confirm ref="confirm"
                  title="新建歌单"
                  :confirmInput="confirmInput"
                  :placeholder="placeholder"
                  :intercept="intercept"
                  @confirm="addSongSheet"
                  @intercept="interceptConfirm">
      </zf-confirm>
      <p class="back" @click.stop="hide">取消</p>
      <!--// 提示语-->
      <zf-hint ref="promptHint" position="middle">{{Hint}}</zf-hint>
    </div>
  </zf-eject-bottom>
</template>
<script>
  import {mapState, mapMutations, mapActions} from 'vuex'

  export default {
    created() {
      this.confirmInput = true              // confirm input 输入框显示
      this.placeholder = '请输入歌单名称'   // confirm 虚拟提示语
      this.intercept = true
    },
    mounted() {
    },
    props: {
      // 批量song
      songs: {
        type: Array,
        default: () => []
      },
      // 单曲song
      song: {
        type: Object,
        default: () => {}
      }
    },
    data() {
      return {
        selectLen: 0,    // 歌曲数目
        Hint: ''         // 提示语
      }
    },
    computed: {
      ...mapState('home', [
        'songSheet'
      ])
    },
    methods: {
      ...mapMutations('home', [
        'new_songSheet',
        'set_songSheet',
        'batchSet_songSheet'
      ]),
      hide() {
        this.$refs.songSheetAdd.hide()
      },
      show() {
        this.$refs.songSheetAdd.show()
      },
      // 输入歌单名
      EjectSongSheet() {
        this.$refs.confirm.show()
      },
      // 判断歌单是否存在
      interceptConfirm(inputText) {
        let index = this.songSheet.findIndex((item) => {
          return item.title === inputText
        })
        if (index > -1) {
          this.Hint = '歌单名已存在'
          this.$refs.promptHint.show()
        } else if (this.songSheet.length >= 20) {
          this.Hint = '歌单数目不能大于20，请删除不经常使用的歌单!'
          this.$refs.promptHint.show()
        } else if (inputText === '') {
          this.Hint = '歌单名不能为空'
          this.$refs.promptHint.show()
        } else {
          this.addSongSheet(inputText)
        }
      },
      // 新建歌单
      addSongSheet(title) {
        this.$refs.confirm.hide()
        this.new_songSheet(title)
      },
      // 选择添加歌单 +歌曲
      addSong(index, item) {
        this.Hint = item.title
        // 批量添加
        if (this.songs.length > 0) {
          this.selectLen = this.songs.length
          this.batchSet_songSheet({
            songs: this.songs,
            index
          })
        } else if (this.song.id || this.song.songid) {
          // 单曲添加
          this.selectLen = 1
          this.set_songSheet({
            song: this.song,
            index
          })
        }

        this.$emit('selectItem', this.selectLen, this.Hint)
        this.hide()
      }
    }
  }
</script>
<style scoped lang="sass" type="text/sass">
  @import '~common/css/variable'
  @import '~common/css/mixin'

  .control
    width: 100%
    height: 3.45rem
    position: absolute
    left: 0
    bottom: 0
    background: $color-f8f8f8
    h3
      height: .4rem
      line-height: .4rem
      text-align: center
      box-sizing: border-box
      border-bottom: 1px solid $color-00001
    .scroll-wrapper
      width: 100%
      height: 2.65rem
      .scroll
        overflow: hidden
        height: 100%
        .addSong
          height: .4rem
          line-height: .4rem
          padding: 0 .2rem
        ul
          li
            height: .4rem
            line-height: .4rem
            padding: 0 .2rem
            border-top: 1px solid $color-00001
    .back
      height: .4rem
      line-height: .4rem
      text-align: center
      box-sizing: border-box
      border-top: 1px solid $color-00001
    .no-result-wrapper
      display: flex
      align-items: center
      justify-content: center
      height: 70%
</style>
