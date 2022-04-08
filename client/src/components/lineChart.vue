<template>
  <div class="lineChart" id='lineChart'>
  </div>
</template>

<script>
import * as d3_v3 from "d3";
import * as d3 from 'd3-v5';
import * as axios from 'axios';
export default {
  name: 'lineChart',
  data () {
    return {
      city:'石家庄市',
      data:null,
      brushdata:null,
    }
  },
  mounted(){
      axios.get(`http://localhost:3000/lineChart?city=${this.city}`).then(res=>{
          console.log(res.data)
          this.data = res.data;
          this.initChart(this.data);
      }).catch(err=>{
          console.log(err);
      })
  },
  methods:{
      initChart(data){
        var lineChart = document.getElementById('lineChart');
        var width= lineChart.offsetWidth;
        var height = lineChart.offsetHeight;
        var margin = 30;
        var interval = 30;
        var color = ['#3be8b0','#1aafd0','#6a67ce','#ffb900','#fc636b','#ffff00']
        var polu = ['PM10','PM2.5','O3','NO2','SO2','CO']
        var parsedate  =d3.timeParse('%Y-%m')
        var max = d3.max([d3.max(data['PM10']),d3.max(data['PM2.5']),d3.max(data['O3']),d3.max(data['NO2']),d3.max(data['SO2']),d3.max(data['CO'])])
        var svg = d3.select(lineChart)
                    .append('svg')
                    .attr('width',width)
                    .attr('height',height);
        var g = svg.append('g').attr('class','lineChartg').attr('width',width).attr('height',height-interval);
        var g2 = svg.append('g').attr('class','timemg').attr('width',width).attr('height',interval-margin)
            .attr('transform',`translate(0,${height-2*margin-interval})`);
        var g3 = svg.append('g').attr('class','example').attr('width',150).attr('height',80)
                    .attr('transform',`translate(${width-150},0)`)
        g3.append('g')
            .selectAll('.exampleline')
            .data(polu)
            .enter()
            .append('line')
            .attr('class','exampleline')
            .attr('x1',5)
            .attr('y1',(d,i)=>(8+16*i))
            .attr('x2',30)
            .attr('y2',(d,i)=>(8+16*i))
            .attr('fill','none')
            .attr('stroke-width',2)
            .attr('stroke',(d,i)=>color[i])
        g3.append('g')
            .selectAll('.exampletext')
            .data(polu)
            .enter()
            .append('text')
            .attr('class','exampletext')
            .attr('x',35)
            .attr('y',(d,i)=>(16+16*i))
            .attr('fill','rgb(132, 182, 226)')
            .attr('font-weight',1000)
            .text(d=>d)
            

        var x = d3.scaleTime()
                    .range([margin,width-margin])
                    .domain(
                        d3.extent(data['date'],function(d,i){
                            return parsedate(d);
                        })
                    );
        var x2 = d3.scaleTime()
                    .range([margin,width-margin])
                    .domain(x.domain())
        var y = d3.scaleLinear()
                    .rangeRound([height-interval-margin,margin])
                    .domain([0,max])
        var y2 = d3.scaleLinear()
                    .rangeRound([margin+interval,margin])
                    .domain(y.domain())


        var line = d3.line()
                    .x((d,i)=>{
                        return x(parsedate(data['date'][i]))
                    })
                    .y(d=>y(d))
        var line2 = d3.line()
                    .x((d,i)=>{
                        return x(parsedate(data['date'][i]))
                    })
                    .y(d=>y2(d))
        var pathdata = [{data:data['PM10'],name:'PM10'},{data:data['PM2.5'],name:'PM2.5'},{data:data['O3'],name:'O3'},{data:data['NO2'],name:'NO2'},{data:data['SO2'],name:'SO2'},{data:data['CO'],name:'CO'}]
        var path = g.append('g')
        .attr('fill','none')
        .attr('stroke-width','1')
        .selectAll('.gpath')
        .data(pathdata)
        .enter()
        .append('path')
        .attr('class','gpath')
        .attr('mix-blend-mode','multiply')
        .attr('stroke',(d,i)=>color[i])
        .attr('d',d=>line(d.data))
        .on('mouseover',(d,i)=>{
            const e = d3.event;
            const position = d3.mouse(g.node());
            d3.select(e.target)
                .attr('stroke-width', '4');
            g. append('text')
                .classed('tip', true)
                .attr('x', position[0]+5)
                .attr('y',  position[1])
                .attr('fill', 'white')
                .text(d.name);
        })
        .on('mouseleave', function(d,i){
            const e = d3.event;
            d3.select(e.target)
                .attr('stroke-width', '1');
            d3.select('.tip').remove();
        })
        var path2 = g2.append('g')
        .attr('fill','none')
        .attr('stroke','steelblue')
        .selectAll('.g2path')
        .data(pathdata)
        .enter()
        .append('path')
        .attr('class','g2path')
        .attr('mix-blend-mode','multiply')
        .attr('d',d=>line2(d.data))
        var xAxis = d3.axisBottom(x);
        var yAxis = d3.axisLeft(y);
        var x2Axis = d3.axisBottom(x2).ticks(6);
        g.append('g').attr('transform',`translate(0,${height-interval-margin})`)
                    .attr('class','xAxis').call(xAxis)
        g.append('g').attr('transform',`translate(${margin},0)`)
                    .attr('class','yAxis').call(yAxis)
        g2.append('g').attr('transform',`translate(0,${interval+margin})`)
                    .attr('class','x2Axis').call(x2Axis)
        g.select('.xAxis').select('.domain').attr('stroke',"rgb(132, 182, 226)")
        g.select('.xAxis').selectAll('.tick line').attr('stroke',"rgb(132, 182, 226)")
        g.select('.xAxis').selectAll('.tick text').attr('fill',"rgb(132, 182, 226)")
        g.select('.yAxis').select('.domain').attr('stroke','noee')
        g.select('.yAxis').selectAll('.tick line').attr('stroke',"rgb(132, 182, 226)")
        g.select('.yAxis').selectAll('.tick text').attr('fill',"rgb(132, 182, 226)")
        g2.select('.x2Axis').select('.domain').attr('stroke',"rgb(132, 182, 226)")
        g2.select('.x2Axis').selectAll('.tick line').attr('stroke',"rgb(132, 182, 226)")
        g2.select('.x2Axis').selectAll('.tick text').attr('fill',"rgb(132, 182, 226)")
        /***画刷缩放部分***/
        //画刷函数
        let that = this;
        let throttlefn = this.throttle(function (data) {
            let date1 = new Date(data);
            let year1 = date1.getFullYear(),
            month1 = date1.getMonth();
            that.$store.state.secondtime = `${year1}-${(''+(month1+1)+'').padStart(2,'0')}`;
        }, 1000);

        function brushed(a, b, c) {
            if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'zoom') return
                //通过事件对象获取画刷目前的长度以及位置，类似brush.move(selection, [50, 100])
            let s = d3.event.selection || x2.range()
                //通过x2Scale.invert转化为新的xScale的domain
            x.domain(s.map(x2.invert, x2))
                //设置完新的xScale 重绘面积图以及x坐标轴
            throttlefn(s.map(x2.invert, x2)[0])
            var tmpline = d3.line()
                    .x((d,i)=>{
                        return x(parsedate(data['date'][i]))
                    })
                    .y(d=>y(d))

            g.selectAll('.gpath').attr('d', (d,i)=>tmpline(d.data))
            g.select('.xAxis').call(xAxis)
            g.select('.xAxis').selectAll('.tick line').attr('stroke','rgb(111,248,228)')
            g.select('.xAxis').selectAll('.tick text').attr('fill','rgb(111,248,228)')
            //选取面积图上的所有点与文字，重新赋值位置信息
            let s1 = x.domain();
            let d1 = s1.map((item) => {
                return x2(item);
            });
            that.brushdata=d1;
            // console.log(d1)
        }

      
  let brush = d3
        .brushX()
        .extent([
            [margin, margin],
            [width-margin,interval+margin]
        ])
        .on('brush end', brushed)

    g2.append('g') // 添加画刷
        .attr('class', 'brush')
        .call(brush)
        // .call(brush.move, xScale.range())
        //初始笔刷刷取范围
        .call(brush.move, [30, x2(parsedate("2016-01"))])



      },
      chartChange(data){
        var lineChart = document.getElementById('lineChart');
        var width= lineChart.offsetWidth;
        var height = lineChart.offsetHeight;
        var margin = 30;
        var interval = 30
       var color = ['#3be8b0','#1aafd0','#6a67ce','#ffb900','#fc636b','#ffff00']
        var polu = ['PM10','PM2.5','O3','NO2','SO2','CO']
        var parsedate  =d3.timeParse('%Y-%m')
        var max = d3.max([d3.max(data['PM10']),d3.max(data['PM2.5']),d3.max(data['O3']),d3.max(data['NO2']),d3.max(data['SO2']),d3.max(data['CO'])])
        var g=  d3.select('.lineChartg')
        var g2 = d3.select('.timemg')
        var x = d3.scaleTime()
                    .range([margin,width-margin])
                    .domain(
                        d3.extent(data['date'],function(d,i){
                            return parsedate(d);
                        })
                    );
        var x2 = d3.scaleTime()
                    .range([margin,width-margin])
                    .domain(x.domain())
        var y = d3.scaleLinear()
                    .rangeRound([height-interval-margin,margin])
                    .domain([0,max])
        
        var y2 = d3.scaleLinear()
                    .rangeRound([margin+interval,margin])
                    .domain(y.domain())
        var xAxis = d3.axisBottom(x);
        var yAxis = d3.axisLeft(y);
        g.select('.yAxis').call(yAxis);
        g.select('.yAxis').select('.domain').attr('stroke','none')
        g.select('.yAxis').selectAll('.tick line').attr('stroke',"rgb(132, 182, 226)")
        g.select('.yAxis').selectAll('.tick text').attr('fill',"rgb(132, 182, 226)")
        var line = d3.line()
                    .x((d,i)=>{
                        return x(parsedate(data['date'][i]))
                    })
                    .y(d=>y(d))
        var line2 = d3.line()
                    .x((d,i)=>{
                        return x(parsedate(data['date'][i]))
                    })
                    .y(d=>y2(d))

          g.selectAll('.gpath').remove();
          g2.selectAll('.g2path').remove();
          

          var pathdata = [{data:data['PM10'],name:'PM10'},{data:data['PM2.5'],name:'PM2.5'},{data:data['O3'],name:'O3'},{data:data['NO2'],name:'NO2'},{data:data['SO2'],name:'SO2'},{data:data['CO'],name:'CO'}]
          var path = g.append('g')
        .attr('fill','none')
        .attr('stroke-width','1')
        .selectAll('.gpath')
        .data(pathdata)
        .enter()
        .append('path')
        .attr('class','gpath')
        .attr('stroke',(d,i)=>color[i])
        .attr('mix-blend-mode','multiply')
        .attr('d',d=>line(d.data))
        .on('mouseover',(d,i)=>{
            const e = d3.event;
            const position = d3.mouse(g.node());
            d3.select(e.target)
                .attr('stroke-width', '4');
            g. append('text')
                .classed('tip', true)
                .attr('x', position[0]+5)
                .attr('y',  position[1])
                .attr('fill', 'white')
                .text(d.name);
        })
        .on('mouseleave', function(d,i){
            const e = d3.event;
            d3.select(e.target)
                .attr('stroke-width', '1');
            d3.select('.tip').remove();
        })
        var path2 = g2.append('g')
        .attr('fill','none')
        .attr('stroke','steelblue')
        .selectAll('.g2path')
        .data(pathdata)
        .enter()
        .append('path')
        .attr('class','g2path')
        .attr('mix-blend-mode','multiply')
        .attr('d',d=>line2(d.data))
        let that =this;
        let throttlefn = this.throttle(function (data) {
            let date1 = new Date(data);
            let year1 = date1.getFullYear(),
            month1 = date1.getMonth();
            that.$store.state.secondtime = `${year1}-${(''+(month1+1)+'').padStart(2,'0')}`;
        }, 1000);
        function brushed(a, b, c) {
            if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'zoom') return
                //通过事件对象获取画刷目前的长度以及位置，类似brush.move(selection, [50, 100])
            let s = d3.event.selection || x2.range()
                //通过x2Scale.invert转化为新的xScale的domain
            x.domain(s.map(x2.invert, x2))
                //设置完新的xScale 重绘面积图以及x坐标轴
            throttlefn(s.map(x2.invert, x2)[0])
            var tmpline = d3.line()
                    .x((d,i)=>{
                        return x(parsedate(data['date'][i]))
                    })
                    .y(d=>y(d))
            g.selectAll('.gpath').attr('d', (d,i)=>tmpline(d.data))
            g.select('.xAxis').call(xAxis)
            g.select('.xAxis').selectAll('.tick line').attr('stroke','"rgb(132, 182, 226)"')
            g.select('.xAxis').selectAll('.tick text').attr('fill','"rgb(132, 182, 226)"')
            let s1 = x.domain();
            let d1 = s1.map((item) => {
                return x2(item);
            });
            that.brushdata=d1;
            //选取面积图上的所有点与文字，重新赋值位置信息
        }
        g2.select('.brush').remove();
        // console.log(this.brushdata)
          let brush = d3
            .brushX()
            .extent([
                [margin, margin],
                [width-margin,interval+margin]
            ])
            .on('brush end',brushed)
            
        
            g2.append('g') // 添加画刷
            .attr('class', 'brush')
            .call(brush)
            // .call(brush.move, xScale.range())
            //初始笔刷刷取范围
            .call(brush.move, this.brushdata)

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
  },
  computed:{
      getCity(){
          return this.$store.state.cityPoint;
      }
  },watch:{
      getCity:function(newval,oldval){
          if(newval!=oldval){
              this.city = newval
            axios.get(`http://localhost:3000/lineChart?city=${this.city}`).then(res=>{
                console.log(res.data)
                this.data = res.data;
                this.chartChange(this.data);
            }).catch(err=>{
                console.log(err);
            })
          }
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#lineChart{
    height:calc(100% - 20px)
}
</style>
