<template>
  <div class="dashboard-container">
    <div class="dashboard-text">『{{yiyan.hitokoto}}』</div>
    <div class="dashboard-text"><a @click="getYi">&nbsp;&nbsp;———— {{yiyan.from}}</a></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getYiYan } from '@/api/other'

export default {
  name: 'Dashboard',
  data(){
    return {
      yiyan:{}
    }
  },
  mounted(){
    this.init()
  },
  methods:{
    getYi() {
      let app = this;
      getYiYan().then(res=>{
        app.yiyan = res
      }).catch((res)=>{
        console.log(res)
      })
    },
    init(){
      this.getYi()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
