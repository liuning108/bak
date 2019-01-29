<template>
  <el-container class="perviewContainer">
  <el-header class="perviewHeader">
    {{card.type}}{{item.type}}
  </el-header>
  <el-main class="perviewMain">
    <div class="perviewCanvas">
      <component  ref="gNode" :is="item.type" :id="item.i" ></component>
    </div>
  </el-main>
  </el-container>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapState,mapActions } = createNamespacedHelpers("cardedit");

  export default {
    computed: {
      ...mapState(['card']),
      ...mapState(['isLoading'])
    },
    watch:{
      card: {
        deep: true,
        handler(val,oldValue) {
          console.log(oldValue.type)
          console.log(val.type != oldValue.type)
           this.item.type=val.type
          if (val.type != oldValue.type){
           
          }
           
        }
      }
    },

    mounted(){
      setTimeout(()=>{
        this.item.type=this.card.type
        this.item.i=this.card.i
      },1200)
        
    
      
    },
     data() {
       return {
         item: {
           type:null,
           i:null,
         }
       }
     },
  }
</script>

<style lang="sass" scoped>
@import '../../assets/styles/perviewcard.sass'
</style>