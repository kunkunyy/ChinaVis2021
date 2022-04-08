<template>
  <div class="secondPage">
    <div class="left">
      <div id='rose' class="border">
        <div class="title"><span>AQI等级分布</span></div>
        <rosepieChart></rosepieChart>
      </div>
      <div id='cor' class="border">
        <div class="title"><span>污染物/气象因素相关性分析</span></div>
        <corChart></corChart>
      </div>
      <div id='air' class="border">
        <div class="title"><span>各污染物IAQI分布</span></div>
        <airpolutionchart></airpolutionchart>
      </div>
    </div>
    <div class="right">
      <div class='rightup'>
          <div class='rightleft'>
            <div id='map' class="border">
              <div class="title"><span>区域空间聚集分析</span></div>
              <mapChartSecond></mapChartSecond>
            </div>
          </div>
          <div class='rightright'>
            <div id='introduce' v-show='false'>
              <div class='intrcontent' v-show="show">
                <chartIntroduce></chartIntroduce>
              </div>
              <div class ='row' v-on:click="toggle">{{row}}</div>
            </div>
            <div id='cloud' class='border' v-show="!show">
              <div class="title"><span>行业词云</span></div>
              <worldCloudChart></worldCloudChart>
            </div>
            <div id="list" class='border' v-show="!show">
              <div class="title"><span>相关工厂列表</span></div>
              <cityFactory></cityFactory>
            </div>         
          </div>
      </div>
      <div class="rightdown">
        <div id='sankey' class='border'>
          <div class="title"><span>各污染物时间变化趋势</span></div>
          <lineChart></lineChart>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import airpolutionchart from '../components/airPolutionChart'
import corChart from '../components/corChart'
import mapChartSecond from "../components/mapChartSecond";  
import lineChart from '../components/lineChart'
import chartIntroduce from '../components/chartIntroduce'
import worldCloudChart from '../components/worldCloudChart'
import roseChart from '../components/roseChart.vue'
import cityFactory from '../components/cityFactoryList'
import rosepieChart from '../components/rosepieChart.vue'
export default {
  name: "secondPage",
  data() {
    return {
      msg: "Welcome to Your Vue.js App",
      show:false,
      row:'▼',
    };
  },
  components:{
    airpolutionchart,
    corChart,
    mapChartSecond,
    lineChart,
    chartIntroduce,
    worldCloudChart,
    roseChart,
    cityFactory,
    rosepieChart
  },
  methods:{
    toggle(){
      this.show  = !this.show;
      if(this.show){
        this.row = '▲';
      }else{
        this.row = '▼';
      }
      
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.secondPage {
  display: flex;
  height: 100%;
}
.firstPage::after {
  clear: both;
}
.left {
  float: left;
  width: 24%;
}
.right {
  float: right;
  width: 75%;
}
.rightup{
height: 68%;
}
.rightdown{
  width: 100%;
  height: 29%;
  margin-top: 20px;
}
.rightleft{
  float:left;
  width:75%;
  height:100%;
}
.rightright{
  float:left;
  width:24%;
  height:100%;
}
.border {
  margin: 1px;
}
#rose{
  height:33%;
    position: relative;
}
#cor{
  height:33%;
    position: relative;
}
#air {
  height:29%;
  position: relative;
}
#map {
  height: 100%;
  position: relative;
}
#sankey {
  height: 100%;
  position: relative;
}

#cloud {
  height: 39%;
  width: 100%;
  position: relative;
}
#list{
  height: 59%;
  width: 100%;
  position: relative;
}
#introduce{
  position:absolute;
  margin-top:10px ;
  height:68%;
  width: 17.76%;
  right:20%
}
.intrcontent{
  height:calc(100% - 40px);
}
.row{
  position:relative;
  color:rgba(111,248,228,0.5);
  z-index:4;
  display: flex;
  justify-content:center;
}
.row:hover{
  color:rgba(111,248,228,0.8);
}
#downrow{
  transform: rotate(45deg);
  border: solid black;
  border-width: 0 1px 1px 0;
  display: inline-block;
  padding: 3px;
}
.border {
  background-color: rgb(6,34,55);
  border: 1px solid rgb(132, 182, 226);
  box-shadow: 0px 0px 10px rgb(85, 150, 241) inset;
  border-radius: 10px;
  margin: 10px 10px 10px 0px;
  z-index: 1;
}
.border::before {
  position: absolute;
  top: 10px;
  bottom: 10px;
  left: -1px;
  right: -1px;
  content: "";
  display: block;
  border-left: 1px solid rgb(4, 65, 97);
  border-right: 1px solid rgb(4, 65, 97);
  z-index: -1;
}

.border::after {
  position: absolute;
  top: -1px;
  bottom: -1px;
  left: 10px;
  right: 10px;
  content: "";
  display: block;
  border-top: 1px solid rgb(4, 65, 97);
  border-bottom: 1px solid rgb(4, 65, 97);
  z-index: -1;
}
.title {
  position: relative;
  margin-top: 5px;
}
.title>span{
    margin-left: 20px;
    color:rgb(111,248,228)
}
</style>
