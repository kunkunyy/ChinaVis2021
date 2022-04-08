var express = require('express');
var router = express.Router();
var URL = require('url')
const fs = require('fs');

/* GET users listing. */
router.get('/', function(req, res, next) {
    //设置允许跨域的域名，*代表允许任意域名跨域 http:127.0.0.1:8080
    res.header("Access-Control-Allow-Origin", "*");
    //允许的header类型
    res.header("Access-Control-Allow-Headers", "content-type");
    //跨域允许的请求方式
    res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");

    let params = URL.parse(req.url, true).query;
    let timetype = params.timetype
    let provice;
    let dataset
    let ttime = params.ttime
    if(timetype == 0){
        ttime = parseInt(ttime)
        fs.readFile('./source/provice_detail.json', 'utf8', function read(err, data1) {
            dataset = JSON.parse(data1);
            fs.readFile('./source/provice_data.json', 'utf8', function read(err, data2) {
                provice = JSON.parse(data2);
                for(var i=0;i<provice["features"].length;i++){
                    for(var j=0;j<dataset.length;j++){
                        if(provice["features"][i]["properties"]["name"]==dataset[j]['city']){
                            if(dataset[j]["month"]=="total"){
                                if(dataset[j]['year']==ttime){
                                    provice["features"][i]["properties"]["AQI"] = dataset[j]["AQI"]
                                    provice["features"][i]["properties"]["SO2"] = dataset[j]["SO2"]
                                    provice["features"][i]["properties"]["PM25"] = dataset[j]["PM2.5"]
                                    provice["features"][i]["properties"]["PM10"] = dataset[j]["PM10"]
                                    provice["features"][i]["properties"]["CO"] = dataset[j]["CO"]
                                    provice["features"][i]["properties"]["NO2"] = dataset[j]["NO2"]
                                    provice["features"][i]["properties"]["O3"] = dataset[j]["O3"]
                                }
                            }
                        }
                    }
                }
                res.send(provice)
            });
        });
    }else{
        let tdata = ttime.split("-")
        let tyear =parseInt(tdata[0]),tmonth = parseInt(tdata[1])
        fs.readFile('./source/provice_detail.json', 'utf8', function read(err, data1) {
            dataset = JSON.parse(data1);
            fs.readFile('./source/provice_data.json', 'utf8', function read(err, data2) {
                provice = JSON.parse(data2);
                for(var i=0;i<provice["features"].length;i++){
                    for(var k=0;k<dataset.length;k++){
                        if(provice["features"][i]["properties"]["name"]==dataset[k]['city']
                            && dataset[k]['year']==tyear && dataset[k]["month"]== tmonth){
                            provice["features"][i]["properties"]["AQI"] = dataset[k]["AQI"]
                            provice["features"][i]["properties"]["SO2"] = dataset[k]["SO2"]
                            provice["features"][i]["properties"]["PM25"] = dataset[k]["PM2.5"]
                            provice["features"][i]["properties"]["PM10"] = dataset[k]["PM10"]
                            provice["features"][i]["properties"]["CO"] = dataset[k]["CO"]
                            provice["features"][i]["properties"]["NO2"] = dataset[k]["NO2"]
                            provice["features"][i]["properties"]["O3"] = dataset[k]["O3"]
                        }
                    }
                }
                res.send(provice)
            })
        })

    }
})
module.exports = router;