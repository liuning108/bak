<template>
  <div class="gCanvas" ref="gcanvas">
  </div>
</template>

<script>
import util from '../../utils/util.js'
  export default {
    props:['id'],
    data(){
      return {
         myChart:null,
      }
    },
     mounted(){
         this.$nextTick(()=>{
                this.darwG();     
         })
     
     },
     methods: {
       resize(){
           if(this.myChart){
               
                this.myChart.resize() 
           }
       },
       darwG() {
         var canvas =this.$refs.gcanvas

          var option = {
                xAxis: {
                    type: 'category',
                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    data: [120, 200, 150, 80, 70, 110, 130],
                    type: 'bar'
                }]
            };

         this.myChart= this.$echarts.init(canvas);
         this.myChart.setOption(option)
       },
     },
  }
</script>

