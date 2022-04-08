<template>
  <div id="relationChart">
    <div id="Ichart" style="z-index: 100"></div>
    <!-- <svg width="300" height="300"></svg> -->
  </div>
</template>

<script>
import * as d3 from "d3-v5";
import * as axios from 'axios'
export default {
  name: "relationChart",
  data() {
    return {
      year:2013,
      province:'北京市'
    };
  },
  mounted() {
    axios.get(`http://localhost:3000/mainpolution?year=${this.year}&province=${this.province}`)
          .then((res)=>{
            // console.log(res.data)
            this.init(res.data)
          }).catch(err=>{
            console.log(err)
          })
    // this.init();
  },
  methods: {
    init(data) {
      // var marge = {top:60,bottom:60,left:60,right:60}
      var relationChart = document.getElementById('relationChart');
      var width = relationChart.offsetWidth;
      var height = relationChart.offsetHeight;
      var svg = d3
        .select("#relationChart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr('class','relationchartsvg');
      var color = ['rgb(31,119,180)','#3be8b0','#1aafd0','#6a67ce','#ffb900','#fc636b']
      // console.log(d3.select("#relationChart"));

      var g = svg.append("g")

      //  .attr("transform","translate("+marge.top+","+marge.left+")");
      //	准备数据
      var nodes = data.nodes

      var edges = data.edges

      //新建一个力导向图
      var forceSimulation = d3
        .forceSimulation(nodes)
        .force("charge", d3.forceManyBody())
        .force("link", d3.forceLink(edges))
        .force("center", d3.forceCenter());
      //设置一个color的颜色比例尺，为了让不同的扇形呈现不同的颜色
      var colorScale = d3
        .scaleOrdinal()
        .domain(d3.range(nodes.length))
        .range(d3.schemeCategory10);
      //生成节点数据
      forceSimulation.nodes(nodes).on("tick", ticked);
      //生成边数据
      forceSimulation
        .force("link")
        .links(edges)
        .distance(function (d) {
          //每一边的长度
          return 50
        });
      //设置图形的中心位置
      forceSimulation
        .force("center")
        .x(width / 2)
        .y(height / 2);

      //绘制边
      var links = g
        .append("g")
        .attr('class','lineg')
        .selectAll("line")
        .data(edges)
        .enter()
        .append("line")
        .attr('class','edgeslink')
        .attr("stroke", function (d, i) {
          return  'rgb(255,255,0)';
        })
        .attr("stroke-width", (d,i)=>{
          return d.value*5+2
        });

      var linksText = g
        .append("g")
        .selectAll("text")
        .data(edges)
        .enter()
        .append("text");

      var gs = g
        .selectAll(".circleText")
        .data(nodes)
        .enter()
        .append("g")
        .attr("transform", function (d, i) {
          var cirX = d.x;
          var cirY = d.y;
          return "translate(" + cirX + "," + cirY + ")";
        })
        .attr('fill','rgb(255,255,255)')
        .call(
          d3.drag().on("start", started).on("drag", dragged).on("end", ended)
        );

      //绘制节点
      gs.append("circle")
        .attr("r", (d,i)=>{
          if(!i){
            return 20;
          }else{
            return edges[i-1].value*5+15
          }
          
        })
        .attr("fill", function (d, i) {

          return 'rgb(255,126,0)';
        });
      //文字
      gs.append("text")
       .attr("x",0)
        .attr('text-anchor','middle')
        .attr("y", 0)
        .attr("dy", 5)
        .attr('font-size','10px')
        .text(function (d) {
          return d.name;
        });
      function ticked() {
        links
          .attr("x1", function (d) {
            return d.source.x;
          })
          .attr("y1", function (d) {
            return d.source.y;
          })
          .attr("x2", function (d) {
            return d.target.x;
          })
          .attr("y2", function (d) {
            return d.target.y;
          });

        linksText
          .attr("x", function (d) {
            return (d.source.x + d.target.x) / 2;
          })
          .attr("y", function (d) {
            return (d.source.y + d.target.y) / 2;
          });

        gs.attr("transform", function (d) {
          return "translate(" + d.x + "," + d.y + ")";
        });
      }
      function started(d) {
        if (!d3.event.active) {
          forceSimulation.alphaTarget(0.8).restart(); //设置衰减系数，对节点位置移动过程的模拟，数值越高移动越快，数值范围[0，1]
        }
        d.fx = d.x;
        d.fy = d.y;
      }
      function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
      }
      function ended(d) {
        if (!d3.event.active) {
          forceSimulation.alphaTarget(0);
        }
        d.fx = null;
        d.fy = null;
      }

    },
      chartChange(data){
        // d3.select('.relationchartsvg').remove()
        // this.init(data);
        // console.log(d3.selectAll('.lineg'))
        console.log('relationchart chartchange start')
        d3.selectAll('.edgeslink')
        .attr("stroke-width", (d,i)=>{
          return data.edges[i].value*5+2
        });
      },
  },
    computed:{
      getYear(){
        return this.$store.state.year; 
      },
      getCity(){
        return this.$store.state.city;
      }
    },
    watch:{
      getYear:function(newval,oldval){
        if(newval!=oldval){
          console.log('year:',newval)
          this.year = newval;
        axios.get(`http://localhost:3000/mainpolution?year=${this.year}&province=${this.province}`)
          .then((res)=>{
            // console.log(res.data)
            this.chartChange(res.data)
          }).catch(err=>{
            console.log(err)
          })
        }
      },
      getCity:function(newval,oldval){
        if(newval!=oldval){
          console.log('city',newval)
          this.province = newval;
        axios.get(`http://localhost:3000/mainpolution?year=${this.year}&province=${this.province}`)
          .then((res)=>{
            // console.log(res.data)
            this.chartChange(res.data)
          }).catch(err=>{
            console.log(err)
          })
        }
      }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#relationChart {
  height: 100%;
}
</style>
