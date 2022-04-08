<template>
  <div id="continer">
    <div id="title">
      <div class="label" style="left:5%">省/市</div>
      <div class="label" style="left:15%">AQI分布</div>
      <div class="label" style="left:35%">年均AQI</div>
      <div class="button" style="position:absolute;left:55%">
        <el-button size="mini" @click="sortAscend()" circle icon="el-icon-caret-bottom" style="background:#212232; color:white; border: 0px;"></el-button>
        <el-button size="mini" @click="sortDesascend()" circle icon="el-icon-caret-top" style="background:#212232; color:white; border: 0px;"></el-button>
      </div>
      <div class="label" style="left:78%">年达标天数</div>
    </div>
    <div id="bar" class="bar-angel">
      <div id="piechart"></div>
      <div id="mbarchart"></div>
      <div id="rbarchart"></div>
    </div>
  </div>
</template>

<script>
import G2 from "@antv/g2";
import {DataSet} from "@antv/data-set";
import * as echarts from "echarts";
import axios from 'axios';
export default {
  name: "barChart",
  data() {
    return {
      chart:null,
      chartr:null,
      baseDataProvince:null,
      baseDataCity:null,
      baseDataProvinceChoose:null,
      baseDataCityChoose:null,
      timetype:0,
      time:2013,
      city:'',
      cityArr:[],
      pieChartData:[],
      mbarChartData:{},
      rbarChartData:[],
      rank:1,
      level:1
    }
  },
  computed:{
    getTime(){
      return this.$store.state.year;
    },
    getLevel(){
      return this.$store.state.level
    },
    getCity(){
      return this.$store.state.city
    }
  },
  watch:{
    getTime:function(newVal,oldVal){
      this.time = newVal
      if(this.time==2013){
        this.timetype=0
      }else if(this.time==2014){
        this.timetype=1
      }else if(this.time==2015){
        this.timetype=2
      }else if(this.time==2016){
        this.timetype=3
      }else if(this.time==2017){
        this.timetype=4
      }else{
        this.timetype=5
      }
      if(this.rank==1){
        this.sortAscend()
      }else{
        this.sortDesascend()
      }
      this.pieChart()
      this.mbarChart()
      this.rbarChart()
      this.mbarChartInit()
      this.pieChartInit()
      this.rbarChartInit()
    },
    getCity:function(newVal,oldVal){
      if(newVal=="新疆维吾尔自治区"){
        this.city="新疆"
      }else if(newVal=="西藏自治区"){
        this.city="西藏"
      }else if(newVal=="广西壮族自治区"){
        this.city="广西"
      }else if(newVal=="宁夏回族自治区"){
        this.city="宁夏"
      }else if(newVal=="内蒙古自治区"){
        this.city="内蒙古"
      }else{
        let arr=newVal.split('省')[0].split('市')
        this.city=arr[0]
      }
      this.pieChart()
      this.mbarChart()
      this.rbarChart()
      this.mbarChartInit()
      this.pieChartInit()
      this.rbarChartInit()
    },
    getLevel:function(newVal,oldVal){
      this.level = newVal
      this.city=""
      this.sortAscend()
    }
  },
  mounted() {
    axios.get('http://localhost:3000/barChartData').then(
      response=>{
        this.baseDataProvince = response.data[0];
        this.baseDataCity=response.data[1];
        this.sortAscend()
        this.pieChart()
        this.mbarChart()
        this.rbarChart()
        this.mbarChartInit()
        this.pieChartInit()
        this.rbarChartInit()
      }
    )
  },
  methods: {
    mbarChartInit(){
      let that = this;
      let myChart = echarts.init(document.getElementById("mbarchart"));
      let option = {
        textStyle:{color:"#ffffff"},
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: "15%",
          right: "5%",
          bottom: "0%",
          top: "0%",
          height: "90%",
          containLabel: true
        },
        xAxis: {
          spiltLine:{
            lineStyle:{
              type: 'dotted',
            },
            show:true,
          },
        },
        yAxis: {
          type: "category",
          data: that.mbarChartData.city,
          position: 'left',
          offset: 30,
          axisLabel: {
            margin: 20
          },
          nameTextStyle: {
            color: "#13142A"
          },
          axisTick:{
            inside:true
          },
          axisLine: {
            show: false
          },
        },
        series: [
          {
            name: "年均AQI",
            type: "bar",
            stack: "总量",
            barWidth: "60%",
            itemStyle: {
              color: function(params){
                if(params.value<=50){
                  return 'rgb(0,228,0)'
                }else if(params.value>50&&params.value<=100){
                  return "rgb(255,255,0)"
                }else if(params.value>100&&params.value<=150){
                  return "rgb(255,126,0)"
                }else if(params.value>150&&params.value<=200){
                  return "rgb(255,0,0)"
                }else if(params.value>200&&params.value<=300){
                  return "rgb(153,0,76)"
                }else{
                  return "rgb(126,0,35)"
                }
              }
            },
            label: {
              show: false,
              position: "insideRight"
            },
            data: that.mbarChartData.AQI
          },
        ]
      };
      myChart.setOption(option,true)
    },
    pieChartInit(){
      let that = this;
      if (that.chart) {
        that.chart.destroy();
      }
      that.chart = new G2.Chart({
        container: "piechart",
        padding: [0, 0, 0, 0],
        height: document.getElementById("piechart").offsetHeight,
        width: document.getElementById("piechart").offsetWidth
      });
      that.chart.source(that.pieChartData);
      that.chart.legend(false);
      that.chart.tooltip({
        showTitle: false
      });
      that.chart.coord("theta", {
        radius: 0.7,
        innerRadius:0.4
      });
      that.chart.facet("list", {
        fields: ["city"],
        cols: 1,
        padding: 0,
        line: {
          stroke: "#00a3d7"
        },
        showTitle: false,

        eachView(view, facet) {
          const _data = facet.data;
          const dv = new DataSet.View();
          dv.source(_data).transform({
            type: "percent",
            field: "value",
            dimension: "type",
            as: "percent"
          });
          view.source(dv, {
            percent: {
              formatter(val) {
                return (val * 100).toFixed(2) + "%";
              }
            }
          });
          view
            .interval()
            .position("percent")
            .color("type", ["rgb(0,228,0)","rgb(255,255,0)","rgb(255,126,0)","rgb(255,0,0)","rgb(153,0,76)","rgb(126,0,35)"])
            .adjust("stack");
        }
      });
      that.chart.render();
    },
    rbarChartInit(){
      let that = this;
      if(that.chartr){
        that.chartr.destroy();
      }
      that.chartr = new G2.Chart({
        container:"rbarchart",
        padding: [0, 0, 40, 0],
        height: document.getElementById("rbarchart").offsetHeight,
        width: document.getElementById("rbarchart").offsetWidth
      });
      that.chartr.source(this.rbarChartData)
      that.chartr.axis('达标天数',{
        grid:{
          lineStyle:{
            lineWidth:0
          }
        }
      })
      that.chartr.axis('year',{
        tickLine:{
          length: 0
        },
        label:{
          textStyle:{
            fill: 'white'
          }
        }
      })

      that.chartr.facet("list",{
        fields: ["city"],
        cols: 1,
        padding :3,
        showTitle: false,
        eachView(view,facet){
          const _data = facet.data;
          const dv = new DataSet.View();
          dv.source(_data);
          view.source(dv);
          view.coord("rect")
          view.interval()
            .position('year*达标天数')
            .color("达标天数","#71DBF9")
        },
      })
      that.chartr.render();
    },
    sortAscend(){
      if(this.level==1){
        for(var i =0;i<6;i++){
          this.baseDataProvince[i]['data'] = this.baseDataProvince[i]['data'].sort((a,b)=>
            +a['data'][1] < +b['data'][1] ? 1 : +b['data'][1] < +a['data'][1] ? -1 :0
          );
        }
        for(var i=0;i<6;i++){
          for(var j in this.baseDataProvince[i]['data']){
            var p=parseInt(j)+1
            this.baseDataProvince[i]['data'][j]['rank']=p.toString()+'.'+this.baseDataProvince[i]['data'][j]['city']
          }
        }
        this.rank=1
        this.baseDataProvinceChoose=this.baseDataProvince[this.timetype]['data']
      }else{
        for(var i =0;i<6;i++){
          this.baseDataCity[i]['data'] = this.baseDataCity[i]['data'].sort((a,b)=>
            +a['data'][1] < +b['data'][1] ? 1 : +b['data'][1] < +a['data'][1] ? -1 :0
          );
        }
        for(var i=0;i<6;i++){
          for(var j in this.baseDataCity[i]['data']){
            var p=parseInt(j)+1
            this.baseDataCity[i]['data'][j]['rank']=p.toString()+'.'+this.baseDataCity[i]['data'][j]['city']
          }
        }
        this.rank=1
        this.baseDataCityChoose=this.baseDataCity[this.timetype]['data']
      }
      this.pieChart()
      this.mbarChart()
      this.rbarChart()
      this.mbarChartInit()
      this.pieChartInit()
      this.rbarChartInit()
    },
    sortDesascend(){
      if(this.level==1){
        for(var i =0;i<6;i++){
          this.baseDataProvince[i]['data'] = this.baseDataProvince[i]['data'].sort((a,b)=>
            +a.data[1] > +b.data[1] ? 1 : +b.data[1] > +a.data[1] ? -1 :0
          );
        }
        this.rank=2
        this.baseDataProvinceChoose=this.baseDataProvince[this.timetype]['data']
      }else{
        for(var i =0;i<6;i++){
          this.baseDataCity[i]['data'] = this.baseDataCity[i]['data'].sort((a,b)=>
            +a.data[1] > +b.data[1] ? 1 : +b.data[1] > +a.data[1] ? -1 :0
          );
        }
        this.rank=2
        this.baseDataCityChoose=this.baseDataCity[this.timetype]['data']
      }
      this.pieChart()
      this.mbarChart()
      this.rbarChart()
      this.mbarChartInit()
      this.pieChartInit()
      this.rbarChartInit()
    },
    mbarChart(){
      this.cityArr=[]
      this.mbarChartData['city']=[]
      this.mbarChartData['AQI']=[]
      if(this.level ==1){
        if(this.city==''){
          var num=0
          for(var i in this.baseDataProvinceChoose){
            this.cityArr.push(this.baseDataProvinceChoose[i]["city"])
            this.mbarChartData['city'].unshift(this.baseDataProvinceChoose[i]["rank"])
            this.mbarChartData['AQI'].unshift(this.baseDataProvinceChoose[i]["data"][1])
            num++
            if(num>14){
              break
            }
          }
        }else{
          let p=0
          for(var i=0;i< this.baseDataProvinceChoose.length;i++){
            if(this.city==this.baseDataProvinceChoose[i]["city"]){
              p=parseInt(i/15);
              break;
            }
          }
          let start=p*15;
          let end=(p+1)*15;
          if(end>this.baseDataProvinceChoose.length){
            end=this.baseDataProvinceChoose.length
          }
          for(var i=start;i<end;i++){
              this.cityArr.push(this.baseDataProvinceChoose[i]["city"])
              this.mbarChartData['city'].unshift(this.baseDataProvinceChoose[i]["rank"])
              this.mbarChartData['AQI'].unshift(this.baseDataProvinceChoose[i]["data"][1])
          }
        }
      }else{
        if(this.city==''){
          var num=0
          for(var i in this.baseDataCityChoose){
            this.cityArr.push(this.baseDataCityChoose[i]["city"])
            this.mbarChartData['city'].unshift(this.baseDataCityChoose[i]["rank"])
            this.mbarChartData['AQI'].unshift(this.baseDataCityChoose[i]["data"][1])
            num++
            if(num>14){
              break
            }
          }
        }else{
          let p=0
          for(var i=0;i< this.baseDataCityChoose.length;i++){
            if(this.city==this.baseDataCityChoose[i]["city"]){
              p=parseInt(i/15);
              break;
            }
          }
          let start=p*15;
          let end=(p+1)*15;
          if(end>this.baseDataCityChoose.length){
            end=this.baseDataCityChoose.length
          }
          for(var i=start;i<end;i++){
              this.cityArr.push(this.baseDataCityChoose[i]["city"])
              this.mbarChartData['city'].unshift(this.baseDataCityChoose[i]["rank"])
              this.mbarChartData['AQI'].unshift(this.baseDataCityChoose[i]["data"][1])
          }
        }
      }
    },
    rbarChart(){
      this.rbarChartData=[]
      if(this.level==1){
        for(var k in this.cityArr){
          for(var i in this.baseDataProvince){
            for(var j in this.baseDataProvince[i]['data']){
              if(this.cityArr[k]==this.baseDataProvince[i]['data'][j]['city']){
                let dic={}
                dic['city']=this.baseDataProvince[i]['data'][j]['city']
                dic['达标天数']=this.baseDataProvince[i]['data'][j]['data'][2]
                dic['year']=this.baseDataProvince[i]['year'].toString()
                this.rbarChartData.push(dic)
              }
            }
          }
        }
      }else{
        for(var k in this.cityArr){
          for(var i in this.baseDataCity){
            for(var j in this.baseDataCity[i]['data']){
              if(this.cityArr[k]==this.baseDataCity[i]['data'][j]['city']){
                let dic={}
                dic['city']=this.baseDataCity[i]['data'][j]['city']
                dic['达标天数']=this.baseDataCity[i]['data'][j]['data'][2]
                dic['year']=this.baseDataCity[i]['year'].toString()
                this.rbarChartData.push(dic)
              }
            }
          }
        }
      }
    },
    pieChart(){
      var list=[]
      if(this.level==1){
        if(this.city==""){
          var num=0
          for(var i in this.baseDataProvinceChoose){
            num++
            for(var j in this.baseDataProvinceChoose[i]['data'][0]){
              let dic={}
              dic['city']=this.baseDataProvinceChoose[i]['city']
              dic['type']='AQI_' + (j).toString()
              dic['value']=this.baseDataProvinceChoose[i]['data'][0][j]
              list.push(dic)
            }
            if(num>14){
              break
            }
          }
        }else{
          let p=0
          for(var i=0;i< this.baseDataProvinceChoose.length;i++){
            if(this.city==this.baseDataProvinceChoose[i]["city"]){
              p=parseInt(i/15);
              break;
            }
          }
          let start=p*15;
          let end=(p+1)*15;
          if(end>this.baseDataProvinceChoose.length){
            end=this.baseDataProvinceChoose.length
          }
          for(var i=start;i<end;i++){
            for(var j in this.baseDataProvinceChoose[i]['data'][0]){
              let dic={}
              dic['city']=this.baseDataProvinceChoose[i]['city']
              dic['type']='AQI_' + (j).toString()
              dic['value']=this.baseDataProvinceChoose[i]['data'][0][j]
              list.push(dic)
            }
          }
        }
      }else{
        if(this.city==""){
          var num=0
          for(var i in this.baseDataCityChoose){
            num++
            for(var j in this.baseDataCityChoose[i]['data'][0]){
              let dic={}
              dic['city']=this.baseDataCityChoose[i]['city']
              dic['type']='AQI_' + (j).toString()
              dic['value']=this.baseDataCityChoose[i]['data'][0][j]
              list.push(dic)
            }
            if(num>14){
              break
            }
          }
        }else{
          let p=0
          for(var i=0;i< this.baseDataCityChoose.length;i++){
            if(this.city==this.baseDataCityChoose[i]["city"]){
              p=parseInt(i/15);
              break;
            }
          }
          let start=p*15;
          let end=(p+1)*15;
          if(end>this.baseDataCityChoose.length){
            end=this.baseDataCityChoose.length
          }
          for(var i=start;i<end;i++){
            for(var j in this.baseDataCityChoose[i]['data'][0]){
              let dic={}
              dic['city']=this.baseDataCityChoose[i]['city']
              dic['type']='AQI_' + (j).toString()
              dic['value']=this.baseDataCityChoose[i]['data'][0][j]
              list.push(dic)
            }
          }
        }
      }
      this.pieChartData = list
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#continer{
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}
#search{
  display: flex;
  width: 90%;
  margin-top: 2%;
  margin-left: 5%;
}
#bar {
  border: 1px;
  width: 100%;
  height: 90%;
  margin-top: 2%;
}
#title{
  display: flex;
  width: 98%;
  height: 30px;
  border: 2px solid #00000002;
  box-shadow: 2px 2px 2px #00000020;
  border-radius:8px;
  margin-top: 1%;
}
#piechart {
  height: 80%;
  width: 10%;
  left: 14%;
  position: absolute;
  overflow: hidden;
}
#mbarchart {
  position: absolute;
  height: 92%;
  width: 70%;
}
#rbarchart {
  position: absolute;
  height: 86%;
  width: 28%;
  left: 70%;
}
.label{
  position: absolute;
  border-radius:8px;
  text-align:center;
  line-height:30px;
  font-size:15px;
  font-family: Arial, Helvetica, sans-serif;
  box-shadow: 2px 2px 2px #00000020;
  font-weight: bold;
  color: white;
}
</style>