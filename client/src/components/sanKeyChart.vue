<template>
  <div id="sanKeyChart">
    <div id="chart" style="z-index: 100"></div>
    <div id='chart2' style="z-index: 100" v-show="show"></div>
    <div class="timechange">
      <!-- <div class='timeyear' id ='timeyear'>年</div>
      <div class='timemonth' id ='timemonth'>月</div> -->
        <el-radio v-model="timeselect" label="0" id ='timeyear' class='timeyear' selected>年</el-radio>
        <el-radio v-model="timeselect" label="1" id ='timemonth' class='timemonth'>月</el-radio>
    </div>
  </div>
</template>

<script>
import * as d3 from "d3-v5";
import * as d3_v3 from "d3";
import * as d3_sankey from "d3-sankey";
import axios from "axios";
export default {
  name: "sanKeyChart",
  data() {
    return {
      data1: null,
      sankey: null,
      width: null,
      height: null,
      margin: 20,
      padding: 20,
      parseDate:null,
      yearData:null,
      monthData:null,
      timeselect:'1',
    };
  },
  mounted() {
    var timeyear = document.getElementById('timeyear');
    var timemonth = document.getElementById('timemonth');

    timeyear.addEventListener('click',e=>{
      this.parseDate = d3.timeParse("%Y");
      this.timeselect='0';
       this.chartChange(this.yearData);
    })
    timemonth.addEventListener('click',e=>{
      this.timeselect='1';
      this.parseDate = d3.timeParse("%Y-%m");
       this.chartChange(this.monthData)
    })
    axios
      .get("http://localhost:3000/sankeychart?mode=0")
      .then((res) => {
        console.log(res.data)
        this.yearData = res.data
       
        
      })
      .catch((err) => {
        console.log(err);
      });
    axios
      .get("http://localhost:3000/sankeychart?mode=1")
      .then((res) => {
        // console.log(res.data)
        this.monthData = res.data;
        var data = res.data;
        this.parseDate = d3.timeParse("%Y-%m");
        // this.initChart(data);
        this.initChart(data);
      })
      .catch((err) => {
        console.log(err);
      })
      .catch((err) => {
        console.log(err);
      });
  },
  methods: {
    Color() {
      const color = d3.scaleOrdinal(d3.schemeCategory10);
      return (d) => (color(d.category === undefined) ? d.name : d.category);
    },
    SankeyData(data) {
      const width = this.width,
        height = this.height - this.margin;
      const sankey = d3_sankey
        .sankey()
        .nodeSort((_a, _b) => {
          let a1 = _a.name,
            b1 = _b.name;
          let a = a1.split("&")[0],
            b = b1.split("&")[0];
          let degree1 = +a1.split("&")[1],
            degree2 = +b1.split("&")[1];
          let arr1 = a.split("-"),
            arr2 = b.split("-");
          let year1 = +arr1[0],
            year2 = +arr2[0],
            month1 = +arr1[1],
            month2 = +arr2[1];
          if (year1 == year2) {
            if (month1 == month2) {
              return degree1 - degree2
            }else{
              return month1 - month2;
            }
          } else{
            return year1 - year2;
          } 
        })
        .nodeId((d,i) => {return d.name})
        .nodeWidth(10)
        .nodePadding(5)
        .nodeAlign(d3_sankey["sankeyJustify"])
        .extent([
          [0, 0],
          [width-20, height-30],
        ]).iterations(6);
      this.sankey = sankey;
      return sankey(data);
    },
    initChart(data) {
      var sanKeyChart = document.getElementById("sanKeyChart");
      const width = sanKeyChart.offsetWidth;
      const height = sanKeyChart.offsetHeight;
      this.width = width;
      this.height = height;
      const margin = this.margin;
      const padding = this.padding;
      var color = [
        "rgb(0,228,0)",
        "rgb(255,255,0)",
        "rgb(255,126,0)",
        "rgb(255,0,0)",
        "rgb(153,0,76)",
        "rgb(126,0,35)",
      ];
      const { nodes, links } = this.SankeyData(data);
      var PARSEDATE = this.parseDate;
      var data1 = data.time;
      var chart = document.getElementById("chart");

      var svg = d3
        .select(chart)
        .append("svg")
        .attr("width", width)
        .attr("height", height);

      var g = svg.append("g").attr("class", "gMain");
      var g2 = svg
        .append("g")
        .attr("class", "gChart")
        .attr("transform", `translate(0,${height - margin + 5})`);
      var x = d3
        .scaleTime()
        .range([padding, width - padding])
        .domain(
          d3.extent(data1, function (d) {
            return PARSEDATE(d);
          })
        );
      var x2 = d3
        .scaleTime()
        .range([padding, width - padding])
        .domain(x.domain());

      var y = d3
        .scaleLinear()
        .domain([0, 1])
        .range([height - margin - padding, padding]);
      var xAxis1 = d3.axisBottom(x).tickFormat(d3.timeFormat("%Y年%m月"));
      var xAxis2 = d3.axisBottom(x2).tickFormat(d3.timeFormat("%Y年"));
      var xAxis1Chart = g
        .append("g")
        .attr("class", "xAxis1")
        .attr("transform", `translate(0,${height - margin - 20})`)
        .call(xAxis1);
      g.select(".xAxis1")
        .select(".domain")
        .attr("stroke", "rgb(132, 182, 226)");
      g.select(".xAxis1")
        .selectAll(".tick line")
        .attr("stroke", "rgb(132, 182, 226)");
      g.select(".xAxis1")
        .selectAll(".tick text")
        .attr("fill", "rgb(132, 182, 226)");
      var xAxis2Chart = g2.append("g").attr("class", "xAxis").call(xAxis2);
      xAxis2Chart.select(".domain").attr("stroke", "rgb(132, 182, 226)");
      xAxis2Chart.selectAll(".tick line").attr("stroke", "rgb(132, 182, 226)");
      xAxis2Chart.selectAll(".tick text").attr("fill", "rgb(132, 182, 226)");
      nodes.map((item) => {
        let dx = item.x1 - item.x0;
        let dy = item.y1 - item.y0;
        // let t = item.name.charCodeAt(0) - "a".charCodeAt(0) + 2016;
        if(item.name=='2013-12&5'){
           item.y0=178.00000000000014+5;
           item.y1 = item.y0+dy;
        }
        if(item.name=='2016-12&4'){
          item.y0=148.3262295081969+5;
          item.y1 = item.y0+dy;
        }
        if(item.name=='2016-12&5'){
          item.y0=159.84918032786902+5;
          item.y1 = item.y0+dy;
        }
        let t = item.name.split("&")[0];
        item.x0 = x(PARSEDATE(t));
        item.x1 = item.x0 + dx;
      });
      this.sankey.update({ nodes, links });
      var gRect = g.append("g").attr("class", "gRect");

      gRect
        .selectAll("rect")
        .attr("stroke", "#000")
        .attr("class", "nodeRect")
        .data(nodes)
        .join("rect")
        .attr("x", (d) => d.x0)
        .attr("y", (d) => d.y0)
        .attr("height", (d) => d.y1 - d.y0 + 2)
        .attr("width", (d) => d.x1 - d.x0)
        // .attr("fill", (d) => color[d.category.slice(1) - 1])
        .attr("fill", (d) => color[d.category.split("&")[1] - 1])
        .attr("stroke", "none")
        .attr("rx", 6)
        .append("title")
        .text((d) => d.name);
      var link = g
        .append("g")
        .attr("class", "gLink")
        .attr("fill", "none")
        .attr("stroke-opacity", 0.5)
        .selectAll("g")
        .attr("class", "gLinks")
        .data(links)
        .join("g")
        .style("mix-blend-mode", "normal");

      link
        .append("path")
        .attr("class", "pathlink")
        .attr("d", d3_sankey.sankeyLinkHorizontal())
        // .attr("stroke", (d) => color[d.source.category.slice(1) - 1])
        .attr("stroke", (d) => color[d.source.category.split("&")[1] - 1])
        .attr("stroke-width", (d) => Math.max(1, d.width));
      let that = this;

      let throttlefn = this.throttle(function (data) {
        let date1 = new Date(data[0]);
        let date2 = new Date(data[1]);
        // let year1 = date1.getFullYear(),year2 = date2.getFullYear(),
        // month1 = date1.getMonth(),month2= date2.getMonth(),
        // day1 = date1.getDate(),day2=date2.getDate();
        that.$store.state.year = date1.getFullYear();

        // console.log(data)
      }, 500);

      function brushed(a, b, c) {
        if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom")
          return;
        let s = d3.event.selection || x2.range();

        x.domain(s.map(x2.invert, x2));
        g.select(".xAxis1").call(xAxis1);
        g.select(".xAxis1")
          .select(".domain")
          .attr("stroke", "rgb(132, 182, 226)");
        g.select(".xAxis1")
          .selectAll(".tick line")
          .attr("stroke", "rgb(132, 182, 226)");
        g.select(".xAxis1")
          .selectAll(".tick text")
          .attr("fill", "rgb(132, 182, 226)");
        throttlefn(s.map(x2.invert, x2));

        nodes.map((item) => {
          let dx = item.x1 - item.x0;
          let dy = item.y1 - item.y0;
          // let tmp = item.name.charCodeAt(0) - "a".charCodeAt(0) + 2016;
          if(this.timeselect==1){
            if(item.name=='2013-12&5'){
           item.y0=178.00000000000014+5;
           item.y1 = item.y0+dy;
          }
          if(item.name=='2016-12&4'){
            item.y0=148.3262295081969+5;
            item.y1 = item.y0+dy;
          }
          if(item.name=='2016-12&5'){
            item.y0=159.84918032786902+5;
            item.y1 = item.y0+dy;
          }
          }
          let tmp = item.name.split("&")[0];
          item.x0 = x(PARSEDATE(tmp));
          item.x1 = item.x0 + dx;
        });
        that.sankey.update({ nodes, links });
        g.selectAll("rect").attr("x", (d) => d.x0);
        link.selectAll("path").attr("d", d3_sankey.sankeyLinkHorizontal());
      }
      function zoomed() {
        if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush")
          return;
        //t为随着滚轮缩放的动态比例值包含缩放信息k以及transform信息x和y
        let t = d3.event.transform;
        //通过t上的rescaleX方法重新定义动态的domain且绑定至xScale
        x.domain(t.rescaleX(x2).domain());
        //重新绘制面积图与坐标轴
        g.select(".xAxis1").call(xAxis1);
        g.select(".xAxis1")
          .select(".domain")
          .attr("stroke", "rgb(132, 182, 226)");
        g.select(".xAxis1")
          .selectAll(".tick line")
          .attr("stroke", "rgb(132, 182, 226)");
        g.select(".xAxis1")
          .selectAll(".tick text")
          .attr("fill", "rgb(132, 182, 226)");
        throttlefn(t.rescaleX(x2).domain());
        nodes.map((item) => {
          let dx = item.x1 - item.x0;
          let dy = item.y1 - item.y0;
          // let tmp = item.name.charCodeAt(0) - "a".charCodeAt(0) + 2016;
          let tmp = item.name.split("&")[0];

          item.x0 = x(PARSEDATE(tmp));
          item.x1 = item.x0 + dx;
        });
        that.sankey.update({ nodes, links });
        g.selectAll("rect").attr("x", (d) => d.x0);
        link.selectAll("path").attr("d", d3_sankey.sankeyLinkHorizontal());

        //当面积图产生缩放时，让brush跟着变化大小与位置
        //s为获取的当前面积图的domain(是一个时间数组)
        let s = x.domain();
        //把当前的domain通过x2Scale转化为range的数字数组(即为brush的位置信息)
        let d = s.map((item) => {
          return x2(item);
        });
        //通过brush.move方法动态修改brush的大小与位置
        brush.move(g2.select(".brush"), d);
      }

      let brush = d3
        .brushX()
        .extent([
          [margin, -20],
          [width-margin, 0],
        ])
        .on("brush end", brushed);
      g2.append("g") // 添加画刷
        .attr("class", "brush")
        .call(brush)
        // .call(brush.move, xScale.range())
        //初始笔刷刷取范围
        .call(brush.move, [
          x2(PARSEDATE("2013-01")),
          x2(PARSEDATE("2014-1")) - 10,
        ]);
      let zoom = d3
        .zoom() // 设置zoom
        //设置缩放范围
        .scaleExtent([1, 20])
        //设置transform的范围
        .translateExtent([
          [0, 0],
          [width, height - margin],
        ])
        //设置缩放的视口的大小; 注:此时视口大小与transform范围一样说明无法拖动只可滚轮缩放
        .extent([
          [0, 0],
          [width, height - margin],
        ])
        .on("zoom end", zoomed);

      // svg
      //   .append("g")
      //   .append("rect") // 添加刷放方块
      //   .attr("class", "zoom")
      //   .attr("width", width)
      //   .attr("height", height - margin)
      //   .attr("cursor", "move")
      //   .attr("pointer-events", "all")
      //   .attr("fill", "none")
      //   .attr("transform", `translate(0,${-padding})`)
      //   .call(zoom);
    },
    throttle(fn, time) {
      var _self = fn,
        timer,
        firstTime = true;
      return function () {
        var args = arguments,
          _me = this;
        if (firstTime) {
          _self.apply(_me, args);
          return (firstTime = false);
        }
        if (timer) {
          clearTimeout(timer);
        }
        timer = setTimeout(function () {
          timer = null;
          _self.apply(_me, args);
        }, time || 500);
      };
    },
    chartChange(data) {
      var sanKeyChart = document.getElementById("sanKeyChart");
      const width = sanKeyChart.offsetWidth;
      const height = sanKeyChart.offsetHeight;
      this.width = width;
      this.height = height;
      const margin = this.margin;
      const padding = this.padding;
      var color = [
        "rgb(0,228,0)",
        "rgb(255,255,0)",
        "rgb(255,126,0)",
        "rgb(255,0,0)",
        "rgb(153,0,76)",
        "rgb(126,0,35)",
      ];
      const { nodes, links } = this.SankeyData(data);
      var PARSEDATE = this.parseDate;
      var data1 = data.time;
      var chart = document.getElementById("chart");
      var svg = d3.select(chart).select("svg");
      var g = svg.select(".gMain");
      var g2 = svg.select(".gChart");
      var x = d3
        .scaleTime()
        .range([padding, width - padding])
        .domain(
          d3.extent(data1, function (d) {
            return PARSEDATE(d);
          })
        );
      var x2 = d3
        .scaleTime()
        .range([padding, width - padding])
        .domain(x.domain());

      var y = d3
        .scaleLinear()
        .domain([0, 1])
        .range([height - margin - padding, padding]);
      var xAxis1 = d3.axisBottom(x).tickFormat(d3.timeFormat('%Y年%m月'))
      var xAxis2 = d3.axisBottom(x2).tickFormat(d3.timeFormat('%Y年'));
      g.select('.xAxis1').remove();
     var xAxis1Chart =g.append('g')
        .attr('class','xAxis1')
        .attr('transform',`translate(0,${height-margin-20})`)
        .call(xAxis1)
        g.select('.xAxis1').select('.domain').attr('stroke','rgb(132, 182, 226)');
        g.select('.xAxis1').selectAll('.tick line').attr('stroke','rgb(132, 182, 226)')
        g.select('.xAxis1').selectAll('.tick text').attr('fill','rgb(132, 182, 226)')
        g2.select('.xAxis').remove();
      var xAxis2Chart =g2.append('g')
        .attr('class','xAxis')
        .call(xAxis2)
        xAxis2Chart.select('.domain').attr('stroke','rgb(132, 182, 226)')
        xAxis2Chart.selectAll('.tick line').attr('stroke','rgb(132, 182, 226)')
        xAxis2Chart.selectAll('.tick text').attr('fill','rgb(132, 182, 226)')

      nodes.map((item) => {
        let dx = item.x1 - item.x0;
        let dy = item.y1 - item.y0;
        // let t = item.name.charCodeAt(0) - "a".charCodeAt(0) + 2016;
        if(this.timeselect=='1'){
          if(item.name=='2013-12&5'){
            item.y0=178.00000000000014+5;
            item.y1 = item.y0+dy;
          }
          if(item.name=='2016-12&4'){
            item.y0=148.3262295081969+5;
            item.y1 = item.y0+dy;
          }
          if(item.name=='2016-12&5'){
            item.y0=159.84918032786902+5;
            item.y1 = item.y0+dy;
          }
        }
        let t = item.name.split("&")[0];
        item.x0 = x(PARSEDATE(t));
        item.x1 = item.x0 + dx;
      });
      this.sankey.update({ nodes, links });
      g.select(".gRect").remove();
      var gRect = g.append("g").attr("class", "gRect");
      gRect
        .selectAll("rect")
        .attr("stroke", "#000")
        .attr("class", "nodeRect")
        .data(nodes)
        .join("rect")
        .attr("x", (d) => d.x0)
        .attr("y", (d) => d.y0)
        .attr("height", (d) => d.y1 - d.y0 + 2)
        .attr("width", (d) => d.x1 - d.x0)
        // .attr("fill", (d) => color[d.category.slice(1) - 1])
        .attr("fill", (d) => color[d.category.split("&")[1] - 1])
        .attr("stroke", "none")
        .attr("rx", 6)
        .append("title")
        .text((d) => d.name);
      g.select(".gLink").remove();
      var link = g
        .append("g")
        .attr("class", "gLink")
        .attr("fill", "none")
        .attr("stroke-opacity", 0.5)
        .selectAll("g")
        .attr("class", "gLinks")
        .data(links)
        .join("g")
        .style("mix-blend-mode", "normal");

      link
        .append("path")
        .attr("class", "pathlink")
        .attr("d", d3_sankey.sankeyLinkHorizontal())
        // .attr("stroke", (d) => color[d.source.category.slice(1) - 1])
        .attr("stroke", (d) => color[d.source.category.split("&")[1] - 1])
        .attr("stroke-width", (d) => Math.max(1, d.width));

      let that = this;
      let throttlefn = this.throttle(function (data) {
        let date1 = new Date(data[0]);
        let date2 = new Date(data[1]);
        // let year1 = date1.getFullYear(),year2 = date2.getFullYear(),
        // month1 = date1.getMonth(),month2= date2.getMonth(),
        // day1 = date1.getDate(),day2=date2.getDate();
        that.$store.state.year = date1.getFullYear();
      }, 1000);

      function brushed(a, b, c) {
        if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom")
          return;

        let s = d3.event.selection || x2.range();

        x.domain(s.map(x2.invert, x2));

        throttlefn(s.map(x2.invert, x2));

        nodes.map((item) => {
          let dx = item.x1 - item.x0;
          let dy = item.y1 - item.y0;
          // let tmp = item.name.charCodeAt(0) - "a".charCodeAt(0) + 2016;
          let tmp = item.name.split("&")[0];
          item.x0 = x(PARSEDATE(tmp));
          item.x1 = item.x0 + dx;
        });
        that.sankey.update({ nodes, links });
        g.selectAll("rect").attr("x", (d) => d.x0);
        link.selectAll("path").attr("d", d3_sankey.sankeyLinkHorizontal());
      }
      function zoomed() {
        if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush")
          return;
        //t为随着滚轮缩放的动态比例值包含缩放信息k以及transform信息x和y
        let t = d3.event.transform;
        //通过t上的rescaleX方法重新定义动态的domain且绑定至xScale
        x.domain(t.rescaleX(x2).domain());
        //重新绘制面积图与坐标轴

        throttlefn(t.rescaleX(x2).domain());
        nodes.map((item) => {
          let dx = item.x1 - item.x0;
          let dy = item.y1 - item.y0;
          // let tmp = item.name.charCodeAt(0) - "a".charCodeAt(0) + 2016;
          let tmp = item.name.split("&")[0];

          item.x0 = x(PARSEDATE(tmp));
          item.x1 = item.x0 + dx;
        });
        that.sankey.update({ nodes, links });
        g.selectAll("rect").attr("x", (d) => d.x0);
        link.selectAll("path").attr("d", d3_sankey.sankeyLinkHorizontal());

        //当面积图产生缩放时，让brush跟着变化大小与位置
        //s为获取的当前面积图的domain(是一个时间数组)
        let s = x.domain();
        //把当前的domain通过x2Scale转化为range的数字数组(即为brush的位置信息)
        let d = s.map((item) => {
          return x2(item);
        });
        //通过brush.move方法动态修改brush的大小与位置
        brush.move(g2.select(".brush"), d);
      }

      let brush = d3
        .brushX()
        .extent([
          [margin, -20],
          [width-margin, 0],
        ])
        .on("brush end", brushed);
        g2.select('.brush').remove();
      var brush1,brush2;
      if(this.timeselect=='0'){
        brush1=x2(PARSEDATE("2013"));
        brush2=x2(PARSEDATE("2018"));
      }else{
        brush1=x2(PARSEDATE("2013-01"));
        brush2=x2(PARSEDATE("2014-01"));        
      }
      g2.append("g") // 添加画刷
        .attr("class", "brush")
        .call(brush)
        // .call(brush.move, xScale.range())
        //初始笔刷刷取范围
        .call(brush.move, [brush1, brush2-10]);
      let zoom = d3
        .zoom() // 设置zoom
        //设置缩放范围
        .scaleExtent([1, 20])
        //设置transform的范围
        .translateExtent([
          [0, 0],
          [width, height - margin],
        ])
        //设置缩放的视口的大小; 注:此时视口大小与transform范围一样说明无法拖动只可滚轮缩放
        .extent([
          [0, 0],
          [width, height - margin],
        ])
        .on("zoom end", zoomed);
      
    }
  },
  computed: {

  },
  watch: {
  
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#sanKeyChart {
  background-color: transparent;
  height: calc(100% - 30px);
}
.timechange{
  position:absolute;
  height:20px;
  right:90px;
  top:2px;
}
.timechange::after{
  clear:both;
}
.timechange>div{
  float:left;
}
</style>
