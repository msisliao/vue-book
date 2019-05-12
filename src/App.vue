<template>
  <div class="app">
        <!-- 底部 -->
    <mt-tabbar ref="tabbar"  fixed>
      <mt-tab-item>
        <router-link :to="{name:'home'}" tag="div">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-shouye"></use>
          </svg>
          <h1>首页</h1>
        </router-link>
      </mt-tab-item>
      <mt-tab-item>
        <router-link :to="{name:'bookrack'}" tag="div">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon--"></use>
          </svg>
          <h1>书架</h1>
        </router-link>
      </mt-tab-item>
    </mt-tabbar>
    <!-- 页面视图 -->
    <keep-alive>
      <transition>
        <router-view v-if="$route.meta.keepAlive" :appref="$refs" ></router-view>
      </transition>
    </keep-alive>
    <transition>
      <router-view v-if="!$route.meta.keepAlive" :appref="$refs" ></router-view>
    </transition>
  </div>
</template>
<script>
import "./font/fonts-user";
export default {
  data() {
    return {
      flag: true,
      fag: true,
      boxheight: ""
    };
  },
  mounted() {
    this.boxheight = document.documentElement.clientHeight;
    console.log(this.boxheight);
  },

};
</script>
<style lang="scss" scope>
* {
  margin: 0;
  padding: 0;
}
body {
  background-color: #fff;
}
.app {
  background-color: #fff;
  margin-top: 30px;
  margin-bottom: 52px;
  .mint-header.is-fixed {
    z-index: 99;
  }
  .mint-header {
    height: 30px;
  }
  .mint-tabbar > .mint-tab-item.is-selected {
    color: #555;
    background-color: #efeff4;
  }
  .mint-header {
    background-color: #71b6e6;
  }
  .mint-tab-item {
    padding: 0;
  }
  .mint-tab-item-label {
    h1 {
      font-size: 12px;
    }
  }
  // 动画
  .v-enter {
    opacity: 0;
    transform: translateX(100%);
  }
  .v-leave-to {
    opacity: 0;
    transform: translateX(-100%);
    position: absolute;
  }
  .v-enter-active,
  .v-leave-active {
    transition: all 0.3s ease;
  }
}


</style>
