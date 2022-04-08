<template>
  <div id = "mapChart">
    <div id ="continer">
        <div id="basis">
          <div id="citydetail">
            <img src="../assets/local.png" id="pic1">
            <div id="city">{{city}}</div>
          </div>
        </div>
        <div id="AQI">
            <div id="typevalue">{{AQI}}</div>
            <div id="typeState">{{AQIState}}</div>
            <div id="type">AQI</div>
          </div>
        <div id="detail">
          <div id="PM25">
            <div id="PM25Name">PM2.5</div>
            <div id="value">{{PM25}}</div>
          </div>
          <div id="PM10">
            <div id="PM10Name">PM10</div>
            <div id="value">{{PM10}}</div>
          </div>
          <div id="SO2">
            <div id="SO2Name">SO2</div>
            <div id="value">{{SO2}}</div>
          </div>
          <div id="NO2">
            <div id="NO2Name">NO2</div>
            <div id="value">{{NO2}}</div>
          </div>
          <div id="CO">
            <div id="COName">CO</div>
            <div id="value">{{CO}}</div>
          </div>
          <div id="O3">
            <div id="O3Name">O3</div>
            <div id="value">{{O3}}</div>
          </div>
        </div>
    </div>
    <div id ="select">
      <el-radio-group v-model="type">
        <table>
          <tr><td><el-radio label="AQI">AQI</el-radio></td></tr>
          <tr><td><el-radio label="PM25">PM2.5</el-radio></td></tr>
          <tr><td><el-radio label="PM10">PM10</el-radio></td></tr>
          <tr><td><el-radio label="SO2">SO2</el-radio></td></tr>
          <tr><td><el-radio label="NO2">NO2</el-radio></td></tr>
          <tr><td><el-radio label="CO">CO</el-radio></td></tr>
          <tr><td><el-radio label="O3">O3</el-radio></td></tr>
        </table>
      </el-radio-group>
    </div>
    <div id ="legend">
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
export default {
  name: 'mapChart',
  data () {
    return {
      city:"北京市",
      loading: true,
      type: 'AQI',
      AQIState: '良好',
      time: 2013,
      level:1,
      PM25: 74.27,
      PM10: 92.39,
      SO2: 33.9,
      NO2: 58.38,
      CO: 2.37,
      O3: 26.97,
      AQI: 94.72
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
      return this.$store.state.year;
    },
    getType(){
      return this.type
    },
    getMapZoom(){
      return this.map.getZoom()
    },
    getItmeValue(){
      return this.AQI
    }
  },
  watch:{
    getTime:function(newVal,oldVal){
      this.time = newVal
      this.updateMapLoadGeojson(this)
    },
    getType:function(newVal,oldVal){
      if(newVal !=oldVal){
        if(this.level==1){
          this.type = newVal
          var oldLayerId = "province_"+oldVal
          var newLayerID = "province_"+newVal
          this.map.setPaintProperty(newLayerID,"fill-opacity",1)
          this.map.setPaintProperty(oldLayerId,"fill-opacity",0)
        }else{
          this.type = newVal
          var oldLayerId = "city_"+oldVal
          var newLayerID = "city_"+newVal
          this.map.setPaintProperty(newLayerID,"fill-opacity",1)
          this.map.setPaintProperty(oldLayerId,"fill-opacity",0)
        }
      }
    },
    getTimeType:function(newVal,oldVal){
      if(newVal!=oldVal){
        this.timetype = newVal
      }
    },
    getItmeValue:function(newVal,oldVal){
      var AQI_item = document.getElementById('typeState')
      var PM25_item = document.getElementById('PM25Name')
      var PM10_item = document.getElementById('PM10Name')
      var SO2_item = document.getElementById('SO2Name')
      var NO2_item = document.getElementById('NO2Name')
      var CO_item = document.getElementById('COName')
      var O3_item = document.getElementById('O3Name')
      if(newVal!=oldVal){
        if(this.AQI <= 50){
          AQI_item.style.backgroundColor ='rgb(0,228,0)'
          this.AQIState = '优'
        }else if(this.AQI>50&&this.AQI<=100){
          AQI_item.style.backgroundColor ='rgb(255,255,0)'
          this.AQIState = '良好'
        }else if(this.AQI>100&&this.AQI<=150){
          AQI_item.style.backgroundColor ='rgb(255,126,0)'
          this.AQIState = '轻度'
        }else if(this.AQI>150&&this.AQI<=200){
          AQI_item.style.backgroundColor ='rgb(255,0,0)'
          this.AQIState = '中度'
        }else if(this.AQI>200&&this.AQI<=300){
          AQI_item.style.backgroundColor ='rgb(153,0,76)'
          this.AQIState = '重度'
        }else{
          AQI_item.style.backgroundColor ='rgb(126,0,35)'
          this.AQIState = '严重'
        }
        if(this.PM25 <= 35){
          PM25_item.style.backgroundColor ='rgb(0,228,0)'
        }else if(this.PM25>35&&this.PM25<=75){
          PM25_item.style.backgroundColor ='rgb(255,255,0)'
        }else if(this.PM25>75&&this.PM25<=115){
          PM25_item.style.backgroundColor ='rgb(255,126,0)'
        }else if(this.PM25>115&&this.AQI<=150){
          PM25_item.style.backgroundColor ='rgb(255,0,0)'
        }else if(this.PM25>150&&this.PM25<=250){
          PM25_item.style.backgroundColor ='rgb(153,0,76)'
        }else{
          PM25_item.style.backgroundColor ='rgb(126,0,35)'
        }
        if(this.PM10 <= 50){
          PM10_item.style.backgroundColor ='rgb(0,228,0)'
        }else if(this.PM10>50&&this.PM10<=150){
          PM10_item.style.backgroundColor ='rgb(255,255,0)'
        }else if(this.PM10>150&&this.PM10<=250){
          PM10_item.style.backgroundColor ='rgb(255,126,0)'
        }else if(this.PM10>250&&this.PM10<=350){
          PM10_item.style.backgroundColor ='rgb(255,0,0)'
        }else if(this.PM10>350&&this.PM10<=420){
          PM10_item.style.backgroundColor ='rgb(153,0,76)'
        }else{
          PM10_item.style.backgroundColor ='rgb(126,0,35)'
        }
        if(this.SO2 <= 50){
          SO2_item.style.backgroundColor ='rgb(0,228,0)'
        }else if(this.SO2>50&&this.SO2<=150){
          SO2_item.style.backgroundColor ='rgb(255,255,0)'
        }else if(this.SO2>150&&this.SO2<=475){
          SO2_item.style.backgroundColor ='rgb(255,126,0)'
        }else if(this.SO2>475&&this.SO2<=800){
          SO2_item.style.backgroundColor ='rgb(255,0,0)'
        }else if(this.SO2>800&&this.SO2<=1600){
          SO2_item.style.backgroundColor ='rgb(153,0,76)'
        }else{
          SO2_item.style.backgroundColor ='rgb(126,0,35)'
        }
        if(this.NO2 <= 40){
          NO2_item.style.backgroundColor ='rgb(0,228,0)'
        }else if(this.NO2>40&&this.NO2<=80){
          NO2_item.style.backgroundColor ='rgb(255,255,0)'
        }else if(this.NO2>80&&this.NO2<=180){
          NO2_item.style.backgroundColor ='rgb(255,126,0)'
        }else if(this.NO2>180&&this.NO2<=280){
          NO2_item.style.backgroundColor ='rgb(255,0,0)'
        }else if(this.NO2>280&&this.NO2<=565){
          NO2_item.style.backgroundColor ='rgb(153,0,76)'
        }else{
          NO2_item.style.backgroundColor ='rgb(126,0,35)'
        }
        if(this.CO <= 2){
          CO_item.style.backgroundColor ='rgb(0,228,0)'
        }else if(this.CO>2&&this.CO<=4){
          CO_item.style.backgroundColor ='rgb(255,255,0)'
        }else if(this.CO>4&&this.CO<=14){
          CO_item.style.backgroundColor ='rgb(255,126,0)'
        }else if(this.CO>14&&this.CO<=24){
          CO_item.style.backgroundColor ='rgb(255,0,0)'
        }else if(this.CO>24&&this.CO<=36){
          CO_item.style.backgroundColor ='rgb(153,0,76)'
        }else{
          CO_item.style.backgroundColor ='rgb(126,0,35)'
        }
        if(this.O3 <= 160){
          O3_item.style.backgroundColor ='rgb(0,228,0)'
        }else if(this.O3>160&&this.O3<=200){
          O3_item.style.backgroundColor ='rgb(255,255,0)'
        }else if(this.O3>200&&this.O3<=300){
          O3_item.style.backgroundColor ='rgb(255,126,0)'
        }else if(this.O3>300&&this.O3<=400){
          O3_item.style.backgroundColor ='rgb(255,0,0)'
        }else if(this.O3>400&&this.O3<=800){
          O3_item.style.backgroundColor ='rgb(153,0,76)'
        }else{
          O3_item.style.backgroundColor ='rgb(126,0,35)'
        }
      }
    }
  },
  methods: {
    mapAddProvienceJson(features){
      this.map.addSource("province_json",{
        type: "geojson",
        data:{
          type: "FeatureCollection",
          features: features.features
        }
      });
      this.map.addLayer({
        id: "province_AQI",
        type: "fill",
        source: "province_json",
        paint:{
          "fill-color": [
            'interpolate',
            ['linear'],
            ['get', 'AQI'],
            0,
            'rgb(0,228,0)',
            50,
            'rgb(255,255,0)',
            100,
            'rgb(255,126,0)',
            150,
            'rgb(255,0,0)',
            200,
            'rgb(153,0,76)',
            300,
            'rgb(126,0,35)',
          ],
          "fill-opacity":1,
          "fill-opacity-transition": {
            "duration": 0,
            "delay": 0
          }
        },
        minzoom: 0,
        maxzoom: 3.5
      }),
      this.map.addLayer({
        id: "province_SO2",
        type: "fill",
        source: "province_json",
        paint:{
          "fill-color": [
            'interpolate',
            ['linear'],
            ['get', 'SO2'],
            0,
            'rgb(0,228,0)',
            50,
            'rgb(255,255,0)',
            150,
            'rgb(255,126,0)',
            475,
            'rgb(255,0,0)',
            800,
            'rgb(153,0,76)',
            1600,
            'rgb(126,0,35)',
          ],
          "fill-opacity": 0,
          "fill-opacity-transition": {
            "duration": 0,
            "delay": 0
          }
        },
        minzoom: 0,
        maxzoom: 3.5
      }),
      this.map.addLayer({
        id: "province_PM25",
        type: "fill",
        source: "province_json",
        paint:{
          "fill-color": [
            'interpolate',
            ['linear'],
            ['get', 'PM25'],
            0,
            'rgb(0,228,0)',
            35,
            'rgb(255,255,0)',
            75,
            'rgb(255,126,0)',
            115,
            'rgb(255,0,0)',
            150,
            'rgb(153,0,76)',
            250,
            'rgb(126,0,35)',
          ],
          "fill-opacity": 0,
          "fill-opacity-transition": {
            "duration": 0,
            "delay": 0
          }
        },
        minzoom: 0,
        maxzoom: 3.5
      }),
      this.map.addLayer({
        id: "province_PM10",
        type: "fill",
        source: "province_json",
        paint:{
          "fill-color": [
            'interpolate',
            ['linear'],
            ['get', 'PM10'],
            0,
            'rgb(0,228,0)',
            50,
            'rgb(255,255,0)',
            150,
            'rgb(255,126,0)',
            250,
            'rgb(255,0,0)',
            350,
            'rgb(153,0,76)',
            420,
            'rgb(126,0,35)',
          ],
          "fill-opacity": 0,
          "fill-opacity-transition": {
            "duration": 0,
            "delay": 0
          }
        },
        minzoom: 0,
        maxzoom: 3.5
      }),
      this.map.addLayer({
        id: "province_CO",
        type: "fill",
        source: "province_json",
        paint:{
          "fill-color": [
            'interpolate',
            ['linear'],
            ['get', 'CO'],
            0,
            'rgb(0,228,0)',
            2,
            'rgb(255,255,0)',
            4,
            'rgb(255,126,0)',
            14,
            'rgb(255,0,0)',
            36,
            'rgb(153,0,76)',
            48,
            'rgb(126,0,35)',
          ],
          "fill-opacity": 0,
          "fill-opacity-transition": {
            "duration": 0,
            "delay": 0
          }
        },
        minzoom: 0,
        maxzoom: 3.5
      }),
      this.map.addLayer({
        id: "province_NO2",
        type: "fill",
        source: "province_json",
        paint:{
          "fill-color": [
            'interpolate',
            ['linear'],
            ['get', 'NO2'],
            0,
            'rgb(0,228,0)',
            40,
            'rgb(255,255,0)',
            80,
            'rgb(255,126,0)',
            180,
            'rgb(255,0,0)',
            280,
            'rgb(153,0,76)',
            565,
            'rgb(126,0,35)',
          ],
          "fill-opacity": 0,
          "fill-opacity-transition": {
            "duration": 0,
            "delay": 0
          }
        },
        minzoom: 0,
        maxzoom: 3.5
      }),
      this.map.addLayer({
        id: "province_O3",
        type: "fill",
        source: "province_json",
        paint:{
          "fill-color": [
            'interpolate',
            ['linear'],
            ['get', 'O3'],
            0,
            'rgb(0,228,0)',
            160,
            'rgb(255,255,0)',
            200,
            'rgb(255,126,0)',
            300,
            'rgb(255,0,0)',
            400,
            'rgb(153,0,76)',
            800,
            'rgb(126,0,35)',
          ],
          "fill-opacity": 0,
          "fill-opacity-transition": {
            "duration": 0,
            "delay": 0
          }
        },
        minzoom: 0,
        maxzoom: 3.5
      }),
      this.map.addLayer({
        id: "province_boundry",
        type: "line",
        source: "province_json",
        paint: {
          "line-width": 0.5,
          "line-color": "gray"
        },
        minzoom: 0,
        maxzoom: 3.5
      });
      this.map.addLayer({
        id: "province_name",
        type: "symbol",
        source: "province_json",
        layout:{
          "text-field": "{name}",
          "text-size": 8
        },
        minzoom: 0,
        maxzoom: 3.5
      }),
      this.map.addLayer({
        id: "province_boundry_select",
        type: "line",
        source: "province_json",
        paint: {
          "line-width": 2,
          "line-color": "DeepSkyBlue"
        },
        filter: ["==","name",""],
      });
      this.map.on("click","province_AQI",e=>{
        this.map.setFilter(
          "province_boundry_select",
          ["in","name"].concat(e.features.map(feature => feature.properties.name))
        )
      })
    },
    mapAddCountryJson(features){
      this.map.addSource("city_json",{
        type: "geojson",
        data:{
          type: "FeatureCollection",
          features: features.features
        }
      });
      this.map.addLayer({
        id: "city_AQI",
        type: "fill",
        source: "city_json",
        paint:{
          "fill-color": [
            'interpolate',
            ['linear'],
            ['get', 'AQI'],
            0,
            'rgb(0,228,0)',
            50,
            'rgb(255,255,0)',
            100,
            'rgb(255,126,0)',
            150,
            'rgb(255,0,0)',
            200,
            'rgb(153,0,76)',
            300,
            'rgb(126,0,35)',
          ],
          "fill-opacity": 1,
          "fill-opacity-transition": {
            "duration": 0,
            "delay": 0
          }
        },
        minzoom: 3.5,
        maxzoom: 10
      }),
      this.map.addLayer({
        id: "city_SO2",
        type: "fill",
        source: "city_json",
        paint:{
          "fill-color": [
            'interpolate',
            ['linear'],
            ['get', 'SO2'],
            0,
            'rgb(0,228,0)',
            50,
            'rgb(255,255,0)',
            150,
            'rgb(255,126,0)',
            475,
            'rgb(255,0,0)',
            800,
            'rgb(153,0,76)',
            1600,
            'rgb(126,0,35)',
          ],
          "fill-opacity": 0,
          "fill-opacity-transition": {
            "duration": 0,
            "delay": 0
          }
        },
        minzoom: 3.5,
        maxzoom: 10
      }),
      this.map.addLayer({
        id: "city_PM25",
        type: "fill",
        source: "city_json",
        paint:{
          "fill-color": [
            'interpolate',
            ['linear'],
            ['get', 'PM25'],
            0,
            'rgb(0,228,0)',
            35,
            'rgb(255,255,0)',
            75,
            'rgb(255,126,0)',
            115,
            'rgb(255,0,0)',
            150,
            'rgb(153,0,76)',
            250,
            'rgb(126,0,35)',
          ],
          "fill-opacity": 0,
          "fill-opacity-transition": {
            "duration": 0,
            "delay": 0
          }
        },
        minzoom: 3.5,
        maxzoom: 10
      }),
      this.map.addLayer({
        id: "city_PM10",
        type: "fill",
        source: "city_json",
        paint:{
          "fill-color": [
            'interpolate',
            ['linear'],
            ['get', 'PM10'],
            0,
            'rgb(0,228,0)',
            50,
            'rgb(255,255,0)',
            150,
            'rgb(255,126,0)',
            250,
            'rgb(255,0,0)',
            350,
            'rgb(153,0,76)',
            420,
            'rgb(126,0,35)',
          ],
          "fill-opacity": 0,
          "fill-opacity-transition": {
            "duration": 0,
            "delay": 0
          }
        },
        minzoom: 3.5,
        maxzoom: 10
      }),
      this.map.addLayer({
        id: "city_CO",
        type: "fill",
        source: "city_json",
        paint:{
          "fill-color": [
            'interpolate',
            ['linear'],
            ['get', 'CO'],
            0,
            'rgb(0,228,0)',
            2,
            'rgb(255,255,0)',
            4,
            'rgb(255,126,0)',
            14,
            'rgb(255,0,0)',
            36,
            'rgb(153,0,76)',
            48,
            'rgb(126,0,35)',
          ],
          "fill-opacity": 0,
          "fill-opacity-transition": {
            "duration": 0,
            "delay": 0
          }
        },
        minzoom: 3.5,
        maxzoom: 10
      }),
      this.map.addLayer({
        id: "city_NO2",
        type: "fill",
        source: "city_json",
        paint:{
          "fill-color": [
            'interpolate',
            ['linear'],
            ['get', 'NO2'],
            0,
            'rgb(0,228,0)',
            40,
            'rgb(255,255,0)',
            80,
            'rgb(255,126,0)',
            180,
            'rgb(255,0,0)',
            280,
            'rgb(153,0,76)',
            565,
            'rgb(126,0,35)',
          ],
          "fill-opacity": 0,
          "fill-opacity-transition": {
            "duration": 0,
            "delay": 0
          }
        },
        minzoom: 3.5,
        maxzoom: 10
      }),
      this.map.addLayer({
        id: "city_O3",
        type: "fill",
        source: "city_json",
        paint:{
          "fill-color": [
            'interpolate',
            ['linear'],
            ['get', 'O3'],
            0,
            'rgb(0,228,0)',
            160,
            'rgb(255,255,0)',
            200,
            'rgb(255,126,0)',
            300,
            'rgb(255,0,0)',
            400,
            'rgb(153,0,76)',
            800,
            'rgb(126,0,35)',
          ],
          "fill-opacity": 0,
          "fill-opacity-transition": {
            "duration": 0,
            "delay": 0
          }
        },
        minzoom: 3.5,
        maxzoom: 10
      }),
      this.map.addLayer({
        id: "city_boundry",
        type: "line",
        source: "city_json",
        paint: {
          "line-width": 0.5,
          "line-color": "white"
        },
        minzoom: 3.5,
        maxzoom: 10
      })
      this.map.addLayer({
        id: "countryname",
        type: "symbol",
        source: "city_json",
        layout: {
          "text-field": "{name}",
          "text-size": 12
        },
        paint:{
          "text-color":"black"
        },
        minzoom: 3.5,
        maxzoom: 10
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
        axios.get('http://localhost:3000/provinceFirst?time='+that.time).then(
          (response) =>{
            that.data = response.data;
            that.mapAddProvienceJson(that.data);
          })
          .catch((error) =>{
            that.loading = false;
          });
        axios.get('http://localhost:3000/cityFirst?time='+that.time).then(
          response =>{
            that.data = response.data;
            that.mapAddCountryJson(that.data);
          },
          error =>{
            that.loading = false;
          }
        );
      })
    },
    updateMapLoadGeojson(that){
      axios.get('http://localhost:3000/provinceFirst?time='+that.time).then(
        response =>{
          that.data = response.data;
          this.map.getSource('province_json').setData(that.data)
        }
      )
      axios.get('http://localhost:3000/cityFirst?time='+that.time).then(
        response =>{
          that.data = response.data;
          this.map.getSource('city_json').setData(that.data)
        }
      )
    },
    mapInterctionSetting(that){
      that.map.on("mouseenter","province_AQI",function(){
        that.map.getCanvas().style.cursor = 'pointer'
      });
      that.map.on('mouseleave', 'province_AQI', function () {
        that.map.getCanvas().style.cursor = '';
      });
      that.map.on("mouseenter","city_AQI",function(){
        that.map.getCanvas().style.cursor = 'pointer'
      });
      that.map.on('mouseleave', 'city_AQI', function () {
        that.map.getCanvas().style.cursor = '';
      });
      that.map.on("click",'province_AQI',function(e){
        that.city = e.features[0].properties.name
        that.AQI = e.features[0].properties.AQI
        that.PM25 = e.features[0].properties.PM25
        that.SO2 = e.features[0].properties.SO2
        that.NO2 = e.features[0].properties.NO2
        that.CO = e.features[0].properties.CO
        that.O3 = e.features[0].properties.O3
        that.PM10 = e.features[0].properties.PM10
        that.$store.state.city = e.features[0].properties.name
      })
      that.map.on("click",'city_AQI',function(e){
        that.$store.state.city = e.features[0].properties.name
        that.city = e.features[0].properties.name
        that.AQI = e.features[0].properties.AQI
        that.PM25 = e.features[0].properties.PM25
        that.SO2 = e.features[0].properties.SO2
        that.NO2 = e.features[0].properties.NO2
        that.CO = e.features[0].properties.CO
        that.O3 = e.features[0].properties.O3
        that.PM10 = e.features[0].properties.PM10
        that.$store.state.location = e.features[0].properties.name
      })
      that.map.on("dblclick",'province_AQI',function(e){
        that.map.setZoom(4)
        that.map.flyTo({
          center:e.features[0].properties.center.slice(1,-2).split(",").map((i)=>{return parseFloat(i)})
        })
      })
      that.map.on('zoom',function(){
        if(that.map.getZoom()>=3.5){
          that.level = 2
          that.map.setPaintProperty("city_"+that.type,"fill-opacity",1)
          that.map.setPaintProperty("province_"+that.type,"fill-opacity",0)
          that.$store.state.level = 2
        }else{
          that.level = 1
          that.map.setPaintProperty("province_"+that.type,"fill-opacity",1)
          that.map.setPaintProperty("city_"+that.type,"fill-opacity",0)
          that.$store.state.level = 1
        }
      })
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#mapChart{
  height: 97%;
  width: 98%;
  border-radius: 10px;
  margin:1% 1% 1% 1%;
}
#continer{
  position: absolute;
  display: flex;
  width: 230px;
  height: 239px;
  left: 0.5%;
  top: 1%;
  background-color: rgba(16, 42, 82, 0.5);
  border-radius: 10px;
  margin-top:10px;
}
#pic1{
  position: absolute;
  top: 10%;
  height: 40px;
  width: 45px;
}
#basis{
  display: flex;
  position: absolute;
  width: 100%;
  height: 37px;
}
#mappic{
  position: absolute;
  top: 60%;
  left: 85%;
  height: 25%;
  width: 13%;
  border:1px solid #a9c9e2;
}
#city{
  position: absolute;
  font-family: "Microsoft YaHei";
  left: 18%;
  top: 20%;
  font-size: 25px;
  font-weight:500;
  color: white;
}
#AQI{
  position: absolute;
  display: flex;
  width: 100%;
  height: 25%;
  top: 10%;
}
#typevalue{
  font-family: "Microsoft YaHei";
  font-size: 34px;
  font-weight:800;
  color: white;
  position: absolute;
  left: 49%;
  top: 57%;
}
#typeState{
  position: absolute;
  color: rgb(58, 60, 179);
  font-weight: 800;
  width: 25%;
  height: 40%;
  left: 3%;
  top: 80%;
  font-size: 18px;
  border-radius:5px;
  text-align: center;
  line-height: 150%;
  background-color: rgb(255,255,0);
}
#type{
  font-size: 20px;
  font-weight:500;
  color: white;
  position: absolute;
  top: 80%;
  left: 30%;
}
#detail{
  display: flex;
  position: absolute;
  top: 45%;
  width: 100%;
  height: 50%;
}
#PM25,#PM10,#SO2{
  position: absolute;
  top: 5%;
  width: 25%;
  height: 45%;
  background-color: rgba(	128,128,128,0.3);
  border-radius: 10px;
}
#NO2,#CO,#O3{
  position: absolute;
  top: 58%;
  width: 25%;
  height: 45%;
  background-color: rgba(	128,128,128,0.3);
  border-radius: 10px;
}
#PM25{
  left: 3%;
}
#PM10{
  left: 34%;
}
#SO2{
  left: 65%;
}
#NO2{
  left: 3%;
}
#CO{
  left: 34%;
}
#O3{
  left: 65%;
}
#PM25Name,#PM10Name,#SO2Name,#NO2Name,#COName,#O3Name{
  height: 30%;
  width: 100%;
  text-align: center;
  color:rgb(58, 60, 179);
  font-weight: 700;
  border-radius: 10px 10px 0 0;
}
#PM25Name,#PM10Name{
  background-color: rgb(255,255,0);
}
#SO2Name,#NO2Name,#COName,#O3Name{
  background-color: rgb(0,228,0);
}
#value{
  position: absolute;
  width: 100%;
  height: 70%;
  color: white;
  text-align: center;
  font-weight: 800;
  border-radius: 10px;
  line-height: 300%;
}
#select{
  position: absolute;
  width: 10%;
  height: 40%;
  left: 89%;
  top: 1%;
  border:1px solid #a9c9e2;
  background:rgba(	128,128,128,0.3);
  border-radius: 10px;
  margin-top:20px;
}
table{
  position: absolute;
  width: 100%;
  height: 90%;
  left: 5%;
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
