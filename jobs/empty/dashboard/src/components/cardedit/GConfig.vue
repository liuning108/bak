
<template>
  <div class="GConfig">
    <div class="GTypes">
      <div class="title">可视化</div>
      <div class="typesOper">
        <SelectIcon :options="options" @selected="handelTypeChange"/>
      </div>
      <div class="graphs">
        <div class="graphs-row" v-for="(menus,index) in groupMenus" :key="index">
          <div class="g-card" v-for="(menu,index) in menus" :key="index" @click="handelNodechange(menu)">
            <div class="chart-types-small-sprite" :class="menu.icon"></div>
          </div>
        </div>
        
      </div>
    </div>
    <div class="dash-divider-horizontal"></div>
    <div class="GProps">
      <div class="title">图表属性</div>
      <GProps></GProps>
    </div>
  </div>
</template>

<script>
import SelectIcon from "../base/selecticon/SelectIcon.vue";
import GProps from './GProps.vue'
import constant from '../../constants/constant.js'
import {chunk} from 'lodash'
import { createNamespacedHelpers } from "vuex";
const { mapState,mapActions } = createNamespacedHelpers("cardedit");

export default {
  components: {
    SelectIcon,
    GProps
  },
  methods: {
    ...mapActions(['changeNodeType']),
    handelTypeChange(option){

    },
    handelNodechange(option) {
      this.changeNodeType(option.type);
    }
  
  
  },
  computed: {
    groupMenus() {
      return chunk(this.menus,4)
    }
  },
  data() {
    return {
      menus: constant.card_edit_menus,
      options: [
        {
          value: "type1",
          label: "常用类型"
        },
        {
          value: "type2",
          label: "柱形图"
        }
      ],
      value6: "Beijing"
    };
  }
};
</script>

<style lang='sass' scoped>
   @import '../../assets/styles/gconfig.sass'
</style>