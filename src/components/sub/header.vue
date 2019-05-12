<template>
    <mt-header ref="header" fixed title="阅读器demo">
     <mt-button @click="goBack" slot="left" v-if="back">
        <span>返回</span>
      </mt-button>
 
      <mt-button @click="getsearch" slot="right" v-if="search">
        <span  class="mui-icon mui-icon-search"></span>
      </mt-button>
    </mt-header>
</template>
<script>
export default {
    props:['back','search','title'],
   methods: {
    goBack(){
      this.$router.back()
    },
     getsearch() {
      this.$router.push({ name: "search"});
    }
   },
}
</script>
