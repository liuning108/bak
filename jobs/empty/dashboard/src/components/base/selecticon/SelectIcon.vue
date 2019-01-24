<template>

<el-popover
  placement="center"
  width="190"
  :visible-arrow="false"
  trigger="click"
  v-model="visible">
  <ul class="select-icon-ul">
    <li @click="selected(option)" v-for="(option,index) in options" :key="index">
      {{option.label}}
    </li>
  </ul>
  <div  slot="reference" class="icon-select">
    <div class="desc">
      <i class="el-icon-star-on"></i>
      <span>{{item.label}}</span>
    </div>
    <i class="el-icon-arrow-down select-down"></i>
    
  </div>
</el-popover>
  
</template>

<script>
 export default {
    props: {
      options: {
        type: Array,
      },
    },
    created(){
       this.item=this.options[0];
       
    },
     data(){
       return { 
         visible:false,
         item:{}
       }
     },
     methods: {
       selected(option) {
         this.visible=false
         this.item=option
         this.$emit('selected',option);
       },
     },
     
 }
</script>

<style lang='sass' scoped>
@import './style.sass'
</style>