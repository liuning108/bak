<template>
  <el-container class="dash-aside">
    <el-header class="dash-header">
      <div class="node-container">
        <div class="node-container-name">仪表板</div>
        <div class="node-container-option">
           <el-dropdown @command="handleCommand" trigger="click"  size="medium" visible-arrow="false">
            <span class="el-dropdown-link">
              <i class="el-icon-edit-outline" slot="reference"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="{type:'handleCommandDir'}">新建目录</el-dropdown-item>
              <el-dropdown-item :command="{type:'handleCommandPage'}">新建页面</el-dropdown-item>
            </el-dropdown-menu>
           </el-dropdown>
        </div>
      </div>
    </el-header>
    <div class="dash-divider-horizontal"></div>
    <el-main class="dash-main">
      <el-tree :data="data"
               ref="tree"
               icon-class=""
               class="dash-tree"
               draggable
               node-key="id"
               :expand-on-click-node="false"
               :allow-drag="isDrag"
               :allow-drop="allowDrop"
               :default-expanded-keys="expandedData"
               @node-drag-start="handleDragStart"
               :indent="10"
               >
              <div class="custom-tree-node"  :class="{'leaf-node':data.isPage,'leaf-active':data.isActive}" slot-scope="{ node, data }">
                <div>
                <i  v-if="!data.isPage" @click="handleNodeClick(data,node)" :class="node.expanded ? 'el-icon-dash-icon-folder-6' : 'el-icon-dash-icon-Folder-close' "></i>
                <span v-show="!(data.isPage && data.isEdit)">{{data.label}}</span>
                <input v-if="data.isPage && data.isEdit" v-model="data.label" @blur="renameDone(node,data)">
                </div>
                  <div v-if="!data.isPage" class="operMenus">
                    <el-dropdown @command="handleNodeCommand" trigger="click"  size="medium" visible-arrow="false">
                      <span class="el-dropdown-link">
                        <i class="el-icon-edit-outline" slot="reference"></i>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item :command="{type:'nodeDir',data:{node,data}}">新建目录</el-dropdown-item>
                        <el-dropdown-item :command="{type:'nodePage',data:{node,data}}">新建页面</el-dropdown-item>
                        <el-dropdown-item :command="{type:'dirRemove',data:{node,data}}">删除</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </div>
                  <div v-if="data.isPage" class="operMenus">
                    <el-dropdown @command="handleNodeCommand" trigger="click"  size="medium" visible-arrow="false">
                      <span class="el-dropdown-link">
                        <i class="el-icon-edit-outline" slot="reference"></i>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item :command="{type:'pageRename',data:{node,data}}">重命名</el-dropdown-item>
                        <el-dropdown-item :command="{type:'pageRemove',data:{node,data}}">删除</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </div>
              </div>

      </el-tree>
    </el-main>
  </el-container>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapState,mapActions } = createNamespacedHelpers("dashboard");
import util from '../utils/util.js'
import dashboardApi from '../api/dashboard.js'
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
  mounted(){
      let pageId = this.$route.params.id;
      this.loadNode({id:0},pageId);

  },
  computed:{
  },
  data() {
    return {
      expandedData:[],
      data:[],

    };
  },
  methods: {
    
    async loadNode(node,pageId){
     var treeData =await dashboardApi.getTree(node);
     this.data.push(...treeData);
     this.expandedData=['dkjshakdhaskd']
    },
    renameDone(node,data){
      data.isEdit = false;
 
    },
    handlePageCommand(option){
        this[option.type](option.data);
        
    },
    dirRemove({node,data}){
      if(data.children.length>0){
         this.$message({
          message: '存有子目录或是子页面,不能删除',
          type: 'warning'
        });
        return;
      }
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.id === data.id);
      children.splice(index, 1);
    },
    pageRemove({node,data}){
        this.$confirm('此操作将永久删除该页面, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const parent = node.parent;
          const children = parent.data.children || parent.data;
          const index = children.findIndex(d => d.id === data.id);
          children.splice(index, 1);
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        })
      
    },
    pageRename(option){
      console.log(option)
       option.data.isEdit = true;
    },
    handleNodeCommand(option){
     this[option.type](option.data);
    },

    nodeDir(option){
      this.$prompt('目录名称', '新建目录', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
          console.log("nodeDir",option)
          console.log("nodeDir",option.data);
            var dirNode =this.createDir(option.data.id,value);
           option.data.children.push(dirNode)
           option.node.expanded=true;
           option.data.isOpen=true;
           dashboardApi.saveDashDir(dirNode);
          
        })  
    },
    nodePage(option){
      this.$prompt('页面名称', '新建页面', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
          var curNewPage =this.createPage(option.data.id,value);
          option.data.children.push(this.createPage(option.data.id,value))
          option.node.expanded=true;
          option.data.isOpen=true;
          dashboardApi.saveDashPage(curNewPage)

        })

    },

    appendNode(data){
      console.log(data);
      const newChild =this.createDir(data.id,'hehe_test');
      data.children.push(newChild)
      // { id: util.uuidv4(), label: 'testtest', children: [] };
    },
    removeNode(){

    },
    handleCommand(option){
      this[option.type]();
    },
    handleCommandPage(){
      this.$prompt('页面名称', '新建页面', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
              }).then(({ value }) => {
                var newPageNode =this.createPage(0,value);
                this.data.push(newPageNode)
                dashboardApi.saveDashPage(newPageNode)
        })
    },
    createPage(pid,value){
      return {
                  'id': util.uuidv4(),
                  'pid':pid,
                  'label':value,
                  'isPage':true,
                  'isEdit':false,
                  'isActive':false
              }
    },
    handleCommandDir(){
      this.$prompt('目录名称', '新建目录', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
           var dirNode =this.createDir(0,value)
          this.data.push(dirNode);
          dashboardApi.saveDashDir(dirNode);
        })
    },
    createDir(pid,value){
      return {
             'id': util.uuidv4(),
             'pid':pid,
             'label':value,
             'isPage':false,
             'icon':"el-icon-arrow-right",
             'isOpen':false,
             'children':[],
          }
    },
    allNodesAciveFalse(array){
      array.forEach(el => {
         if(el.isPage===true){
           el.isActive = false
         }else{
          this.allNodesAciveFalse(el.children)
         }
      });
    },
    handleNodeClick(node,dnode) {
      console.log("handleNodeClick",node,dnode)
      
      if(node.isPage){
        this.allNodesAciveFalse(this.data);
        node.isActive = !node.isActive
      }else{
          dnode.expanded =! dnode.expanded;      
      }
      
    },
    handleDragStart(node){
       this.bakData =JSON.stringify(this.data);
    },
    isDrag(node){
      return false
        //return node.data.isPage
    },
    allowDrop(draggingNode, dropNode, type){
      return false
      // return  !dropNode.data.isPage
    },
   

   
  }
};
</script>

<style scoped>
</style>



