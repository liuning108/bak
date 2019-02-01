<template>
  <el-container class="perviewContainer">
  <el-header class="perviewHeader">
    <div class="title">图形</div>
  </el-header>
  <el-main class="perviewMain">
    <div class="perviewCard">
    <div class="perviewTitle">
      <span v-show="!isEdit">{{card.name}}</span>
      <i v-show="!isEdit" class="el-icon-edit" @click="isEdit=!isEdit"></i>
      <input type="text" v-model="card.name" v-show="isEdit" @blur="isEdit=false">
      
    </div>
    <div class="perviewCanvas">
      <component  ref="gNode" :is="cardType" :ds-config="card.dsConfig"   :id="cardId"  ></component>
    </div>
    </div>
  </el-main>
  </el-container>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapState,mapActions } = createNamespacedHelpers("cardedit");

  export default {
    mounted(){
    },
    computed: {
      ...mapState(['card']),
      ...mapState(['isLoading']),
      cardType(){
        return this.card.type
      },
      cardId(){
        return this.card.id
      },
      dsConfig(){
        return  this.card.dsConfig
      }
    },
    data() {
       return {
         isEdit:false
       }
     },
  }
</script>

<style lang="sass" scoped>
@import '../../assets/styles/perviewcard.sass'
</style>