<template>
  <div class="boardcharts">
    <Loading v-if="isLoding"></Loading>
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
                <div class="title">未命名的卡片</div>
              </div>
              <div class="main">
                <component ref="gNode" :is="item.type" :id="item.i" :key="item.i"></component>
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
import {debounce} from "lodash"

  export default {
    components:{
      Loading,
      GridLayout: VueGridLayout.GridLayout,
      GridItem: VueGridLayout.GridItem,
    },
    props: {
      id: {
        type: String,
      },
    },
    created(){
    },
    mounted(){
      setTimeout(()=>{
        this.isLoding=false;
       },1000);
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
           console.log('watch--')
           this.saveNodes()
           
        }
      }
    },
    methods: {
      saveNodes:debounce(function(){
        console.log('saveNode',this.nodes)
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
        node.type="Node1";
        this.nodes.push(node)
      },
      handleCommand(command){
        
        this[command.type](command.item);
      },
      removeNode(item){
         const {i} = item; 
         this.nodes=this.nodes.filter(n=>n.i!=i);
         console.log(this.nodes.length)
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