// <template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <div class = 'header'>

      <div class='titlenav'>
              <span class="heardertitle">大气污染可视化分析平台</span>
             
              <router-link to='/second' class='linknav' @click.native="changeF" id ='second'>污染源分析</router-link>
              <span class="font">|</span><router-link to='/first' class='linknav'  @click.native="changeT" id='first'>时空态势分析</router-link>


      </div>

    </div>
    <div class="content">
      <keep-alive><router-view></router-view></keep-alive>
      <!-- <div class="left">
        <controlChart/>
        <relationChart/>
        <airPolutionChart/>
      </div>
      <div class="mid">
        <mapChart/>
        <sanKeyChart/>
      </div>
      <div class="right">
        <recordChart/>
      </div> -->
    </div>
    <div class="footer"></div>

  </div>
</template>

<script>
export default {
  name: 'App',
  data(){
    return {
      bottomstyle:'2px solid rgb(111,248,228)',
      num:true
    }
  },
  components:{},
  mounted(){
          var first = document.getElementById('first');
        var second = document.getElementById('second')
        first.style.borderBottom = this.bottomstyle;
     
  },
  methods:{
    changeT(){
        var first = document.getElementById('first');
        var second = document.getElementById('second')
        first.style.borderBottom = this.bottomstyle;
        second.style.borderBottom = '';
    },
    changeF(){
        var first = document.getElementById('first');
        var second = document.getElementById('second')
        first.style.borderBottom = '';
        second.style.borderBottom = this.bottomstyle;
    }
  }
}
</script>
    

<style>
#app {
  margin:0;
  width: 100%;
  height: 100%;
  background-color: rgb(6,34,55);
}
.header{
  display: flex;
  justify-content:start;
  margin-right:54px;
  margin-left: 12px;
  background-color: rgb(6,34,55);
}

.content{
  position: flex;
  width: 100%;
  height: calc(100% - 40px);
  margin-left: 15px;
}
.footer{

}
.content::after{
  clear: both;
}
.titlenav{
  color:rgb(111,248,228);
  width:calc(55%);
}

.font{
  color:rgb(111,248,228);
  font-weight: 1000;
  float:right;
  vertical-align: bottom;
  margin:15px  10px 0 10px;
}
.linknav{
  color:rgb(111,248,228);
  text-decoration: none;
  font-size: 15px;
  font-weight: 1000;
  float:right;
  vertical-align: bottom;
  margin:15px  10px 0 10px;
}
.heardertitle{
  vertical-align: middle;
  color:rgb(111,248,228);
  text-decoration: none;
  font-size: 30px;
  font-weight: 1000;
}
.select{
  border-bottom: 2px solid rgb(111,248,228);
}
</style>
