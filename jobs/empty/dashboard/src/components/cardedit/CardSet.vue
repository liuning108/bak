<template>
  <el-container class="cardSetC">
    <el-header class="cardSetH">
      <div class="hct">
        <div class="title">数据集</div>
        <div>
          <i class="el-icon-edit" title="切换数据源"></i>
        </div>
      </div>
      <div class="datasource">
        <i class="el-icon-menu-shujuyuan dlogo"></i>
        <div class="title">超市销售订单数据</div>
        <i class="el-icon-document ddoc"></i>
      </div>
      <div class="updateTime">最近更新: 2018-08-17 17:26:41</div>
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
              <draggable v-model="list" :options="dragOptions">
                <div class="item axisColor" v-for="element in list" :key="element.id">
                  <i class="el-icon-edit"></i>
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
              <!-- <div class="item numColor">
                    <i class="el-icon-edit"></i>
                    <div class="item-des">
                      <div class="ellipsis">订ID</div>  
                    </div>
                  </div>
                  <div class="item numColor">
                    <i class="el-icon-edit"></i>
                    <div class="item-des">
                      <div class="ellipsis">数量</div>  
                    </div>
              </div>-->
              <draggable v-model="ylist" :options="dragYOptions">
                <div class="item numColor" v-for="element in ylist" :key="element.id">
                  <i class="el-icon-edit"></i>
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
</template>

<script>
import draggable from "vuedraggable";

export default {
  components: {
    draggable
  },
  data() {
    return {
      list: [{ id: 1, name: 1 }, { id: 2, name: 2 }],
      ylist: [{ id: 3, name: 3, aggr: "sum" }, { id: 4, name: 4, aggr: "sum" }]
    };
  },
  computed: {
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