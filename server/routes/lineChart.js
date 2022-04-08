var express = require('express');
var router = express.Router();
const fs = require('fs');
var URL = require('url')
let lineData = null
    /* GET users listing. */
router.get('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    //允许的header类型
    res.header("Access-Control-Allow-Headers", "content-type");
    //跨域允许的请求方式
    res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
    let params = URL.parse(req.url, true).query;
    let city = params.city;
    if (lineData != null) {
        let resdata = lineData[city];
        res.send(resdata);
    } else {
        fs.readFile('./source/city_month_line.json', 'utf-8', function read(err, data) {
            lineData = JSON.parse(data);

            let resdata = lineData[city];
            res.send(resdata);
        });
    }

})
module.exports = router;