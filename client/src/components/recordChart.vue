<template>
  <div id="recordChart"></div>
</template>

<script>
import * as echarts from "echarts";
import axios from 'axios';
export default {
  name: "recordChart",
  data() {
    return {
      city: "北京市",
      time: 2013,
      baseData:null,
      baseDataChoose:null
    };
  },
  computed:{
    getTime(){
      return this.$store.state.year
    },
    getCity(){
      return this.$store.state.city
    }
  },
  watch:{
    getTime:function(newVal,oldVal){
      this.time = newVal
      this.dataChoose()
    },
    getCity:function(newVal,oldVal){
      this.city = newVal
      this.dataChoose()
    }
  },
  mounted() {
    axios.get('http://localhost:3000/recordChartData').then(
      response =>{
        console.log(response.data)
        this.baseData = response.data
        this.dataChoose()
      }
    )
  },
  methods: {
    init() {
      var chartDom = document.getElementById("recordChart");
      var myChart = echarts.init(chartDom);
      var option;
      option = {
        series: {
          redius: ["0", "75%"],
          center: ["50%", "45%"],
          type: "sunburst",
          sort: null,
          emphasis: {
            focus: "ancestor",
          },
          highlightPolicy: "descendant",
          data: this.baseDataChoose,
          itemStyle:{
            borderColor: 'gray'
          }
        },
      };
      option && myChart.setOption(option);
    },
    dataChoose(){
      for(var i in this.baseData[this.time]){
        if(this.baseData[this.time][i]['city']==this.city){
          this.baseDataChoose = this.baseData[this.time][i]['data']
          break
        }
      }
      this.init();
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#recordChart {
  border: 1px;
  width: 100%;
  height: 100%;
}
</style>
