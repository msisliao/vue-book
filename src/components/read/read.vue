<template>
    <div class="read" ref='dvtop'>

     <div class="btn">
      <mt-button type="default" size="small" @click="backGo()" plain>返回</mt-button>
      <mt-button type="danger" size="small" @click="beforePage" plain>阅读上一章</mt-button>
       <mt-button type="danger" size="small" @click='getmulushow' plain>目录</mt-button>
       <mt-button type="danger" size="small" @click="nextPage" plain>阅读下一章</mt-button>
    </div>

        <div style="min-height:500px;padding-top:30px;">
            <h1 class="read-h1">{{con.title}}</h1>
            <div v-for="(item,i) in con.cpContent" :key="i">
                <p class="read-text" v-html="item"></p>
            </div>
        </div>

      <!-- 目录 -->
      <mulu :id="id" @readShow='readshows' v-show="showMulu" @closeLayer='backGo()'></mulu>

    </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import { MessageBox,Toast } from "mint-ui";
import { bookcontent, bookmulu, bookhy } from "../api/api.js";
import mulu from '../read/mulu'

export default {
    components:{mulu},
    data(){
      return{
          con: [],
          getBook:{},
          iss: "0",
          booklinkss: [],
          booktitle: [],

          id:this.$route.params.id,
          link: this.$route.params.link,
          bookhylist:{},
          showMulu:false
      }
  },
  created() {
      this.getBook = JSON.parse(window.localStorage.getItem("SHEFLBOOK")); // book/book.vue 存储的书籍信息
      this.getbookhy(this.getBook._id); // 获取小说id所对应的源   
      if(this.$route.params.showMulu){
          this.showMulu = true
      }
  },
  methods: {
    //获取小说资源 每本小说有多个资源  根据小说id获取小说的来源 
     getbookhy(id){
        bookhy(id).then(res=>{
          this.bookhylist = res.data;
          this.getmulu(this.bookhylist[0]._id);     //   根据源 获取目录数据 默认第一个源
        })
     },
    // 获取目录
    getmulu(id){
      this.booklinkss = []; //第N章内容
      this.booktitle = []; //第N章标题 push后数据叠加 现将数组数据清空
      var bookindexs = JSON.parse( window.localStorage.getItem("bookindex") || "{}" ); //章节位置
      
      bookmulu(id).then(res=>{   
       if(res.status==200){
             res.data.chapters.forEach( item => {
                 // 内容是根据link来获取的 将link发给服务器，由于// / & # 服务器是无法识别的 所以需要对link转码  最后服务器返回内容   
             this.booklinkss.push(encodeURIComponent(item.link))
             this.booktitle.push(item.title)
         });
       }
      // console.log(bookindexs); //obj {"5add3a5714ce4173d95e3e98":{"bookindex":3}}
       
        this.iss = bookindexs && bookindexs[this.getBook._id] ? bookindexs[this.getBook._id].bookindex  : this.iss;
        this.getcontent(this.booklinkss[this.iss]);    //  根据目录   获取内容   
      })      
    },
      //  获取内容 
      getcontent(link){
          var content = []
          bookcontent(link).then(res => {
             if(res.status == 200){
                var datas = res.data.chapter;
              //  console.log(datas);
                
                content.push({
                    // cpContent: datas.cpContent ? datas.cpContent.split("\n") : datas.body.split("\n"),
                    cpContent:datas.isVip?["vip章节，请购买VIP"]:(datas.cpContent ? datas.cpContent.split("\n") : datas.body.split("\n")),
                    title:datas.title
                })
                this.con = content[0]
             }
          })
          console.log(content);
          
      },
    //   上一章
    beforePage(){
      this.$refs.dvtop.scrollTop = 0
      if(this.iss<=0){Toast("已经是第一章了");return}
      this.iss--
      this.getBookindex()
      this.getmulu(this.bookhylist[0]._id); // 内容是根据目录来的 所以this.getmulu  然后将源id传给目录 默认第一个源
    },
    nextPage(){
     this.$refs.dvtop.scrollTop = 0;
     if(this.iss >= this.booktitle.length - 1){Toast("已经是第最后一章了");return}
     this.iss++
     this.getBookindex()
     this.getmulu(this.bookhylist[0]._id);

    },
    // 缓存阅读到哪个章节了
    getBookindex(){
      var bookindex = JSON.parse( window.localStorage.getItem("bookindex") || "{}" ); //章节位置
        bookindex[this.getBook._id] = { 
            bookindex : this.iss
        }
        window.localStorage.setItem('bookindex',JSON.stringify(bookindex))
    },
    // 点击目录的章节 子组件传给父组件
    readshows(index){
      this.showMulu = false
      this.iss = index
      this.getBookindex()
      this.getcontent(this.booklinkss[this.iss]);
      this.$refs.dvtop.scrollTop = 0;
   },
   //    点击显示目录
   getmulushow(){
     this.showMulu = !this.showMulu
    },
    backGo(){
      this.$router.push({name:'book'})
    }
  }
};
</script>
<style lang="scss" scoped>
.read {
  overflow-y: auto;
  z-index: 101;
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: #c4b395;
  padding: 20px;
  line-height: 24px;
  letter-spacing: 2px;
  .read-h1 {
    font-size: 20px;
  }
  .readheader {
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    height: 35px;
    background-color: rgba($color: #000000, $alpha: 0.5);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0px 6px;
    :nth-child(1) {
      font-size: 20px;
      color: #fff;
    }
    .readspan {
      color: #fff;
      font-size: 12px;
    }
  }
  .readheaders {
    position: fixed;
    top: 40px;
    right: 0;
    background-color: rgba($color: #000000, $alpha: 0.7);
    font-size: 14px;
    color: #fff;
    padding: 0px 5px;
    border-radius: 5px 0px 0px 5px;
  }
  .readbottom {
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 110;
    background-color: rgba($color: #000000, $alpha: 0.7);
    .mui-icon {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .readbottom-color {
      display: flex;
      justify-content: space-around;
      list-style: none;
      margin-bottom: 20px;
      li {
        width: 30px;
        height: 30px;
        border-radius: 50%;
      }
    }
    .readbottom-dv {
      display: flex;
      justify-content: space-around;
      align-items: center;
      .readbottom-ml {
        color: #fff;
        text-align: center;
        font-size: 14px;
      }
      .read-ss {
        color: #fff;
      }
      .readbottom-font {
        border: 1px solid #fff;
        padding: 5px 20px;
        border-radius: 3px;
        color: #fff;
      }
    }
  }
  h1 {
    font-size: 16px;
    color: #222;
  }
  .read-text {
    color: #222;
    text-indent: 2em;
  }
  .btn {
    display: flex; position: fixed;top:0;left:0;right:0;height:50px;background: #c4b395; padding-top: 10px;
    justify-content: center;
    button{margin: 0 10px;font-size: 12px;line-height: 1.2;height: 28px;color:#425faf;border-color:#666;
     &.mint-button--default{color:#333;}
    }
  }
  .read-hy {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    background-color: rgba($color: #000000, $alpha: 0.7);
    .mui-card {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 80%;
      max-height: 60%;
      overflow-y: auto;
      .yh-p {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
  }
  .active {
    color: #00c98c;
  }
}
</style>
