var express = require('express');
var router = express.Router();
var URL = require('url')
const fs = require('fs');
let city=null;
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
    if(dataset!=null&&city!=null){
        for(var i=0;i<city["features"].length;i++){
            for(var j=0;j<dataset.length;j++){
                if(city["features"][i]["properties"]["name"]==dataset[j]['city']){
                    if(dataset[j]["month"]=="total"){
                        if(dataset[j]['year']==ttime){
                            city["features"][i]["properties"]["AQI"] = dataset[j]["AQI"]
                            city["features"][i]["properties"]["SO2"] = dataset[j]["SO2"]
                            city["features"][i]["properties"]["PM25"] = dataset[j]["PM2.5"]
                            city["features"][i]["properties"]["PM10"] = dataset[j]["PM10"]
                            city["features"][i]["properties"]["CO"] = dataset[j]["CO"]
                            city["features"][i]["properties"]["NO2"] = dataset[j]["NO2"]
                            city["features"][i]["properties"]["O3"] = dataset[j]["O3"]
                        }
                    }
                }
            }
        }
        res.send(city)
    }else{
        ttime = parseInt(ttime)
        fs.readFile('./source/city_detail.json', 'utf8', function read(err, data1) {
            dataset = JSON.parse(data1);
            fs.readFile('./source/city_data.json', 'utf8', function read(err, data2) {
                city = JSON.parse(data2);
                for(var i=0;i<city["features"].length;i++){
                    for(var j=0;j<dataset.length;j++){
                        if(city["features"][i]["properties"]["name"]==dataset[j]['city']){
                            if(dataset[j]["month"]=="total"){
                                if(dataset[j]['year']==ttime){
                                    city["features"][i]["properties"]["AQI"] = dataset[j]["AQI"]
                                    city["features"][i]["properties"]["SO2"] = dataset[j]["SO2"]
                                    city["features"][i]["properties"]["PM25"] = dataset[j]["PM2.5"]
                                    city["features"][i]["properties"]["PM10"] = dataset[j]["PM10"]
                                    city["features"][i]["properties"]["CO"] = dataset[j]["CO"]
                                    city["features"][i]["properties"]["NO2"] = dataset[j]["NO2"]
                                    city["features"][i]["properties"]["O3"] = dataset[j]["O3"]
                                }
                            }
                        }
                    }
                }
                res.send(city)
            });
        });
    }
})
module.exports = router;