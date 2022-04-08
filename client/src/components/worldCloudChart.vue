<template>
  <div id="worldCloud"></div>
</template>

<script>
import "echarts-wordcloud";
import axios from 'axios';
import * as echarts from "echarts";
export default {
  name: "worldCloud",
  data() {
    return {
        baseData:null,
        city:"石家庄市",
        baseDataChoose:null,
        cityList:[],
        levelSecond:1,
    };
  },
  computed: {
    getCityPoint(){
      return this.$store.state.cityPoint
    },
    getLevelSecond(){
      return this.$store.state.levelSecond
    },
    getcityPointOnce(){
      return this.$store.state.cityPointOnce
    }
  },
  watch: {
    getCityPoint:function(newVal,oldVal){
      this.city = newVal
      this.baseDataChoose = this.baseData[this.city]
      this.ChartInit()
    },
    getLevelSecond:function(newVal,oldVal){
      if(newVal==2){
        this.levelSecond = newVal
        this.city = this.$store.state.cityPointOnce
        this.baseDataChoose = this.baseData[this.city]
        this.ChartInit()
      }
    },
    getcityPointOnce:function(newVal,oldVal){
      if(this.levelSecond ==2){
        this.city = newVal
        this.baseDataChoose = this.baseData[this.city]
        this.ChartInit()
      }
    }
  },
  mounted() {
      axios.get('http://localhost:3000/wordCloud').then(
          response =>{
              this.baseData = response.data
              for(var i in this.baseData){
                this.cityList.push(i)
              }
              this.baseDataChoose=this.baseData[this.city]
              this.ChartInit(this)
          }
      )
  },
  methods: {
    ChartInit(that) {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById("worldCloud"));
      var option = {
        tooltip: {
          show: true,
        },
        series: [
          {
            type: "wordCloud",
            sizeRange: [6, 50], //画布范围，如果设置太大会出现少词（溢出屏幕）
            rotationRange: [-45, 90], //数据翻转范围
            textPadding: 0,
            left: "center",
            top: "center",
            width: "90%",
            height: "100%",
            autoSize: {
              enable: true,
              minSize: 6,
            },
            drawOutOfBound: false, //词云显示完整，超出画布的也显示
            textStyle: {
              normal: {
                color: function () {
                  return (
                    "rgb(" +
                    [
                      Math.round(Math.random() * 160),
                      Math.round(Math.random() * 160),
                      Math.round(Math.random() * 160),
                    ].join(",") +
                    ")"
                  );
                },
              },
              emphasis: {
                shadowBlur: 10,
                shadowColor: "#333",
              },
            },
            data: this.baseDataChoose,
          },
        ],
      };
      myChart.setOption(option);
      myChart.on('click',function(params){
        that.$store.state.type = params.data.name
      })
    },
  },
};
</script>

<style scoped>
#worldCloud{
    width: 100%;
    height: 80%;
}
</style>