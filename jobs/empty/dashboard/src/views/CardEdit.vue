<template>
 <el-container class="cardContainer">
  <el-header class="cardHeader">
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right" class="cardBread">
        <el-breadcrumb-item class="cardItem" :to="{ path: '/main/dashboard/w3de974eb2538444ba519729' }">促销活动分析</el-breadcrumb-item>
        <el-breadcrumb-item>未命名的卡片</el-breadcrumb-item>
    </el-breadcrumb>
    </div>
    <div>
      <span class="cancelBtn">取消编辑</span>
      <el-button type="primary"  class="savebtn"  size="small">保存</el-button>
    </div>
  </el-header>
  <el-main class="cardMain">
    <div class="cardSet">
      <CardSet></CardSet>
    </div>
    <div class="gd-shadow"></div>
    <div class="setConfig">
     <ConfigBlocks></ConfigBlocks>
    </div>
    <div class="gd-shadow"></div>
    <div class="cardGraph">
      <PerviewCard></PerviewCard>
    </div>
    <div class="gd-shadow"></div>
    <div class="gConfig">
     <GConfig></GConfig>
    </div>



  </el-main>
</el-container>
</template>

<script>
  import draggable from 'vuedraggable'
  import CardSet from '../components/cardedit/CardSet.vue'
  import ConfigBlocks from '../components/cardedit/ConfigBlocks.vue'
  import GConfig from '../components/cardedit/GConfig.vue'
  import PerviewCard from '../components/cardedit/PerviewCard.vue'
  export default {
    
    components:{
      draggable,
      CardSet,
      ConfigBlocks,
      GConfig,
      PerviewCard
    },
    
  }
</script>

<style lang="sass" scoped>
@import '../assets/styles/cardedit.sass'
</style>