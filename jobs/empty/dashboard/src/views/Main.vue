<template>
<el-container class="main">
  <el-header class="mainHeader">
    <span class="logo">
      <img  src="../assets/images/logo-icon-small.png"/>
      <span class="title">{{title}}</span>
    </span>
     <div class="menu">
      
       <div @click="toMenu(item)" v-for="item in menus" :key="item.id" class="item" :class="{active:item.isActive}">
         <i  :class="item.icon"></i>
         <div class="mtitle">{{item.name}}</div>
       </div>
      
     </div>
     <div class="userinfo"></div>
  </el-header>
  <el-main class="mainBody">
      <router-view></router-view>
  </el-main>
</el-container>

</template>

<script>
import userApi from '../api/user.js'
//兴盛优选
  export default {
    mounted(){
      userApi.getDataSource().then(
        (datasource)=>{
         this.$router.push("/main/dashboard/w3de974eb2538444ba519729");
        }
      )

      
    },
    data(){
      return {
        title: '兴盛优选',
        menus: [
          {id:"dashboard",name:'仪表板',icon:'el-icon-menu-shujubao',isActive:true,    url:"/main/dashboard/w3de974eb2538444ba519729"},
          {id:"datacenter",name:'数据中心',icon:'el-icon-menu-shujuyuan',isActive:false,url:"/main/data-center"}
        ]
      }
    },
    methods: {
      toMenu(item){
        this.menus.forEach(item => {
          item.isActive = false;
        });
        item.isActive = true;
        this.$router.push(item.url);
      }
    },
  }
</script>

<style lang="sass" scoped>
@import '../assets/styles/main.sass'
</style>