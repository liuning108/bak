<template>
  <div>
    <div class="config-block">
      <div class="header">
        <div class="des">绘制</div>
      </div>
      <div class="dash_zone">
        <div class="header">
          <div class="des">维度</div>
        </div>
        <div class="card-space">
          <draggable v-model="xlist" :options="dragXOptions">
            <div class="item axisColor" v-for="(element,index) in resultXList" :key="index">
              <i class="el-icon-dash-icon-zifuxiao"></i>
              <div class="item-des">
                <div class="ellipsis">{{element.name}}</div>
              </div>
              <i class="el-icon-close" @click="del()"></i>
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
          <draggable v-model="yList" :options="dragYOptions">
            <el-popover
              v-for="(element,index) in resultYList"
              :key="index"
              placement="bottom"
              trigger="click"
              :visible-arrow="false"
              v-model="element.visible"
            >
              <ul class="popover-cardedit">
                <el-popover placement="right" trigger="click" v-model="element.aggrpop">
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
                <i class="el-icon-close" @click="del()"></i>
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

export default {
  data() {
    return {
      xlist: [],
      yList: []
    };
  },
  computed: {
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
    resultXList() {
      let obj = {};
      let array = this.xlist.reduce((cur, next) => {
        obj[next.id] ? "" : (obj[next.id] = true && cur.push(next));
        return cur;
      }, []);

      return array;
    },
    resultYList() {
      let obj = {};
      let array = this.yList.reduce((cur, next) => {
        obj[next.id] ? "" : (obj[next.id] = true && cur.push(next));
        return cur;
      }, []);
      array.forEach(element => {
        element.yname = `${element.name}(${element.aggr})`;
      });
      return array;
    }
  },
  components: {
    draggable
  },

  methods: {
    del() {
      alert("删除");
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