var express = require('express');
var router = express.Router();
var URL = require('url')
const fs = require('fs');
let analysedata = null;

/*['AQI', 'PM2.5', 'PM10', "SO2", "NO2", "CO", "O3", 'U', 'V', 'TEMP', 'RH', 'PSFC','SUMV'] */
router.get('/', function(req, res, next) {
    //设置允许跨域的域名，*代表允许任意域名跨域 http:127.0.0.1:8080
    res.header("Access-Control-Allow-Origin", "*");
    //允许的header类型
    res.header("Access-Control-Allow-Headers", "content-type");
    //跨域允许的请求方式
    res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");

    let params = URL.parse(req.url, true).query;
    let city = params.city;
    let year = params.year;
    if (analysedata != null) {
        let tmpdata = analysedata[city][year];
        let resdata = [];
        for (let i = 0, len = tmpdata.length; i < len; i++) {
            resdata.push({
                x: tmpdata[i][0],
                bar: tmpdata[i][1][0],
                color: tmpdata[i][1][1],
                line: tmpdata[i][2],
            })
        }
        res.send({ data: resdata })
    } else {
        fs.readFile('./source/analyse.json', 'utf8', function read(err, data1) {
            analysedata = JSON.parse(data1);
            let tmpdata = analysedata[city][year];
            let resdata = [];
            for (let i = 0, len = tmpdata.length; i < len; i++) {
                resdata.push({
                    x: tmpdata[i][0],
                    bar: tmpdata[i][1][0],
                    color: tmpdata[i][1][1],
                    line: tmpdata[i][2],
                })
            }
            res.send({ data: resdata })
        })

    }




    // res.send({ data: 1 })
})
module.exports = router;