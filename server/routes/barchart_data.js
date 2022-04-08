var express = require('express');
var router = express.Router();
const fs = require('fs');

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    //允许的header类型
    res.header("Access-Control-Allow-Headers", "content-type");
    //跨域允许的请求方式
    res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
    // let params = URL.parse(req.url, true).query;
    let ttime = 2013
    fs.readFile('./source/barchart_data_province.json', 'utf-8', function read(err, data) {
        let ret = JSON.parse(data);
        fs.readFile('./source/barchart_data_city.json','utf-8', function read(err,data){
            let city = JSON.parse(data);
            res.send([ret,city]);
        })
    });
})
module.exports = router;