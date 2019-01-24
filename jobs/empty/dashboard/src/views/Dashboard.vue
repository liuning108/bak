<template>
  <el-container class="dashboard">
    <el-aside class="aside">
      <div class="dashTabs">
        
       <div v-for="item in tabs" :key="item.id" :class="{'active':item.isActive}" class="item" @click="switchTab(item.component)" >
           <i :class="item.icon"></i>
        </div>
       
      </div>
      <component v-bind:is="currentTabComponent"></component>
    </el-aside>
    <el-main class="main">
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script>
import DashList from '../components/DashList.vue'
import FavoriteList from '../components/FavoriteList'

  export default {
    mounted(){
      this.switchTab('DashList')
    },
    components:{
      DashList,
      FavoriteList
    },
     data(){
        return {
          currentTabComponent: null,
          tabs:[
            {component:"FavoriteList",icon:"el-icon-star-off",isActive:false},
            {component:"DashList",icon:"el-icon-share",isActive:true}
          ]
        }
     },
     methods: {

       switchTab(component) {

         this.tabs.forEach(element => {
            if(element.component===component){
              element.isActive=true;
            }else{
              element.isActive=false;
            }
         });
         this.currentTabComponent =component;
       },
     },
  }
</script>

<style lang="sass" scoped>
@import '../assets/styles/dashaside.sass'
.dashboard
  background: #f5f7fa
  .aside
    width: 200px !important
    background-color: #f5f7fa;
    box-shadow: 2px 0 3px 0 #e5ebf0;
  .main
    padding: 0px
</style>