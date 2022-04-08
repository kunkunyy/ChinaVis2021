<template>
  <div id="corChart"></div>
</template>

<script>
import * as d3 from "d3-v5";
import * as axios from "axios";
export default {
  name: "corChart",
  data() {
    return {
      year: 2013,
      city: "石家庄市",
      month: "01",
      data: null,
    };
  },
  mounted() {
    axios
      .get(
        `http://localhost:3000/corChart?year=${this.year}&month=${this.month}&city=${this.city}`
      )
      .then((res) => {
        this.data = res.data;
        this.init(this.data);
      })
      .catch((err) => {
        console.log(err);
      });
  },
  methods: {
    init(data) {
      // var marge = {top:60,bottom:60,left:60,right:60}
      var relationChart = document.getElementById("corChart");
      var width = relationChart.offsetWidth;
      var height = relationChart.offsetHeight;
      var svg = d3
        .select("#corChart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("class", "relationchartsvg");

      // console.log(d3.select("#relationChart"));

      var g = svg
        .append("g")
        .attr("width", width)
        .attr("height", height)
        .attr("class", "corChartg");

      //  .attr("transform","translate("+marge.top+","+marge.left+")");
      //	准备数据
      var nodes = data.nodes;

      var edges = data.edges;
      //新建一个力导向图
      var forceSimulation = d3
        .forceSimulation(nodes)
        .force("charge", d3.forceManyBody().strength(-200).distanceMax(80).distanceMin(50))
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
          return 50;
        });
      //设置图形的中心位置
      forceSimulation
        .force("center")
        .x(width / 2)
        .y(height / 2);

      //绘制边
      var links = g
        .append("g")
        .attr("class", "lineg")
        .selectAll("line")
        .data(edges)
        .enter()
        .append("line")
        .attr("class", "edgeslink")
        .attr("stroke", function (d, i) {
          if (d.value > 0) return "rgb(214,39,40)";
          else return "rgb(23,190,207)";
        })
        .attr("stroke-width", (d, i) => {
          return Math.abs(d.value) * 5;
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
        .attr("fill", (d,i)=>{
          return 'rgb(255,255,255)'
        })
        .call(
          d3.drag().on("start", started).on("drag", dragged).on("end", ended)
        );

      //绘制节点
      gs.append("circle")
        .attr("r", (d, i) => {
          return 14;
        })
        .attr("fill", function (d, i) {
          if(i>=7) return '#fdbd10'
          return "#ee6123";
        });
      //文字
      gs.append("text")
        .attr("x", 0)
        .attr("text-anchor", "middle")
        .attr("y", 0)
        .attr("dy", 5)
        .attr("font-size", "10px")
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
    chartChange(data) {
      // d3.select('.relationchartsvg').remove()
      // this.init(data);
      // console.log(d3.selectAll('.lineg'))
      d3.select("#corChart").select(".corChartg").remove();
      var svg = d3.select("#corChart").select("svg");

      var relationChart = document.getElementById("corChart");
      var width = relationChart.offsetWidth;
      var height = relationChart.offsetHeight;
      var g = svg
        .append("g")
        .attr("width", width)
        .attr("height", height)
        .attr("class", "corChartg");

      //  .attr("transform","translate("+marge.top+","+marge.left+")");
      //	准备数据
      var nodes = data.nodes;

      var edges = data.edges;

      //新建一个力导向图
      var forceSimulation = d3
        .forceSimulation(nodes)
        .force("charge", d3.forceManyBody().strength(-200).distanceMax(80).distanceMin(50))
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
          return 50;
        });
      //设置图形的中心位置
      forceSimulation
        .force("center")
        .x(width / 2)
        .y(height / 2);

      //绘制边
      var links = g
        .append("g")
        .attr("class", "lineg")
        .selectAll("line")
        .data(edges)
        .enter()
        .append("line")
        .attr("class", "edgeslink")
        .attr("stroke", function (d, i) {
          if (d.value > 0) return "rgb(214,39,40)";
          else return "rgb(23,190,207)";
        })
        .attr("stroke-width", (d, i) => {
          return Math.abs(d.value) * 5;
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
        .attr("fill", (d,i)=>{
            return 'rgb(255,255,255)'

        })
        .call(
          d3.drag().on("start", started).on("drag", dragged).on("end", ended)
        );

      //绘制节点
      gs.append("circle")
        .attr("r", (d, i) => {
          return 14;
        })
        .attr("fill", function (d, i) {
          if(i>=7) return '#fdbd10'
          return "#ee6123";
        });
      //文字
      gs.append("text")
      .attr("x", 0)
        .attr("text-anchor", "middle")
        .attr("y", 0)
        .attr("dy", 5)
        .attr("font-size", "10px")
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
  },
  computed: {
    getCity() {
      return this.$store.state.cityPoint;
    },
    getTime() {
      return this.$store.state.secondtime;
    },
  },
  watch: {
    getCity: function (newval, oldval) {
      if (newval != oldval) {
        this.city = newval;
        axios
          .get(
            `http://localhost:3000/corChart?year=${this.year}&month=${this.month}&city=${this.city}`
          )
          .then((res) => {
            this.data = res.data;
            this.chartChange(this.data);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    getTime: function (newval, oldval) {
      if (newval != oldval) {
        this.year = newval.split("-")[0];
        this.month = newval.split("-")[1];
        axios
          .get(
            `http://localhost:3000/corChart?year=${this.year}&month=${this.month}&city=${this.city}`
          )
          .then((res) => {
            this.data = res.data;
            this.chartChange(this.data);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#corChart {
  height: calc(100% - 20px);
}
</style>