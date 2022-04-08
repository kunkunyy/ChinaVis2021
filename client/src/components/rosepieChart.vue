<template>
  <div id="rosepieChart"></div>
</template>
<script>
import * as echarts from "echarts";
import * as axios from "axios";
export default {
  name: "rosepieChart",
  data() {
    return {
      city: "石家庄市",
      year: 2013,
      month: 1,
      baseData:null
    };
  },
  computed: {
    getTime(){
      return this.$store.state.secondtime;
    },
    getCity(){
      return this.$store.state.cityPoint;
    }
  },
  watch:{
    getTime:function(newVal,oldVal){
      var time = newVal.split('-')
      this.time = parseInt(time[0])
      this.month = parseInt(time[1])
      this.getData()
    },
    getCity:function(newVal,oldVal){
      this.city = newVal
      this.getData()
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData(){
      axios.get(`http://localhost:3000/rosepieChart?year=${this.year}&city=${this.city}&month=${this.month}`)
      .then((res) => {
        this.baseData = res.data
        this.init();
      })
      .catch((err) => {
        console.log(err);
      });
    },
    init(data) {
      var chartDom = document.getElementById("rosepieChart");
      var myChart = echarts.init(chartDom);
      var option;
      option = {
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "vertical",
          x: "80%",
          y: "center",
          data: ["一级", "二级", "三级", "四级", "五级", "六级"],
        },

        visualMap: {
          show: false,
          min: 80,
          max: 600,
          inRange: {
            colorLightness: [0, 1],
          },
        },
        series: [
          {
            name: "月达标天数：",
            type: "pie",
            radius: "60%",
            center: ["40%", "50%"],
            data: this.baseData,
            roseType: "radius",
            label: {
              color: "rgba(255, 255, 255, 0.3)",
            },
            labelLine: {
              show: true,
              //   lineStyle: {
              //     color: "rgba(255, 255, 255, 0.3)",
              //   },
              //   smooth: 0.2,
              //   length: 10,
              //   length2: 20,
            },
            itemStyle: {
              shadowBlur: 200,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },

            animationType: "scale",
            animationEasing: "elasticOut",
            animationDelay: function (idx) {
              return Math.random() * 200;
            },
          },
        ],
      };

      option && myChart.setOption(option);
    },
  },
};
</script>
<style>
#rosepieChart {
  border: 1px;
  height: calc(100% - 20px);
}
</style>