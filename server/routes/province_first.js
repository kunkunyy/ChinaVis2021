var express = require('express');
var router = express.Router();
var URL = require('url')
const fs = require('fs');
let province=null;
let dataset=null;

/* GET users listing. */
router.get('/', function(req, res, next) {
    //设置允许跨域的域名，*代表允许任意域名跨域 http:127.0.0.1:8080
    res.header("Access-Control-Allow-Origin", "*");
    //允许的header类型
    res.header("Access-Control-Allow-Headers", "content-type");
    //跨域允许的请求方式
    res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");

    let params = URL.parse(req.url, true).query;
    let ttime = params.time
    if(dataset!=null&&province!=null){
        for(var i=0;i<province["features"].length;i++){
            for(var j=0;j<dataset.length;j++){
                if(province["features"][i]["properties"]["name"]==dataset[j]['city']){
                    if(dataset[j]["month"]=="total"){
                        if(dataset[j]['year']==ttime){
                            province["features"][i]["properties"]["AQI"] = dataset[j]["AQI"]
                            province["features"][i]["properties"]["SO2"] = dataset[j]["SO2"]
                            province["features"][i]["properties"]["PM25"] = dataset[j]["PM2.5"]
                            province["features"][i]["properties"]["PM10"] = dataset[j]["PM10"]
                            province["features"][i]["properties"]["CO"] = dataset[j]["CO"]
                            province["features"][i]["properties"]["NO2"] = dataset[j]["NO2"]
                            province["features"][i]["properties"]["O3"] = dataset[j]["O3"]
                        }
                    }
                }
            }
        }
        res.send(province)
    }else{
        ttime = parseInt(ttime)
        fs.readFile('./source/province_detail.json', 'utf8', function read(err, data1) {
            dataset = JSON.parse(data1);
            fs.readFile('./source/province_data.json', 'utf8', function read(err, data2) {
                province = JSON.parse(data2);
                for(var i=0;i<province["features"].length;i++){
                    for(var j=0;j<dataset.length;j++){
                        if(province["features"][i]["properties"]["name"]==dataset[j]['city']){
                            if(dataset[j]["month"]=="total"){
                                if(dataset[j]['year']==ttime){
                                    province["features"][i]["properties"]["AQI"] = dataset[j]["AQI"]
                                    province["features"][i]["properties"]["SO2"] = dataset[j]["SO2"]
                                    province["features"][i]["properties"]["PM25"] = dataset[j]["PM2.5"]
                                    province["features"][i]["properties"]["PM10"] = dataset[j]["PM10"]
                                    province["features"][i]["properties"]["CO"] = dataset[j]["CO"]
                                    province["features"][i]["properties"]["NO2"] = dataset[j]["NO2"]
                                    province["features"][i]["properties"]["O3"] = dataset[j]["O3"]
                                }
                            }
                        }
                    }
                }
                res.send(province)
            });
        });
    }
})
module.exports = router;