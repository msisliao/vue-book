<template>
    <div class="fenlei">
        <ul v-for="item in booklist" :key='item.id' class="mui-table-view mui-table-view-striped mui-table-view-condensed">
            <router-link tag='li' :to="{name:'book',params:{id:item._id}}">
                <div class="mui-table">
                    <div class="mui-table-cell mui-col-xs-12">
                        <img class="mui-media-object mui-pull-left" :src="item.cover" alt>
                        <h4 class="mui-ellipsis">{{item.title}}</h4>
                        <h5>{{item.author}}</h5>
                        <p class="mui-h6 mss">{{item.shortIntro}}</p>

                        <div class="mui-table-cell mui-col-xs-12 smalltag">
                        <p class="m-p1">{{item.isSerial?'连载中':'完结'}}</p>
                        <p class="m-p2">{{item.majorCate}}</p>
                        <p class="m-p1">{{item.minorCate}}</p>
                        <p class="m-p2">
                            <span>{{item.latelyFollower>1000?parseInt(item.latelyFollower/1000)+'k':item.latelyFollower}}</span>人气
                        </p>
                    </div>

                    </div>

                </div>

            </router-link>
        </ul>
    </div>
</template>
<script>
import { bootd } from "../api/api";
export default {
  props: ["booklistId"],
  data() {
    return {
      booklist: []
    };
  },
  mounted() {
    this.getlist(this.booklistId.id);
  },
  methods: {
    getlist(id) {
     // this.$axios.get(`/api/recommendPage/books/${id}`) == bootd(id)  效果是一样的
     //每个分类id下对应的数据  子组件接收父组件传过来的id 获取对应的数据
      bootd(id).then(res => {
        var arrdata = res.data.data;
        arrdata.map(item => {
          this.booklist.push(item.book);
        });
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.fenlei {
  margin-top: 10px;
  background-color: #fff;
  p {
    font-size: 12px;
    color: #666;
  }
  img {
    max-width: 66px;
    height: 100px;vertical-align: middle
  }
  h5{color:#71b6e6;font-size: 12px;}
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
      font-size: 12px;line-height: 1.5;
    }

  }
  li{padding:10px}
  .smalltag{
      display: flex; padding-left:75px;
      p{color:#aaa;border:1px solid #eee;border-radius: 3px;padding: 0 2px;margin-right: 10px;transform: scale(.9)}
  }
}
</style>
