<template>
   <div>
  <loading v-if="!cardset.id"></loading>
  <el-container v-if="cardset.id" class="cardSetC">
    <el-header class="cardSetH">
      <div class="hct">
        <div class="title">数据集</div>
        <div>
          <i class="el-icon-edit" title="切换数据源"></i>
        </div>
      </div>
      <div class="datasource">
        <i class="el-icon-menu-shujuyuan dlogo"></i>
        <div class="title">{{cardset.name}}</div>
        <i class="el-icon-document ddoc"></i>
      </div>
      <div class="updateTime">最近更新: {{cardset.updateDate}}</div>
    </el-header>
    <div class="dash-divider-horizontal"></div>
    <el-main class="cardSetM">
      <div class="hct card-cols">
        <div class="title">字段集</div>
      </div>
      <div class="fieldContainer">
        <div class="fields">
          <div class="des">维度</div>
          <div class="f-ul">
            <div class="f-li">
              <draggable v-model="cardset.xlist" :options="dragOptions">
                <div class="item axisColor" v-for="element in cardset.xlist" :key="element.id">
                  <i class="el-icon-dash-icon-zifuxiao"></i>
                  <div class="item-des">
                    <div class="ellipsis">{{element.name}}</div>
                  </div>
                </div>
              </draggable>
            </div>
          </div>
        </div>

        <div class="fields">
          <div class="des">数值</div>
          <div class="f-ul">
            <div class="f-li">
              <draggable v-model="cardset.ylist" :options="dragYOptions">
                <div class="item numColor" v-for="element in cardset.ylist" :key="element.id">
                  <i class="el-icon-dash-icon-chart1"></i>
                  <div class="item-des">
                    <div class="ellipsis">{{element.name}}</div>
                  </div>
                </div>
              </draggable>
            </div>
          </div>
        </div>
      </div>
    </el-main>
  </el-container>
   </div>
</template>

<script>
import draggable from "vuedraggable";
import Loading from '../Loading.vue'

import { createNamespacedHelpers } from "vuex";
const { mapState,mapActions } = createNamespacedHelpers("cardedit");

export default {
 
  components: {
    draggable,
    Loading
  },
  computed: {
    ...mapState(['cardset']),
    dragOptions() {
      return {
        animation: 0,
        group: { name: "dim", pull: "clone", put: false },
        ghostClass: "ghost",
        sort: false
      };
    },
    dragYOptions() {
      return {
        animation: 0,
        group: { name: "numY", pull: "clone", put: false },
        ghostClass: "ghost",
        sort: false
      };
    }
  }
};
</script>

<style lang="sass" scoped>
@import '../../assets/styles/cardset.sass'
</style>