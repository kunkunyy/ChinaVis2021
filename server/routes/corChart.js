var express = require('express');
var router = express.Router();
var URL = require('url')
const fs = require('fs');
let cor_data = null;

/*['AQI', 'PM2.5', 'PM10', "SO2", "NO2", "CO", "O3", 'U', 'V', 'TEMP', 'RH', 'PSFC','SUMV'] */
router.get('/', function(req, res, next) {
    //设置允许跨域的域名，*代表允许任意域名跨域 http:127.0.0.1:8080
    res.header("Access-Control-Allow-Origin", "*");
    //允许的header类型
    res.header("Access-Control-Allow-Headers", "content-type");
    //跨域允许的请求方式
    res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");

    let params = URL.parse(req.url, true).query;
    let year = params.year;
    let month = params.month;
    let city = params.city
    console.log("corChart.js " + year + " " + month + " " + city + " ")
    let polution = [
        { name: 'AQI' }, { name: "PM2.5" }, { name: "PM10" }, { name: "SO2" }, { name: "NO2" }, { name: "CO" }, { name: "O3" },
        { name: 'U' }, { name: 'V' }, { name: 'TEMP' }, { name: "RH" }, { name: "PSFC" }
    ]
    if (cor_data != null) {
        let source_targetdata = cor_data[city][year][month];
        let links = [];
        for (let i = 1; i < 12; i++) {
            for (let j = 0; j < i - 1; j++) {
                if (source_targetdata[i][j] > 0.3 || source_targetdata[i][j] < -0.3)
                    links.push({ source: j, target: i, value: source_targetdata[i][j] })
            }
        }
        res.send({ nodes: polution, edges: links })
    } else {
        fs.readFile('./source/cor_city_month.json', 'utf8', function read(err, data1) {
            cor_data = JSON.parse(data1)
            let source_targetdata = cor_data[city][year][month];
            let links = [];
            for (let i = 1; i < 12; i++) {
                for (let j = 0; j < i - 1; j++) {
                    if (source_targetdata[i][j] > 0.3 || source_targetdata[i][j] < -0.3)
                        links.push({ source: j, target: i, value: source_targetdata[i][j] })
                }
            }
            res.send({ nodes: polution, edges: links })
        })

    }




    // res.send({ data: 1 })
})
module.exports = router;