<template>
    <div class="home">
<vheader :search=true></vheader>



        <mt-swipe :auto="4000">
            <mt-swipe-item v-for="(item,i) in booklunbo" :key="i"><img :src="item.img" alt @click='lunboFn(item.link)'></mt-swipe-item>
        </mt-swipe>
        <!-- 分类 -->
        <div class="con" v-for="item in booktitle" :key="item.id">
            <p class="p1">{{item.title}}</p>
            <items :booklistId='{id:item._id}'></items>
            <div class="shux">
                <router-link :to="{name:'list',params:{id:item._id}}" tag="p"> 查看更多>> </router-link>
            </div>

        </div>

    </div>
</template>
<script>
import vheader from "../sub/header"; 
export default {
  components:{
    vheader:vheader
  },
  data() {
    return {
      booklunbo: {},
      booktitle: {}
    };
  },
  created() {
    this.getbook();
  },
  methods: {
    getbook() {
      //轮播图
      this.$axios
        .get("/api/recommendPage/node/spread/575f74f27a4a60dc78a435a3?pl=ios")
        .then(res => {
          if (res.data.ok) {
            this.booklunbo = res.data.data;
            console.log(this.booklunbo);
          }
        });
      // 首页分类数据
      this.$axios
        .get("/api/recommendPage/nodes/5910018c8094b1e228e5868f")
        .then(res => {
          let arr = res.data.data;
          if (res.data.ok) {
            this.booktitle = arr.filter(item => {
              return item.title != "m站顶部banner";
            });
          }
        });
    },
    // 点击轮播图跳转
    lunboFn(id) {
        console.log(id);
       this.$router.push({ name: "book", params: { id: id } });
    }
  }
};
</script>
<style lang="scss" scope>
.mint-swipe {
  height: 120px;
  img {
    width: 100%;
  }
}
.con {
  margin-top: 10px;
}
.p1 {
  font-size: 13px;
  color: #333;
  border-left: 2px solid #71b6e6;
  padding-left: 10px;
  margin-bottom: 10px;
  margin-left: 10px;
}
.shux {
  text-align: center;
  padding-top: 5px;
  padding-right: 10px;
  p {
    font-size: 12px;color:rgb(233, 56, 40)
  }
}
</style>

