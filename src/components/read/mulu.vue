<template>
    <div class="mulu" :style="{'height':heihgS}">
        
      <mt-header fixed :title="title.title">
        <div @click="getback" slot="left">
          <mt-button icon="back">返回</mt-button>
        </div>
        <mt-button slot="right">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-shudan"></use>
          </svg>
        </mt-button>
      </mt-header>


      <div class="paixu-p">
        <span>共{{list.length}}章</span>
        <span @click="sortFn">
          <span v-if="flag">倒序</span>
          <span v-else>正序</span>
        </span>
      </div>


        <ul>
            <li v-for="item in list" :key="item.id" @click='getMulu((item.order)-1)'>{{item.title}} <em style="color:red">{{item.isVip?'vip':null}}</em></li>
        </ul>
    </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import { book, bookmulu,books } from "../api/api.js";
import { Toast ,Indicator} from "mint-ui";

export default {
    props:['id'],
    data(){
        return {
          bookid:this.id,  // read传过来id
          list:[],
          allNum:'',
          Hei:'',
          title:{},
          flag:true
        }
    },
    created() {
        this.getlist()
         this.title = JSON.parse(window.localStorage.getItem("SHEFLBOOK")) || {};
    },
    mounted() {
       this.Hei = document.documentElement.clientHeight;        
    },
    computed: {
        heihgS(){
            return this.Hei+'px'
        }
    },
   methods: {
       getlist(){
           Indicator.open()
          book(this.bookid).then( res => {
              let bid = res.data[0]._id
              bookmulu(bid).then(res => {  //根据书籍id获取目录
                   Indicator.close()
                   console.log(res)
                  this.list = res.data.chapters
                  this.allNum = this.list.length                  
              })
          })
       },
       getback(){
          this.$emit('closeLayer')
       },
       sortFn(){
        this.flag = !this.flag;
        this.list.reverse()
       },
       getMulu(i){
         this.$emit('readShow',i) //将点击的章节传给父组件 read.vue
      }
   },

}
</script>
<style lang="scss" scoped>
.mulu {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
    height: 100%;
  overflow-y: auto;
  z-index: 9999;
  background-color: #fff;
ul{padding-top: 55px;}
  li {
    font-size: 13px;padding-left: 20px;line-height: 36px;border-bottom: 1px solid #eee;
    color: #333;
  }
  .paixu-p {
    position: fixed;
    top: 30px;
    left: 0;
    width: 100%;
    background-color: #fff;
    z-index: 110;
    display: flex;
    justify-content: space-between;
    padding: 0px 20px;
    color: #6b2662;
    font-size: 12px;
  }
}
</style>
