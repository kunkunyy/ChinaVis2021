const { json } = require('express');
var express = require('express');
var router = express.Router();
const fs = require('fs');
var URL = require('url')
let dataset = null
/* GET users listing. */
router.get('/', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    //允许的header类型
    res.header("Access-Control-Allow-Headers", "content-type");
    //跨域允许的请求方式
    res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
    fs.readFile('./source/rosepiechart_data.json', 'utf-8', function read(err, data) {
        let params = URL.parse(req.url, true).query;
        let city = params.city;
        let year = params.year;
        let month = params.month;
        if (err) {
            throw err;
        }
        else {
            if (dataset != null) {
                var jsondata = dataset;
                for (var i in jsondata) {
                    if (i == city) {
                        for (var j in jsondata[i]) {
                            if (j == year) {
                                for (var k in jsondata[i][j]) {
                                    if (k == month) {
                                        res.send(jsondata[i][j][k]['data']);
                                    }
                                }
                            }
                        }
                    }
                }
            } else {
                let ret = JSON.parse(data);
                dataset = ret;
                var jsondata = ret;
                for (var i in jsondata) {
                    if (i == city) {
                        for (var j in jsondata[i]) {
                            if (j == year) {
                                for (var k in jsondata[i][j]) {
                                    if (k == month) {
                                        res.send(jsondata[i][j][k]['data']);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

    })

})
module.exports = router;