<template>
  <div class="firstPage">
    <div class="left">
      <div id="map" class="border">
        <mapChart></mapChart>
      </div>
      <div id="sankey" class="border">
        <div class="title"><span>AQI等级演变趋势</span></div>
        <sankeyChart></sankeyChart>
      </div>
    </div>
    <div class="right">
      <div id="air">
        <div id="rose" class="border">
          <div class="title"><span>AQI年度展示</span></div>
          <recordChart></recordChart>
        </div>
        <div id="force" class="border">
          <div class="title"><span>AQI成分展示</span></div>
          <relationChart></relationChart>
        </div>
      </div>
      <div id="sort" class="border">
        <div class="title"><span>区域大气污染排名</span></div>
        <barChart></barChart>
      </div>
    </div>
  </div>
</template>

<script>
import mapChart from "../components/mapChart";
import sankeyChart from "../components/sanKeyChart";
import relationChart from "../components/relationChart";
import recordChart from "../components/recordChart.vue";
import barChart from "../components/barChart.vue";
export default {
  name: "firstPage",
  components: {
    mapChart,
    sankeyChart,
    relationChart,
    recordChart,
    barChart,
  },
  data() {
    return {
      msg: "Welcome to Your Vue.js App",
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.firstPage{
    display:flex;
    height: 99%;
}
.firstPage::after{
    clear: both;
}
.left{
    float:left;
    width:69%;
}
.right{
    float:right;
    width:30%
}
#map{
    height:68%;
    position:relative
}
#sankey{
    height:28%;
    position:relative
}
#air{
    height: 28%;
}
#air::after{
    clear:both;
}
#rose{
    float: left;
    width:47%;
    height: 100%;
    position:relative
}
#force{
    float: left;
    width:48%;
    height: 100%;
    position:relative
}
#sort{
    margin-top:20px;
    height: 68%;
    position:relative
}
.border{
    background-color: rgb(6,34,55);
    border: 1px solid rgb(132, 182, 226);
    box-shadow: 0px 0px 10px rgb(85, 150, 241) inset;
    border-radius: 10px;
    margin:10px 10px 10px 0px;
    z-index: 1;
}
.border::before{
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
