<template>
  <div id="airPolutionChart">
    <!-- <button v-on:click="greet">1111111</button> -->
    <div id="apchart"></div>
  </div>
</template>

<script>
import * as d3 from "d3-v5";
import axios from "axios";
export default {
  name: "airPolutionChart",
  data() {
    return {
      year: 2013,
      month: "01",
      city: "石家庄市",
      data: null,
      radius: 0,
    };
  },
  mounted() {
    axios
      .get(
        `http://localhost:3000/radar?year=${this.year}&month=${this.month}&city=${this.city}`
      )
      .then((res) => {
        // console.log(res.data)
        this.data = res.data;
        this.initChart(this.data);
      })
      .catch((err) => {
        console.log(err);
      });
    // this.initChart(data);
  },
  methods: {
    initChart(_data) {
      var data = _data;

      var color = [
        "rgb(59,119,175)",
        "rgb(174,205,225)",
        "rgb(187,221,147)",
        "rgb(239,133,51)",
        "rgb(244,193,123)",
        "rgb(166,93,52)",
      ];
      var airPolutionChart = document.getElementById("airPolutionChart");
      var width = airPolutionChart.offsetWidth;
      var height = airPolutionChart.offsetHeight;
      var radius = Math.max(Math.min(width, height) / 2 - 35, 50);
      this.radius = radius;
      var scaleRadius = d3.scaleLinear().range([0, radius]).domain([0, radius]);
      var chart = document.getElementById("apchart");
      var svg = d3
        .select(chart)
        .append("svg")
        .attr("width", width)
        .attr("height", height);
      var g = svg.append("g").attr("class", "radarchartg");
      var points = this.getPolygonPoints(data.length, radius, 5);
      var axes = g
        .append("g")
        .attr("class", "axes")
        .attr("transform", `translate(${width / 2},${height / 2})`)
        .selectAll("axis")
        .data(points);
      axes
        .enter()
        .append("polygon")
        .attr("class", "axis")
        .merge(axes)
        .attr("points", (d) => d)
        .attr("fill", (d, i) => i%2==0?'rgb(53,88,125)':'rgb(72,99,135)')
        .attr("stroke", "gray");
      axes.exit().remove();
      var line = d3.line();
      var outerPoints = points[0].split(" ").map((d) => d.split(","));
      var lines = d3.select(".axes").selectAll(".line").data(outerPoints);
      lines
        .enter()
        .append("path")
        .attr("class", "line")
        .merge(lines)
        .attr("d", (d) => {
          return line([
            [0, 0],
            [d[0], d[1]],
          ]);
        })
        .attr("stroke", "gray");
      lines.exit().remove();
      var texts = d3.select(".axes").selectAll(".label").data(data);
      texts
        .enter()
        .append("text")
        .attr("class", "label")
        .merge(texts)
        .attr(
          "x",
          (d, i) => Math.sin((i * Math.PI * 2) / data.length) * (radius + 20)
        )
        .attr(
          "y",
          (d, i) => Math.cos((i * Math.PI * 2) / data.length) * (radius + 20)
        )
        .attr("text-anchor", (d, i) => this.computeTextAnchor(data, i))
        .attr("dy", 0.5)
        .attr("fill", "rgb(132, 182, 226)")
        .text((d) => d.subject);

      var newData = this.handleData(data);
      var polygons = g.selectAll(".polygons").data(newData);
      polygons
        .enter()
        .append("g")
        .attr("class", "polygong")
        .attr("transform", `translate(${width / 2},${height / 2})`)
        .append("polygon")
        .attr("class", "polygon")
        .merge(polygons)
        .attr("fill", "none")
        .attr("stroke", (d, i) => {
          if (d.person == this.city) return "rgb(255,0,0)";
          return "rgb(255,255,0)";
        })
        .attr("stroke-width", "2")
        .attr("opacity", (d, i) => {
          if (d.person == this.city) return 1;
          else return 0.5;
        })
        .attr("points", (d, i) => {
          let minPolygon = [];
          d.forEach((d) => {
            minPolygon.push("0,0");
          });
          return minPolygon.join(" ");
        })
        .transition()
        .duration(500)
        .attr("points", this.generatePolygons);
      polygons.exit().remove();
      d3.selectAll(".polygon")
        .on("mouseover", function (d) {
          const e = d3.event;
          const position = d3.mouse(g.node());

          d3.select(e.target).attr("stroke-width", "4");

          g.append("text")
            .classed("tip", true)
            .attr("x", position[0] + 5)
            .attr("y", position[1])
            .attr("fill", "rgb(132, 182, 226)")
            .text(d.person);
        })
        .on("mouseleave", function () {
          const e = d3.event;

          d3.select(e.target).attr("stroke-width", "2");

          d3.select(".tip").remove();
        });
    },
    chartChange(_data) {
      var data = _data;
      var data = _data;

      var color = [
        "rgb(59,119,175)",
        "rgb(174,205,225)",
        "rgb(187,221,147)",
        "rgb(239,133,51)",
        "rgb(244,193,123)",
        "rgb(166,93,52)",
      ];
      var airPolutionChart = document.getElementById("airPolutionChart");
      var width = airPolutionChart.offsetWidth;
      var height = airPolutionChart.offsetHeight;
      var radius = Math.max(Math.min(width, height) / 2 - 35, 50);
      this.radius = radius;
      var svg = d3.select(document.getElementById("apchart")).select("svg");
      var g = svg.select(".radarchartg");
      g.selectAll(".polygong").remove();
      var newData = this.handleData(data);
      var polygons = g.selectAll(".polygons").data(newData);
      polygons
        .enter()
        .append("g")
        .attr("class", "polygong")
        .attr("transform", `translate(${width / 2},${height / 2})`)
        .append("polygon")
        .attr("class", "polygon")
        .merge(polygons)
        .attr("fill", "none")
        .attr("stroke", (d, i) => {
          if (d.person == this.city) return "rgb(255,0,0)";
          return "rgb(255,255,0)";
        })
        .attr("stroke-width", "2")
        .attr("opacity", (d, i) => {
          if (d.person == this.city) return 1;
          else return 0.5;
        })
        .attr("points", (d, i) => {
          let minPolygon = [];
          d.forEach((d) => {
            minPolygon.push("0,0");
          });
          return minPolygon.join(" ");
        })
        .transition()
        .duration(500)
        .attr("points", this.generatePolygons);
      polygons.exit().remove();
      d3.selectAll(".polygon")
        .on("mouseover", function (d) {
          const e = d3.event;
          const position = d3.mouse(g.node());

          d3.select(e.target).attr("stroke-width", "4");

          g.append("text")
            .classed("tip", true)
            .attr("x", position[0] + 5)
            .attr("y", position[1])
            .attr("fill", "rgb(132, 182, 226)")
            .text(d.person);
        })
        .on("mouseleave", function () {
          const e = d3.event;

          d3.select(e.target).attr("stroke-width", "2");

          d3.select(".tip").remove();
        });
    },
    getPolygonPoints(vertexNum, outerRadius, tickNum) {
      const points = [];
      let polygon;

      if (vertexNum < 3) return points;

      const anglePiece = (Math.PI * 2) / vertexNum;
      const radiusReduce = outerRadius / tickNum;

      for (let r = outerRadius; r > 0; r -= radiusReduce) {
        polygon = [];

        for (let i = 0; i < vertexNum; i++) {
          polygon.push(
            Math.sin(i * anglePiece) * r + "," + Math.cos(i * anglePiece) * r
          );
        }

        points.push(polygon.join(" "));
      }

      return points;
    },
    computeTextAnchor(data, i) {
      if (data.length < 3) return;

      const angle = (i * 360) / data.length;

      if (angle === 0 || Math.abs(angle - 180) < 0.01) {
        return "middle";
      } else if (angle > 180) {
        return "end";
      } else {
        return "start";
      }
    },
    handleData(data) {
      const newData = [];

      Object.keys(data[0]).forEach((key) => {
        if (key !== "subject") {
          const item = [];
          item.person = key;
          newData.push(item);
        }
      });
      let namelist = [];
      for (let i in data[0]) {
        if (i == "subject") continue;
        namelist.push(i);
      }
      data.forEach((d) => {
        newData.forEach((item, i) => {
          item.push([d.subject, d[namelist[i]]]);
        });
      });
      // console.log(newData)
      return newData;
    },
    generatePolygons(d, index) {
      const points = [];
      const anglePiece = (Math.PI * 2) / d.length;
      var scaleRadius = this.getScaleRadius(this.data);
      d.forEach((item, i) => {
        const x = Math.sin(i * anglePiece) * scaleRadius["PM10"](item[1]);
        const y = Math.cos(i * anglePiece) * scaleRadius["PM10"](item[1]);

        //添加交点圆圈
        // d3.select('.g-' + d.person)
        //     .append('circle')
        //     .attr('class', 'point-' + d.person)
        //     .attr('fill', 'white')
        //     .attr('stroke', color[index])
        //     .attr('cx', 0)
        //     .attr('cy', 0)
        //     .attr('r', 3)
        //     .transition().duration(500)
        //     .attr('cx', x)
        //     .attr('cy', y)

        points.push(x + "," + y);
      });
      // console.log(points)
      return points.join(" ");
    },
    getScaleRadius(data) {
      let dict = {};
      for (let i of data) {
        if (dict[i.subject] == null) {
          dict[i.subject] = [];
        }
        for (let j in i) {
          if (j == "subject") continue;
          dict[i.subject].push(i[j]);
        }
      }
      let scaledict = {};
      let max =0;
      for (let i in dict) {
        if(d3.max(dict[i])<=max) continue;
        max = d3.max(dict[i]);
        var radius = this.radius;
        let scale = d3
          .scaleLinear()
          .domain([0, d3.max(dict[i])])
          .range([0, radius]);
        scaledict[i] = scale;
      }
      return scaledict;
    },
    // greet(){
    //     this.city = "三亚市";
    //     axios.get(`http://localhost:3000/radar?year=${this.year}&month=${(this.month+'').padStart(2,'0')}&city=${this.city}`)
    //     .then(res=>{
    //         // console.log(res.data)
    //         this.data = res.data;
    //         this.chartChange(this.data)
    //     }).catch(err=>{
    //         console.log(err)
    //     })
    // }
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
            `http://localhost:3000/radar?year=${this.year}&month=${this.month}&city=${this.city}`
          )
          .then((res) => {
            // console.log(res.data)
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
            `http://localhost:3000/radar?year=${this.year}&month=${this.month}&city=${this.city}`
          )
          .then((res) => {
            // console.log(res.data)
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
#airPolutionChart {
  height: calc(100% - 20px);
}
</style>
