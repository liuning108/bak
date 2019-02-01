<template>
  <div class="gCanvas">
    <div v-show="isError">
      <Empty :msg="msg" icon="el-icon-menu-shujuyuan"></Empty>
    </div>
    <div  v-show="!isError" class="canvas2" ref="gcanvas">
      
    </div>
  </div>
</template>

<script>
import Empty from '../Empty'
import dbUtil from './dbutils/dbUtil.js'
  export default {
    props:['id','dsConfig'],
    components:{
      Empty
    },
    data(){
      return {
         myChart:null,
         msg:"",
         isError:false,
         info:{
            xNum:1,
            yNum:1,
         }
      }
    },
    watch: {
      dsConfig:{
         deep:true,
         handler(newValue, oldValue){
           this.process()
         }
      },
    },
    mounted(){
         this.process();    
     },
   methods: {
       async process(){
          const result = this.checkDsConfig();
          if(result!=0) return;
          var dsDatas =await dbUtil.getDsDatas(this.dsConfig,this.info);
          this.render(dsDatas)
             
       },
       render(dsDatas){
        this.$nextTick(()=>{
                    try {
                        this.darwG(dsDatas);
                    }catch(e){}
         })  
       },
       checkDsConfig(){
         console.log("checkDsConfig",this.dsConfig)
         if(!this.dsConfig){
            this.msg="没有配置相关数据源"
            this.isError = true;
            return 1;
         } 
         if(this.dsConfig.xList.length<=0 ||this.dsConfig.yList.length<=0){
           var yNumstr= this.info.yNum>=10?"多":this.info.yNum
          this.msg="图表需要 "+this.info.xNum+" 个维度和 "+yNumstr+" 个指标 "
          this.isError = true;
           return 1;
         };
         this.isError = false;
          return 0;

       },
       resize(){
           if(this.myChart){
             this.myChart.resize() 
           }
       },
       darwG(dsDatas) {
         if(this.myChart==null){
            let canvas =this.$refs.gcanvas
            this.myChart= this.$echarts.init(canvas);
          }

          var option = {
                xAxis: {
                    type: 'value'
                },
                yAxis: this.option_xAxis(dsDatas),
                series:this.option_series(dsDatas)
            };
          
         
         this.myChart.setOption(option)
       },

       option_xAxis(dsDatas){
         return {
                    type: 'category',
                    data: dsDatas.xInfo[0].datas,
                    axisLabel: {  
                      interval:0,  
                      rotate:0  
                    }  
                }
       },
       option_series(dsDatas){
          
        return dsDatas.yInfo.map(el=>{
            return {
                type:'bar',
                data: el.datas
            }
          })
       }

        

     },
  }
</script>

