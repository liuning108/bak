<template>
  <div class="boardcharts">
    <Loading v-if="isLoding"></Loading>
    <div v-if="nodes.length<=0 && !isLoding">
      <Empty msg="当前页面无卡片，您可点击右侧［新建卡片］添加"></Empty>
    </div>
     <grid-layout
            :layout.sync="nodes"
            :col-num="12"
            :row-height="30"
            :is-draggable="true"
            :is-resizable="true"
            :is-mirrored="false"
            :vertical-compact="true"
            :margin="[10, 10]"
            :use-css-transforms="true"
    >
     <grid-item v-for="(item,index) in nodes" :key="index"
                   :x="item.x"
                   :y="item.y"
                   :w="item.w"
                   :h="item.h"
                   :i="item.i"
                   @resized="resizeEvent"
                   drag-allow-from=".vue-draggable-handle"
                   drag-ignore-from=".no-drag">
        <div class="dashContext">
          <div class="vue-draggable-handle">
            <div class="ve-bg-desc"></div>
            <div class="ve-bg-desc"></div>
          </div>
          <div class="nodeOper">
            <i class="el-icon-tickets"></i>
            <i class="el-icon-info"></i>
            <el-dropdown @command="handleCommand" trigger="click"  size="medium" visible-arrow="false">
            <span class="el-dropdown-link">
              <i class="el-icon-setting" slot="reference"></i>
            </span>
            <el-dropdown-menu slot="dropdown" class="nodeOperDropDown">
              <el-dropdown-item :command="{type:'editNode',item}"><i class="el-icon-edit-outline"></i>编辑</el-dropdown-item>
              <el-dropdown-item :command="{type:'removeNode',item}"><i class="el-icon-delete"></i>删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          </div>
          <div class="no-drag">
            <div class="graph-container">
              <div class="header">
                <div class="title">{{item.name}}</div>
              </div>
              <div class="main">
                <component ref="gNode" :is="item.type"  :ds-config="item.dsConfig"   :id="item.i" :key="item.i"></component>
              </div>
            </div>
          </div>
       </div>
    </grid-item>
    </grid-layout>
  </div>
</template>

<script>
import Loading from './Loading'
import VueGridLayout from 'vue-grid-layout';
import Empty from './Empty'
import {debounce} from "lodash"
import dashApi from '../api/dashboard.js'
  export default {
    components:{
      Loading,
      GridLayout: VueGridLayout.GridLayout,
      GridItem: VueGridLayout.GridItem,
      Empty
    },
    props: {
      id: {
        type: String,
      },
    },
    created(){
    },
    mounted(){
      this.getBoardNodes();
      
    },
    data(){
       return {
         isLoding:true,
         nodes:[]
       }
    },
    watch:{
      nodes: {
        deep: true,
        handler(val,oldValue) {
           this.saveNodes()           
        }
      }
    },
    methods: {
     async getBoardNodes(){
        var nodes = await dashApi.getBoardNodes(this.id)
        this.nodes=nodes;
        this.isLoding =false;
      },
      saveNodes:debounce(function(){
        dashApi.saveNodes(this.id,this.nodes);
      },1000),
      resizeEvent(i, newH, newW, newHPx, newWPx){
        const {gNode} =  this.$refs;
        gNode.forEach(element => {
           if(element.id===i){
              element.resize(i, newH, newW, newHPx, newWPx)
           }
        });
      },
      addNode(node) {
        if(this.isLoding)return;
        this.nodes.push(node)
      },
      handleCommand(command){
        
        this[command.type](command.item);
      },
      removeNode(item){
         const {i} = item; 
         this.nodes=this.nodes.filter(n=>n.i!=i);
      },
      editNode(item){
        let url = '/main/card/'+ this.id+'/'+item.i;
        this.$router.push(url);
      }
    },
  }
</script>

<style lang="sass" scoped>
@import '../assets/styles/boardchart.sass'
@import '../assets/styles/graph.sass'
</style>