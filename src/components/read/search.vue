<template>
  <div>
           <vheader :back=true ></vheader>



    <div class="searsh-top"> <input type="" placeholder="小说关键字" v-model="keyword" @keyup.enter="getList" />
      <span @click="getList" class='btn'>搜索</span>
    </div>
    <section ref="load" :style="{height:boxheight}" class="boxs">
      <mt-loadmore :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :auto-fill="false" ref="loadmore">
        <div class="fenlei">
          <ul v-for="item in searchList" :key='item.id' class="mui-table-view mui-table-view-striped mui-table-view-condensed">
            <router-link tag='li' :to="{name:'book',params:{id:item._id}}">
              <div class="mui-table">
                <div class="mui-table-cell mui-col-xs-12">
                  <img class="mui-media-object mui-pull-left" :src="item.cover|getcover" alt>
                  <h4 class="mui-ellipsis">{{item.title}}</h4>
                  <h5>{{item.author}}
                    <span class="gray">{{item.retentionRatio}}%读者存留</span>
                  </h5>
                  <p class="mui-h6 mss">{{item.shortIntro}}</p>

                  <div class="mui-table-cell mui-col-xs-12 smalltag">
                    <p class="m-p1">{{item.isSerial?'连载中':'完结'}}</p>
                    <p class="m-p2" v-if="item.wordCount">{{item.wordCount|getcound}}字</p>
                    <p class="m-p1">{{item.cat||item.minorCate}}</p>
                    <p class="m-p2">
                      <span>{{item.latelyFollower>1000?parseInt(item.latelyFollower/1000)+'k':item.latelyFollower}}</span>人气
                    </p>
                  </div>
                </div>
              </div>
           </router-link>
          </ul>
          <div class='emptydata' v-if="searchList.length<1">
            请输入关键字查询相关书籍
          </div>
        </div>
      </mt-loadmore>
    </section>
  </div>
</template>

<script>
import vheader from "../sub/header"; 
import { booksearch } from "../api/api.js";
import { coverimg } from "../time/time.js";

export default {
  components:{
    vheader
  },
  data() {
    return {
      keyword: "",
      allLoaded: false,
      boxheight: "",
      searchList: [],
      count:1
    };
  },
  props: ["appref"],
  mounted() {
    // 获取当前列表的自适应高度
    this.boxheight = document.documentElement.clientHeight - 120 + "px";
  },
  filters: {
    getcover(cover) {
      if (cover.indexOf(coverimg) > -1) {
        return cover;
      }
      return coverimg + cover;
    },
    getcound(wordCount) {
      return wordCount > 10000 ? parseInt(wordCount / 10000) + "万" : wordCount;
    }
  },

  methods: {
    //获取搜索的书籍
    getList() {
      booksearch(this.keyword).then(res => {
        if (res.data.ok) {
          this.searchList = res.data.books.slice(0, 15);
        }
      });
    },
    // 上拉加载
    loadBottom() {
       this.allLoaded = true;
       booksearch(this.keyword).then(res=>{
         if(this.searchList.length==res.data.books.length){
           this.allLoaded = false
         }else{
           this.searchList = res.data.books.splice(0,this.count*15+15)
           this.count++
           this.allLoaded = false
         }
       })
    },

  }
};
</script>

<style lang="scss" scoped="">
.searsh-top {
  border-bottom: 1px solid #ddd;
  position: relative;
  display: flex;
  padding: 6px 15px;
  padding-right: 0;
  color: #fff;
  align-items: center;
  color: #666;
  input {
    flex: 1;
    border: 1px solid #eee;
    border-radius: 3px;
    padding: 8px 5px;
    font-size: 12px;
    outline: 0;
  }
  span {
    width: 50px;
    text-align: center;
  }
}
.gray {
  color: rgb(230, 136, 29);
  margin-left: 10px;
}

.btn {
  font-size: 13px;
}

.fenlei {
  margin-top: 10px;
  background-color: #fff;
  p {
    font-size: 12px;
    color: #666;
  }
  img {
    max-width: 66px;
    height: 100px;
    vertical-align: middle;
  }
  h5 {
    color: #71b6e6;
    font-size: 12px;
  }
  .mss {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    word-break: break-all;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .mui-table {
    h4 {
      color: #333;
      font-size: 12px;
    }
    p {
      font-size: 12px;
      line-height: 1.5;
    }
  }
  li {
    padding: 10px;
  }
  .smalltag {
    display: flex;
    padding-left: 75px;
    p {
      color: #aaa;
      border: 1px solid #eee;
      border-radius: 3px;
      padding: 0 10px;
      margin-right: 10px;
      transform: scale(0.9);
    }
  }
}
.boxs{overflow-y: scroll;}
.emptydata{font-size: 14px;padding: 30px;text-align: center;color:#666;}
</style>
