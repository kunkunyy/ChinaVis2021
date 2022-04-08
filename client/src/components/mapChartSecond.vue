<template>
  <div id = "mapChart">
    <div class='analyse' v-show="show"></div>
    <div class="legend" v-show="show1">
      <h4>局部聚集性着色规则</h4>
      <div><span style="background-color: #cb181d"></span>&nbsp;&nbsp;&nbsp;本地高-周边高</div>
      <div><span style="background-color: #238b45"></span>&nbsp;&nbsp;&nbsp;本地低-周边低</div>
      <div><span style="background-color: #4292c6"></span>&nbsp;&nbsp;&nbsp;本地低-周边高</div>
      <div><span style="background-color: #6a51a3"></span>&nbsp;&nbsp;&nbsp;本地高-周边低</div>
    </div>
    <div id ="legend" v-show="show2">
      <div style="left: 3%">0</div>
      <div style="left: 17%">50</div>
      <div style="left: 30%">100</div>
      <div style="left: 45%">150</div>
      <div style="left: 60%">200</div>
      <div style="left: 75%">300</div>
      <div style="left: 90%">∞</div>
      <span style="background-color: rgb(0,228,0);left: 5%"></span>
      <span style="background-color: rgb(255,255,0);left: 20%"></span>
      <span style="background-color: rgb(255,126,0);left: 35%"></span>
      <span style="background-color: rgb(255,0,0);left: 50%"></span>
      <span style="background-color: rgb(153,0,76);left: 65%"></span>
      <span style="background-color: rgb(126,0,35);left: 80%"></span>
    </div>
  </div>
</template>

<script>
import * as mapboxgl from "mapbox-gl"
import axios from "axios"
import * as d3 from "d3-v6"
export default {
  name: 'mapChart',
  data () {
    return {
      city:"北京市",
      loading: true,
      type: 'AQI',
      AQIState: '良好',
      time: "2013-01",
      level:1,
      citychoose:"邢台市",
      show:false,
      show1:true,
      show2:false
    }
  },
  created () {
  },
  mounted () {
    this.map = "";
    this.mapInit(this);
    this.mapLoadGeojson(this)
    this.mapInterctionSetting(this)
  },
  computed:{
    getTime(){
      return this.$store.state.secondtime
    }
  },
  watch:{
    getTime:function(newVal,oldVal){
      this.time = newVal
      this.updateMapLoadGeojson(this)
    }
  },
  methods: {
    mapAddCountryJson(features){
      this.map.addSource("city_json",{
        type: "geojson",
        data:{
          type: "FeatureCollection",
          features: features.features
        }
      });
      this.map.addLayer({
        id: "cityLayer",
        type: "circle",
        layout:{
          'visibility':'visible'
        },
        source: 'city_json',
        paint:{
          "circle-color":['get','color'],
          'circle-radius': 6
        }
      })
      this.map.addLayer({
        id: "cityBoundry",
        type: "line",
        source: "city_json",
        paint: {
          "line-width": 0.5,
          "line-color": "gray"
        }
      })
      this.map.addLayer({
        id: "countryname",
        type: "symbol",
        source: "city_json",
        layout: {
          "text-field": "{name}",
          "text-size": 12,
          "text-offset": [0,-2]
        },
        paint:{
          "text-color":"white"
        }
      })
    },
    mapAddCityOnce(features){
      this.map.addSource("cityonce_json",{
        type: "geojson",
        data:{
          type: "FeatureCollection",
          features: features.features
        }
      });
      this.map.addLayer({
        id: "cityonceLayer",
        type: "circle",
        source: 'cityonce_json',
        layout:{
          'visibility':'none',
        },
        paint:{
          "circle-color":['get','color'],
          "circle-opacity":['get','opacity'],
          'circle-radius': 8
        }
      });
      this.map.addLayer({
        id: "cityname",
        type: "symbol",
        source: "cityonce_json",
        layout: {
          "text-field": "{name}",
          "text-size": 12,
          'visibility':'none',
          "text-offset": [0,-2]
        },
        paint:{
          "text-color":"white"
        }
      })
    },
    mapInit(that){
      mapboxgl.accessToken="pk.eyJ1Ijoia3Vua3VueXkiLCJhIjoiY2tna2pxNm8wMDIwcTJ4bzFmZmN3cnBmaSJ9.lIlQrcMFrHeWPQpL-03ETg";
      this.map = new mapboxgl.Map({
          container: "mapChart", // container id
          style: "mapbox://styles/kunkunyy/ckp17bubb560w17nx86wpdtle", // stylesheet location
          center: [104.946465,38.347269], // starting position [lng, lat]
          zoom: 3, // starting zoom
          doubleClickZoom:false,
      });
    },
    mapLoadGeojson(that){
      this.map.on("load",function(){
        axios.get('http://localhost:3000/citySecond?time='+that.time).then(
          response =>{
            that.data = response.data;
            console.log(that.data)
            that.mapAddCountryJson(that.data);
          },
          error =>{
            that.loading = false;
          }
        );
        axios.get('http://localhost:3000/cityOnce?time='+that.time).then(
          response=>{
            var dataset = response.data;
            console.log(dataset)
            that.mapAddCityOnce(dataset);
          }
        )
      })
    },
    updateMapLoadGeojson(that){
      axios.get('http://localhost:3000/citySecond?time='+that.time).then(
        response =>{
          that.data = response.data;
          that.map.getSource('city_json').setData(that.data)
        }
      )
    },
    mapInterctionSetting(that){
      that.map.on("mouseenter","cityLayer",function(){
        that.map.getCanvas().style.cursor = 'pointer'
      });
      that.map.on('mouseleave', 'cityLayer', function () {
        that.map.getCanvas().style.cursor = '';
      });
      that.map.on("mouseenter","countryname",function(){
        that.map.getCanvas().style.cursor = 'pointer'
      });
      that.map.on('mouseleave', 'countryname', function () {
        that.map.getCanvas().style.cursor = '';
      });
      that.map.on("click","cityLayer",function(e){
        that.$store.state.cityPoint = e.features[0].properties.name
      });
      that.map.on("dblclick","cityLayer",function(e){
        if(e.features[0].properties.name=="邢台市"){
          that.map.setLayoutProperty('cityLayer','visibility','none')
          that.map.setLayoutProperty('countryname','visibility','none')
          that.map.setLayoutProperty('cityonceLayer','visibility','visible')
          that.map.setLayoutProperty('AcityLayer','visibility','visible')
          that.map.setLayoutProperty('cityname','visibility','visible')
          that.map.setZoom(7.5)
          that.map.flyTo({
            center:[115.038782,37.21768]
          })
          that.show1 = false
          that.show2 = true
          //在此添加绘图函数
          that.drawAnalyse();
        }
      })
      that.map.on('click',"cityonceLayer",function(e){
        that.map.flyTo({
            center:[115.038782,37.21768]
        })
        that.citychoose = e.features[0].properties.name;
        that.$store.state.levelSecond = 2
        that.$store.state.cityPointOnce = e.features[0].properties.name
        that.drawAnalyse(that.citychoose)
      })
    },
    drawRadial(container,data){
      let container_width = +container.attr("width").split("px")[0],
        container_height = +container.attr("height").split("px")[0];

      let margin = {
          top: container_height * 0.1,
          bottom: container_height * 0.1,
          left: container_width * 0.1,
          right: container_width * 0.1,
        },
        width = container_width - margin.left - margin.right,
        height = container_height - margin.top - margin.bottom,
        barInnerRadius = (Math.min(width, height) / 2) * 0.7,
        barOuterRadius = (Math.min(width, height) / 2) * 0.9,
        lineInnerRadius = (Math.min(width, height) / 2) * 0.9,
        lineOuterRadius = (Math.min(width, height) / 2) * 1,
        animationDuration = 800,
        colorTransBefore = "none",
        colorTransAfter = "orange",
        backgroundColor = "none";
        let color = ['#004d73','#00334e','#007fdb','#dbebfa','#832561','#11862f','#bfca02','#848a8c']
      // colorTransBefore = '#8D8FFA',
      // colorTransAfter = 'white',
      // backgroundColor = '#8D8FFA';

      let svg = container
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr(
          "transform",
          "translate(" + container_width / 2 + "," + container_height / 2 + ")"
        );

      // circle X
      let xScale = d3
        .scaleBand()
        .range([0, 2 * Math.PI])
        .align(0)
        .domain(data.map((d) => d.x));

      // bar y scale
      let yBarScale = d3
        .scaleRadial()
        .range([barInnerRadius, barOuterRadius])
        .domain([d3.min(data, (d) => d.bar), d3.max(data, (d) => d.bar)]);

      // line y scale
      let yLineScale = d3
        .scaleLinear()
        .range([lineInnerRadius, lineOuterRadius])
        .domain([d3.min(data, (d) => d.line), d3.max(data, (d) => d.line)]);

      let lineGenerator = d3
        .lineRadial()
        .curve(d3.curveLinearClosed)
        .angle((d) => xScale(d.x))
        .radius((d) => yLineScale(d.line));

      // y area generator
      let radialAreaGenerator = d3
        .radialArea()
        .curve(d3.curveLinearClosed)
        .angle((d) => xScale(d.x))
        .innerRadius(yLineScale(d3.min(data, (d) => d.line)))
        .outerRadius((d) => yLineScale(d.line));

      // arc background
      let arcback = d3
        .arc()
        .innerRadius(barInnerRadius)
        .outerRadius(lineOuterRadius)
        .startAngle(0)
        .endAngle(2 * Math.PI);

      let arcbackPath = svg
        .append("g")
        .append("path")
        .attr("d", arcback)
        .attr("fill", "white");

      arcbackPath
        .transition()
        .duration(animationDuration / 2)
        .attr("fill", backgroundColor);

      // bar
      let arc = d3
        .arc()
        .innerRadius(barInnerRadius)
        .outerRadius((d) => yBarScale(d.bar))
        .startAngle((d) => xScale(d.x))
        .endAngle((d) => xScale(d.x) + xScale.bandwidth())
        .padAngle(0.01)
        .padRadius(barInnerRadius);

      let arcpath = svg
        .append("g")
        .selectAll("barpath")
        .data(data)
        .enter()
        .append("path");

      arcpath
        .attr("fill", colorTransBefore)
        .transition()
        .duration(animationDuration)
        .attr("fill", (d,i)=>{
          return color[d['color']]
        })
        .attr("d", arc);

      // line
      let radialLine = svg
        .append("g")
        .append("path")
        .datum(data)
        .attr("d", lineGenerator);

      radialLine
        .attr("fill", "none")
        .attr("stroke", colorTransBefore)
        .attr("stroke-width", 0)
        .transition()
        .duration(animationDuration)
        .attr("stroke", colorTransAfter)
        .attr("stroke-width", 1.5);

      // line area

      svg.select("g")
        .append("path")
        .attr("d", radialAreaGenerator(data))
        .attr("fill", colorTransBefore)
        .transition()
        .duration(animationDuration)
        .attr("fill", colorTransAfter);

      // circle
      let circle = svg
        .append("circle")
        .attr("fill", "none")
        .attr("r", lineInnerRadius)
        .attr("opacity", 0.1);

      circle
        .attr("stroke", colorTransBefore)
        .transition()
        .duration(animationDuration)
        .attr("stroke", colorTransAfter);

      // xAxis

      let xTickScale = d3
        .scaleTime()
        .range([0, 2 * Math.PI])
        .domain(d3.extent(data, (d) => d.x));

      let formatHour = d3.timeFormat("%d");

      let xTick = svg
        .append("g")
        .selectAll("xTick")
        .data(xTickScale.ticks(12))
        .enter()
        .append("g")
        .attr("text-anchor", "middle")
        .attr("transform", (d) => {
          return (
            "rotate(" +
            ((xTickScale(d) * 180) / Math.PI - 90) +
            ")translate(" +
            barInnerRadius +
            ",0)"
          );
        });

      xTick
        .append("line")
        .attr("x2", -10)
        .attr("stroke", colorTransBefore)
        .transition()
        .duration(animationDuration)
        .attr("x2", -5)
        .attr("stroke", colorTransBefore);

      xTick
        .append("text")
        .attr("transform", function (d) {
          let angle = xTickScale(d);
          return angle < Math.PI / 2 || angle > (Math.PI * 3) / 2
            ? "rotate(90)translate(0,22)"
            : "rotate(-90)translate(0, -15)";
        })
        .text(function (d) {
          return formatHour(d);
        })
        .style("font-size", 10);

      xTick
        .attr("opacity", 0)
        .transition()
        .duration(animationDuration)
        .attr("opacity", 0.6);
    },drawAnalyse(choose){
    this.show = true;
    let choosecity = choose||"邢台市";
    d3.select('.analyse').select('svg').remove();
    let svg = d3
      .select(".analyse")
      .append("svg")
      .attr("id", "radial-container")
      .attr("width",/* () => d3.select(".analyse").style("width")*/1060)
      .attr("height", /*() => d3.select(".analyse").style("height")*/600);
           axios.get(`http://localhost:3000/analyse?city=${choosecity}&year=2013`)
            .then(res=>{
                console.log(res.data.data);
                let data = res.data.data
                this.drawRadial(svg, data);
            })
            .catch(err=>{
                console.log(err)
            })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#mapChart{
  position: relative;
  height: calc(100% - 20px);
  border-radius: 10px;
}
#legend{
  position: absolute;
  top: 60%;
  left: 80%;
}
.analyse{
  position:absolute;
  height:calc(100% - 20px);
  pointer-events: none;
  transform: scale(1.2);
}
.legend {
  background-color: rgba(0,0,0,0.1);
  border-radius: 3px;
  bottom: 30px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  border: 1px solid gray;
  font: 12px/20px 'Helvetica Neue', Arial, Helvetica, sans-serif;
  padding: 10px;
  position: absolute;
  right: 10px;
  width: 120px;
  z-index: 1;
  border-radius: 10%;
}
.legend div span {
  border-radius: 50%;
  display: inline-block;
  height: 15px;
  margin-right: 5px;
  width: 15px;
}
.legend div{
  color: rgba(255,255,255,0.7);
}
.legend h4 {
  margin: 0 0 10px;
  color: white;
}
#legend{
  position: absolute;
  width: 30%;
  height: 15%;
  top: 83%;
  left: 69%;
  display: flex;
  /* border:1px solid #a9c9e2;
  background:rgba(	128,128,128,0.3);
  border-radius: 10px; */
}
#legend span {
  position: absolute;
  top: 72%;
  height: 25%;
  width: 15%;
}
#legend div{
  position: absolute;
  top: 40%;
  color: white;
}
</style>
