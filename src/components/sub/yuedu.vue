<template>
    <div class="yuedu">
        <mt-button type="primary" size="small" plain @click="addbook">{{flag?'加入书架':'撤出书架'}}</mt-button>
        <mt-button type="danger" size="small" @click="read">{{flag?'立即阅读':'继续阅读'}}</mt-button>
    </div>
</template>
<script>
import {mapState,mapMutations} from 'vuex'

export default {
     data () {
        return {
          flag:true
        }
    },
     props:['booklinks'], // 从book.vue 传来的id 
      watch:{
        '$route':'ifFlag',
      },
     computed: {
       ...mapState(['calbook','shuajiabook'])  //书籍信息  书架数据[]
     },
     created() {
       this.ifFlag()
     },
    methods: {
      ...mapMutations({
        setbook:'BOOK_UPDATE'
      }),
       ifFlag(){
         this.flag = false
          var carbooks = JSON.parse(window.localStorage.getItem('SHEFLBOOK') || '{}')
          var carbook = JSON.parse(window.localStorage.getItem('book'))
          if(carbook && carbook[carbooks._id]){
              this.flag=false
              this.setbook(false)
          }else{
              this.flag=true
              this.setbook(true)
          }
       },
        addbook(){
            this.flag=!this.flag
            var book= this.calbook; // calbook 是store里存储的籍信息【  SHEFLBOOK  】
            var carbook = JSON.parse(window.localStorage.getItem('book') || '{}')
           if(!this.flag){ //加入书架
              carbook[book._id] = {
                  cover: book.cover,
                  flag:!this.flag,
                  title: book.title,
                  lastChapter:book.lastChapter,
                  id: book._id,
                  author:book.author,
                  chapterIndexCache: 0,
                  bookSource: 0,
                  pageIndexCache: 0,
               }
              this.setbook(false)
              window.localStorage.setItem('book', JSON.stringify(carbook))
          }else{
              delete carbook[book._id]
                this.setbook(true) //设置的布尔值
                window.localStorage.setItem('book', JSON.stringify(carbook))
          }
        },
        read(){
          this.$router.push({name:'read',params:{id:this.booklinks}}) //从book.vue 传来的id  跳转时把id带到详情
        }
    },
}
</script>
<style lang="scss" scoped>
.yuedu {
    .mint-button--primary.is-plain{
    color: #63b1e6;
    border: 1px solid #63b1e6;
  }
  .mint-button--danger{
    background-color: #63b1e6;
  }
  display: flex;
  justify-content: space-around;
  padding: 15px 10px 10px;
  .mint-button--small {
    padding: 8px 33px;
    height: 100%;
  }
}
</style>

