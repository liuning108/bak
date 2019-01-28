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
               draggable
               node-key="label"

               :allow-drag="isDrag"
               :allow-drop="allowDrop"
               @node-drop="dropEnd"
               @node-drag-start="handleDragStart"
               :indent="0"
               @node-click="handleNodeClick">

              <span class="custom-tree-node"  :class="{'leaf-node':data.isPage,'leaf-active':data.isActive}" slot-scope="{ node, data }">
                <i  v-if="!data.isPage" :class="data.isOpen ? 'el-icon-dash-icon-folder-6' : 'el-icon-dash-icon-Folder-close' "></i>
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
            {label: "活动分析2",isPage:true,isActive:false}
          ],
          isPage:false,
          icon:"el-icon-arrow-right",
          isOpen:false,
        },
        {
          label: "活动分析",
          id:1,
          isPage:true,
          isActive:false,
        },
      ],

    };
  },
  methods: {
    allNodesAciveFalse(array){
      array.forEach(el => {
         if(el.isPage===true){
           el.isActive = false
         }else{
          this.allNodesAciveFalse(el.children)
         }
      });
    },
    handleNodeClick(node) {
      console.log(node)
      node.isOpen = !node.isOpen
      if(node.isPage){
        this.allNodesAciveFalse(this.data);
        node.isActive = !node.isActive
      }
      
    },
    handleDragStart(node){
       this.bakData =JSON.stringify(this.data);
    },
    isDrag(node){
      console.log('isDarg', node)
        return node.data.isPage
    },
    allowDrop(draggingNode, dropNode, type){
       return  !dropNode.data.isPage
    },
    dropEnd(draggingNode, dropNode, dropType, ev){
      if(dropType!='inner' && draggingNode.level==1)return
      this.$confirm('这否放入该目录下', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(()=>{
          //save Menu
      }).catch(()=>{
        this.data =JSON.parse(this.bakData)
      })

      return false;
    }

   
  }
};
</script>

<style scoped>
</style>



