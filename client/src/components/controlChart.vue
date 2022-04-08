<template>
  <div id="controlChart">
    <div id="controldiv">
      <div><span class="font">from</span><input id="frominput" /></div>
      <div><span class="font">to</span><input id="toinput" /></div>
    </div>
        <div id='timecontrol'>
      <label for="time">时间分度:</label>
            <select id="time" >
                <option v-for="(item) in timelist">{{item}}</option>
            </select>
    </div>
  </div>

</template>

<script>
export default {
  name: "controlChart",
  data() {
    return {
      timelist:['年','月','日'],
    };
  },
  mounted(){
    this.listenTime();
  },methods:{
    listenTime(){
      let time = document.getElementById('time');
      time.addEventListener('change',e=>{
        let target = e.target;
        this.$store.state.timeselect =target.selectedIndex;
      })
    }
  },
  computed:{
    getfromtime(){
      return this.$store.state.fromtime;
    },
    gettotime(){
      return this.$store.state.totime;
    },
    gettimeselect(){
      return this.$store.state.timeselect;
    }
  },watch:{
    getfromtime:function(newval,oldval){
      let frominput = document.getElementById('frominput')
      if(oldval!=newval){
        frominput.value = newval;
      }
    },
    gettotime:function(newval,oldval){
      let toinput = document.getElementById('toinput')
      if(oldval!=newval){
          toinput.value = newval;
        }
    },
    gettimeselect:function(newval,oldval){
      if(oldval!=newval){
          console.log(newval)
        }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#controlChart {
  border: 1px solid red;
  height: 10%;
}
#controldiv {
  width: 220px;
}
#controldiv,#timecontrol{
  float:left
}
#timecontrol{
  margin:2px
}
#controldiv::after,#timecontrol::after{
  clear:both
}
.font {
  text-align: center;
  display: inline-block;
  width:40px
}
#frominput,#toinput{
  width:150px
}
</style>
