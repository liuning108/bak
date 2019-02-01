<template>
  <div>
    <div  class="config-block" >
      <div class="header">
        <div class="des">绘制</div>
      </div>
      <div class="dash_zone">
        <div class="header">
          <div class="des">维度</div>
        </div>
        <div class="card-space">
          <draggable v-model="resultXList" :options="dragXOptions">
            <div class="item axisColor" v-for="(element,index) in resultXList" :key="index">
              <i class="el-icon-dash-icon-zifuxiao"></i>
              <div class="item-des">
                <div class="ellipsis">{{element.name}}</div>
              </div>
              <i class="el-icon-close" @click="del('xList',element)"></i>
            </div>
            <div slot="footer" class="ghit">拖到这里</div>
          </draggable>
        </div>
      </div>
      <div class="dash_zone">
        <div class="header">
          <div class="des">数值</div>
        </div>
        <div class="card-space">
          <draggable v-model="resultYList" :options="dragYOptions">
            <el-popover
              v-for="(element,index) in resultYList"
              :key="index"
              placement="bottom"
              trigger="click"
              :visible-arrow="false"
              v-model="yvsible[element.id]"
            >
              <ul class="popover-cardedit">
                <el-popover placement="right" trigger="click" v-model="yaggpop[element.id]">
                  <ul class="popover-cardedit">
                    <li @click="aggrOper(element,'sum')">求和(Sum)</li>
                    <li @click="aggrOper(element,'min')">最小值(Min)</li>
                    <li @click="aggrOper(element,'max')">最大值(MAX)</li>
                    <li @click="aggrOper(element,'avg')">平均值(Avg)</li>
                    <li @click="aggrOper(element,'count')">计数(Count)</li>
                  </ul>
                  <li slot="reference">聚合方式</li>
                </el-popover>
              </ul>
              <div class="item numColor" slot="reference">
                <i class="el-icon-dash-icon-chart1"></i>
                <div class="item-des">
                  <div class="ellipsis">{{element.yname}}</div>
                </div>
                <i class="el-icon-close" @click="del('yList',element)"></i>
              </div>
            </el-popover>

            <div slot="footer" class="ghit">拖到这里</div>
          </draggable>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import draggable from "vuedraggable";
import { createNamespacedHelpers } from "vuex";
import Loading from '../Loading.vue'
import {
  uniqBy,
  remove
} from 'lodash'

const { mapState,mapActions } = createNamespacedHelpers("cardedit");


export default {
  mounted(){
   const { dsConfig } = this.card
     if(!dsConfig)return
    this.xList = [...dsConfig.xList]
    this.yList = [...dsConfig.yList]
  },
  data(){
      return {
        xList:[],
        yList:[],
        yvsible:{},
        yaggpop:{}
      }
  },
  watch: {
    resultXList(newValue, oldValue) {
      this.updateList({"type":'xList',"list":newValue})
    },
    resultYList:{
       deep: true,
       handler(newValue){
         //console.log(1111)
          this.updateList({"type":'yList',"list":newValue})
       }
    }

  },
  computed: {
    ...mapState(['card']),
    dragXOptions() {
      return {
        animation: 0,
        group: { name: "dim" },
        ghostClass: "ghost",
        sort: false
      };
    },
    dragYOptions() {
      return {
        animation: 0,
        group: { name: "numY" },
        ghostClass: "ghost",
        sort: false
      };
    },
  
    resultXList:{
      set(newValue){
        this.xList=uniqBy(newValue,'id')
      },
      get() {
        return this.xList;
     }
    },
    resultYList:{
     set(newValue){
       this.yList = uniqBy(newValue,'id');
     },
     get(){
        let array =this.yList.map(element => {
            element.yname = `${element.name}(${element.aggr})`;
            return element;
        });
        return array;
     }
    }
  },
  components: {
    draggable,
    Loading
  },
 
  methods: {
    ...mapActions(['updateList']),
    del(name,element) {
      var arry = [...this[name]]
      remove(arry, (el) => {
        return el.id == element.id
      })
      this[name] = arry;
    },
    aggrOper(element, aggrType) {
      element.visible = false;
      element.aggrpop = false;
      element.aggr = aggrType;
    }
  }
};
</script>

<style  lang="sass" scoped>
@import '../../assets/styles/cardsetconfig.sass'
</style>