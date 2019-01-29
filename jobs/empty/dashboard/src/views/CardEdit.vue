<template>
 <div class="full-container">
  <Loading v-if="isLoading"></Loading>
  <el-container  v-show="!isLoading" class="cardContainer">
    <el-header    class="cardHeader">
      <div>
        <el-breadcrumb separator-class="el-icon-arrow-right" class="cardBread">
          <el-breadcrumb-item class="cardItem" :to="{ path: '/main/dashboard/w3de974eb2538444ba519729' }">促销活动分析</el-breadcrumb-item>
          <el-breadcrumb-item>{{card.name}}</el-breadcrumb-item>
      </el-breadcrumb>
      </div>
      <div>
        <span class="cancelBtn">取消编辑</span>
        <el-button type="primary"  class="savebtn"  size="small" @click="saveNode()">保存</el-button>
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
</div>
</template>

<script>
  import draggable from 'vuedraggable'
  import CardSet from '../components/cardedit/CardSet.vue'
  import ConfigBlocks from '../components/cardedit/ConfigBlocks.vue'
  import GConfig from '../components/cardedit/GConfig.vue'
  import PerviewCard from '../components/cardedit/PerviewCard.vue'
  import Loading from '../components/Loading.vue'
  import { createNamespacedHelpers } from "vuex";
  const { mapState,mapActions } = createNamespacedHelpers("cardedit");
  export default {
    components:{
      draggable,
      CardSet,
      ConfigBlocks,
      GConfig,
      PerviewCard,
      Loading
    },
    computed: {
      ...mapState(['card']),
      ...mapState(['isLoading'])
    },

    mounted(){
      //getNodeById(pid,id)
      const { bid ,cid } =this.$route.params;
      this.getNodeById({bid,cid})
      console.log("Edit",this.$route.params) 
    },
    methods: {
      ...mapActions(['getNodeById']),
      ...mapActions(['saveNode']),
      
    },
    
  }
</script>

<style lang="sass" scoped>
@import '../assets/styles/cardedit.sass'
</style>