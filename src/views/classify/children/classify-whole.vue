<template>
  <div class="classify-whole">
    <!--header-->
    <son-header title="全部分类"></son-header>
    <zf-scroll class="scroll" ref="scroll" :data="wholeClass">
      <ul class="classify-list">
        <li v-for="(classItem, classIndex) in wholeClass" :key="classIndex">
          <h3>{{classItem.categoryGroupName}}</h3>
          <ul class="classify-item">
            <li v-for="(item, index) in classItem.items"
                :key="index"
                @click="selectClassItem(item)" v-html="item.categoryName"></li>
          </ul>
        </li>
      </ul>
    </zf-scroll>
  </div>
</template>
<script>
  import {getSongSheetClass} from 'api/index'
  import {playListMixin} from 'common/js/mixin'

  export default {
    mixins: [playListMixin],
    mounted() {
      setTimeout(() => {
        this.init()
      }, 20)
    },
    activated() {
      this.$emit('activatedLoad')
    },
    // keep-alive组件停用时调用
    deactivated() {
      this.$emit('leave')
    },
    // 页面卸载时停止调用
    beforeDestroy() {
      this.$emit('leave')
    },
    data() {
      return {
        wholeClass: []
      }
    },
    computed: {},
    methods: {
      init() {
        this.$emit('load')
        getSongSheetClass().then((res) => {
          if (res.code === 0) {
            let data = res.data.categories
            data.splice(0, 1)
            this.wholeClass = data
            console.log(data)
            this.$emit('loadOk')
          } else {
            this.$emit('loadNo', this.init)
          }
        }).catch(err => {
          console.log(err)
          this.$emit('loadNo', this.init)
        })
      },
      selectClassItem(item) {
        this.$router.push({
          path: `/index/classify-plainList?id=${item.categoryId}&title=${item.categoryName}`
        })
      }
    }
  }
</script>
<style scoped lang="sass" type="text/sass">
  @import '~common/css/variable'
  @import '~common/css/mixin'
  .classify-whole
    @include container
    .scroll
      position: fixed
      top: .4rem
      bottom: 0
      width: 100%
      max-width: 640px
      overflow: hidden
      .classify-list
        >li
          display: flex
          overflow: hidden
          border-bottom: .05rem solid $color-f8f8f8
          h3
            width: .6rem
            align-self: center
            text-align: center
          .classify-item
            margin-right: -1px
            flex: 1
            display: flex
            border-left: 1px solid $color-f8f8f8
            box-sizing: border-box
            flex-wrap: wrap
            justify-content: space-between
            overflow: hidden
            >li
              flex: 0 0 33%
              height: .4rem
              line-height: .4rem
              box-sizing: border-box
              border-bottom: 1px solid $color-f8f8f8
              border-right: 1px solid $color-f8f8f8
              text-align: center

</style>
