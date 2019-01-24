
<template>
  <div class="GConfig">
    <div class="GTypes">
      <div class="title">可视化</div>
      <div class="typesOper">
        <SelectIcon :options="options" @selected="typechange"/>
      </div>
      <div class="graphs">
        <div class="graphs-row">
          <div class="g-card">
            <div class="chart-types-small-sprite vertical-bar-single-small"></div>
          </div>
          <div class="g-card">
            <div class="chart-types-small-sprite horizontal-bar-single-small"></div>
          </div>
          <div class="g-card">
            <div class="chart-types-small-sprite line-small"></div>
          </div>
          <div class="g-card">
            <div class="chart-types-small-sprite pie-small"></div>
          </div>
        </div>
        <div class="graphs-row">
          <div class="g-card">
            <div class="chart-types-small-sprite vertical-bar-grouped-small"></div>
          </div>
          <div class="g-card">
            <div class="chart-types-small-sprite vertical-bar-grouped-plus-line-small"></div>
          </div>
          <div class="g-card">
            <div class="chart-types-small-sprite vertical-bar-stacked-small"></div>
          </div>
          <div class="g-card">
            <div class="chart-types-small-sprite vertical-bar-waterfall-small"></div>
          </div>
        </div>
        <div class="graphs-row">
          <div class="g-card">
            <div class="chart-types-small-sprite radar-small"></div>
          </div>
          <div class="g-card">
            <div class="chart-types-small-sprite bubble-small"></div>
          </div>
          <div class="g-card">
            <div class="chart-types-small-sprite table-small"></div>
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
export default {
  components: {
    SelectIcon,
    GProps
  },
  methods: {
    typechange(option) {}
  },
  data() {
    return {
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