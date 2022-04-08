var express = require('express');
var router = express.Router();
var URL = require('url')
const fs = require('fs');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  //允许的header类型
  res.header("Access-Control-Allow-Headers", "content-type");
  //跨域允许的请求方式
  res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
  let params = URL.parse(req.url, true).query;
  let cache = null;
  fs.readFile('./source/province_detail.json', 'utf-8', function read(err, data) {
    if (err) {
      throw err;
    }
    let ret = JSON.parse(data);
    res.send(ret);
  });

})
module.exports = router;