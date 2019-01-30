<template>
  <el-container class="dash">
  <el-header class="dashHeader">
     <div class="title">
       <span>活动分析</span>
     </div>
     <div class="dashOper">
       <el-button type="primary"  class="newPlus" icon="el-icon-plus" size="small" @click="addCard">新建卡片</el-button>
     <el-dropdown @command="handelCommand" trigger="click"  size="medium" :hide-on-click="hideclick">
      <span class="el-dropdown-link">
        <i class="el-icon-more opersMore" slot="reference"></i>
      </span>
      <el-dropdown-menu slot="dropdown" class="dashOperDropDown">
        <el-dropdown-item :command="{type:'screenfull',data:{}}"><i class="el-icon-rank"></i>投屏</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
     </div>
  </el-header>
  <el-main class="dashMain" >
    <div ref="boardPage" class="boardPage">
     <BoardCharts ref="boardcharts" :id="this.$route.params.id" ></BoardCharts>
    </div>
  </el-main>
  </el-container>
</template>

<script>
 import BoardCharts from '../components/BoardCharts.vue'
 import createCard from '../api/mock_db/card.js'
 import screenfull from 'screenfull'
 export default {
      data(){
        return {
          hideclick:true,
        }
      },
      components:{
        BoardCharts
      },
      methods: {
        addCard() {
            const {boardcharts}  = this.$refs
            boardcharts.addNode(createCard())
        },
        handelCommand(command){
          this[command.type](command.data)          
        },
        screenfull(){
          const {boardPage}  = this.$refs
          screenfull.request(boardPage);
        }
      },
  }
</script>

<style lang="sass" scoped>
@import '../assets/styles/dash.sass'

</style>