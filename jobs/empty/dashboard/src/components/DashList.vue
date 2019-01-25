<template>
  <el-container class="dash-aside">
    <el-header class="dash-header">
      <div class="node-container">
        <div class="node-container-name">仪表板</div>
        <div class="node-container-option">
          <i class="el-icon-edit-outline"></i>
        </div>
      </div>
    </el-header>
    <div class="dash-divider-horizontal"></div>
    <el-main class="dash-main">
      <el-tree :data="data" 
               :expand-on-click-node="true"
               icon-class="''"
               class="dash-tree"
               :indent="0"
               @node-click="handleNodeClick">

              <span class="custom-tree-node"  :class="{'leaf-node':data.isLeaf,'leaf-active':data.isActive}" slot-scope="{ node, data }">
                <i  v-if="!data.isLeaf" :class="data.isOpen ? 'el-icon-caret-bottom' : 'el-icon-caret-right' "></i>
                <span :style="{'padding-left':(10*(node.level-1))+'px'}">{{data.label}}</span>
              </span>

      </el-tree>
    </el-main>
  </el-container>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapActions } = createNamespacedHelpers("dashboard");
const { mapState: userState } = createNamespacedHelpers("user");
// export default {
//   computed: {
//     ...userState(['user'])
//   },
//   mounted(){
//     this.getDashListByUserId(this.user.id);
//   },
//   methods: {
//     ...mapActions(['getDashListByUserId'])
//   },
// }
export default {
  data() {
    return {
      data: [
        {
          label: "连锁零售",
          children:[
            {label: "活动分析",isLeaf:true,isActive:false}
          ],
          isLeaf:false,
          icon:"el-icon-arrow-right",
          isOpen:false,
        },
        {
          label: "活动分析",
          id:1,
          isLeaf:true,
          isActive:false,
        },
      ],

    };
  },
  methods: {
    allNodesAciveFalse(array){
      array.forEach(el => {
         if(el.isLeaf===true){
           el.isActive = false
         }else{
          this.allNodesAciveFalse(el.children)
         }
      });
    },
    handleNodeClick(node) {
      node.isOpen = !node.isOpen
      if(node.isLeaf){
        this.allNodesAciveFalse(this.data);
        node.isActive = !node.isActive
      }
      
    },

   
  }
};
</script>

<style scoped>
</style>



