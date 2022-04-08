<template>
    <div class="chartIntroduce" >
        <div class="inborder">
        <p class="title">图例说明</p>
        <p>I:Moran's I 	&gt;0表示空间正相关性，其值越大，空间相关性越明显，Moran's I &lt;0 表示空间负相关性，其值越小，空间差异越大，否则，Morans I = 0，空间呈随机性。</p>
        <p>I:Moran's I 	&gt;0表示空间正相关性，其值越大，空间相关性越明显，Moran's I &lt;0 表示空间负相关性，其值越小，空间差异越大，否则，Morans I = 0，空间呈随机性。</p>
        <img src="../assets/legend.png" alt="" width="60%">
        </div>

    </div>
</template>

<script>
export default {
  name: 'chartIntroduce',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<style scoped>
.title{
    text-align: center;
}
.chartIntroduce{
    height:100%;
    color:rgb(216, 216, 216);

    
}
img{
    display: block;
    margin: 0 auto;
}
.inborder {
    position:relative;
  background-color: rgb(6,34,55);
  border: 1px solid rgb(132, 182, 226);
  box-shadow: 0px 0px 10px rgb(85, 150, 241) inset;
  border-radius: 10px;
  z-index: 1;
  padding: 0 5px 0 5px;
     height:100%;
}
.inborder::before {
  position: absolute;
  top: 10px;
  bottom: 10px;
  left: -1px;
  right: -1px;
  content: "";
  display: block;
  border-left: 1px solid rgb(4, 65, 97);
  border-right: 1px solid rgb(4, 65, 97);
  z-index: -1;
}

.inborder::after {
  position: absolute;
  top: -1px;
  bottom: -1px;
  left: 10px;
  right: 10px;
  content: "";
  display: block;
  border-top: 1px solid rgb(4, 65, 97);
  border-bottom: 1px solid rgb(4, 65, 97);
  z-index: -1;
}
</style>