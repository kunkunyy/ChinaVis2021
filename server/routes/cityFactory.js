var express = require('express');
var router = express.Router();
const fs = require('fs');
var URL = require('url')
let cityFactoryData = null
    /* GET users listing. */
router.get('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    //允许的header类型
    res.header("Access-Control-Allow-Headers", "content-type");
    //跨域允许的请求方式
    res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
    let params = URL.parse(req.url, true).query;
    let city = params.city;
    let type = params.type;
    console.log(city,type)
    if (cityFactoryData != null) {
        for(var i in cityFactoryData){
            if(i==city){
                for(var j in cityFactoryData[i]){
                    if(j==type){
                        let lis=[]
                        for(var k in cityFactoryData[i][j]){
                            let dic={}
                            dic['city']=cityFactoryData[i][j][k]
                            lis.push(dic)
                        }
                        res.send(lis);
                    }
                }
            }
        }
    }else{
        fs.readFile('./source/factory_name.json', 'utf-8', function read(err, data) {
            cityFactoryData = JSON.parse(data);
            for(var i in cityFactoryData){
                if(i==city){
                    for(var j in cityFactoryData[i]){
                        if(j==type){
                            let lis=[]
                            for(var k in cityFactoryData[i][j]){
                                let dic={}
                                dic['city']=cityFactoryData[i][j][k]
                                lis.push(dic)
                            }
                            res.send(lis);
                        }
                    }
                }
            }
        });
    }
})
module.exports = router;