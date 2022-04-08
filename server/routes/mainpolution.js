var express = require('express');
var router = express.Router();
var URL = require('url')
const fs = require('fs');
var mainpolutioncache = null;
/* GET users listing. */
router.get('/', function(req, res, next) {
    //设置允许跨域的域名，*代表允许任意域名跨域 http:127.0.0.1:8080
    res.header("Access-Control-Allow-Origin", "*");
    //允许的header类型
    res.header("Access-Control-Allow-Headers", "content-type");
    //跨域允许的请求方式
    res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");

    let params = URL.parse(req.url, true).query;
    // console.log(params)
    let year = params.year;
    let province = params.province;
    if (mainpolutioncache != null) {
        let cordata = mainpolutioncache[province][year][0]
        let polution = [
            { name: 'AQI' }, { name: "PM2.5" }, { name: "PM10" }, { name: "SO2" }, { name: "NO2" }, { name: "CO" }, { name: "O3" },
        ]
        let edges = []
        for (let i = 1, len = cordata.length; i < len; i++) {
            edges.push({
                source: 0,
                target: i,
                value: cordata[i]
            })
        }
        let resdata = {
            nodes: polution,
            edges: edges
        }
        console.log(resdata)
        res.send(resdata);
    } else {
        fs.readFile('./source/province_cor.json', 'utf-8', function read(err, data) {
            if (err) {
                throw err;
            }
            let ret = JSON.parse(data);
            mainpolutioncache = ret;
            let cordata = ret[province][year][0]
            let polution = [
                { name: 'AQI' }, { name: "PM2.5" }, { name: "PM10" }, { name: "SO2" }, { name: "NO2" }, { name: "CO" }, { name: "O3" },
            ]
            let edges = []
            for (let i = 1, len = cordata.length; i < len; i++) {
                edges.push({
                    source: 0,
                    target: i,
                    value: cordata[i]
                })
            }
            let resdata = {
                nodes: polution,
                edges: edges
            }
            res.send(resdata);
        });

    }


})
module.exports = router;