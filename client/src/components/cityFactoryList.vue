<template>
    <div id="cityList">
        <el-table
        class="my_table"
         :data="baseDataChoose"
         height="90%"
         script
         style="width:100%"
         border
         :show-header='false'
         :cell-style="{border:'0px solid #F00'}"
         :row-style="{background:'rgb(6,34,55)',color:'#5470C6',fontSize: '16px'}"
         :header-cell-style="{background:'rgb(6,34,55)',color:'white',fontSize: '18px',textAlign: 'center',border:'0px solid #F00'}">
         <el-table-column
         prop="city"
         label="企业/公司/工厂"
         ></el-table-column>
         </el-table>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    name:"cityFactoryList",
    data(){
        return{
            baseDataChoose:null,
            city:"石家庄市",
            type:"加油站",
            levelSecond:1
        }
    },
    computed:{
        getType(){
            return this.$store.state.type
        },
        getCityPoint(){
            return this.$store.state.cityPoint
        },
        getLevelSecond(){
            return this.$store.state.levelSecond
        },
        getcityPointOnce(){
            return this.$store.state.cityPointOnce
        }
    },
    watch:{
        getType:function(newVal,oldVal){
            this.type = newVal
            this.getData()
        },
        getCityPoint:function(newVal,oldVal){
            this.city = newVal
            this.getData()
        },
        getLevelSecond:function(newVal,oldVal){
            if(newVal==2){
                this.levelSecond = newVal
                this.city = this.$store.state.cityPointOnce
                this.getData()
            }
        },
        getcityPointOnce:function(newVal,oldVal){
            if(this.levelSecond ==2){
                this.city = newVal
                this.getData()
            }
        }
    },
    mounted(){
        this.getData()
    },
    methods:{
        getData(){
            axios.get("http://localhost:3000/cityFactory?city="+this.city+"&type="+this.type).then(
                response =>{
                    this.baseDataChoose=response.data
                }
            )
        }
    }
}
</script>

<style scoped>
#cityList{
    height: 95%;
    width: 90%;
    margin-left: 5%;
    margin-top: 3%;
    margin-bottom: 5%;
}
#cityList ::-webkit-scrollbar {
  width: 16px;
  height: 10px;
  background-color: rgb(6,34,55);
}
#cityList ::-webkit-scrollbar-thumb {
  background-color:rgb(4,65,97);
  border-radius: 3px;
}
.el-table, .el-table__expanded-cell {
    background-color: rgb(6,34,55);
}

</style>