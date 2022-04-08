var express = require('express');
var router = express.Router();
var URL = require('url')
const fs = require('fs');
let radarcache = null;
let cityprcache = null;
/* GET users listing. */
/*

data = [{subject:'CO'},
      {subject:'PM10'},
      {subject:'PM2.5'},
      {subject:'SO2'},
      {subject:'O3'},
      {subject:'NO2'}]

*/
function searchpr(city, data) {
    for (let i = 0, len = data.length; i < len; i++) {
        for (let j = 0, len1 = data[i]['City'].length; j < len1; j++) {
            if (city.indexOf(data[i]['City'][j]['_Name']) >= 0 || data[i]['City'][j]['_Name'].indexOf(city) >= 0) {
                return data[i]['City'];
            }
        }
    }
    return "err";
}
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
    let resdata = [{ subject: 'CO' }, { subject: 'PM10' }, { subject: 'PM2.5' }, { subject: 'SO2' }, { subject: 'O3' }, { subject: 'NO2' }];
    if (radarcache != null && cityprcache) {
        let citylist = searchpr(city, cityprcache['Province'])
        if (citylist == "err") {
            res.send({ 'data': 'err' })
            return false;
        }
        citylist = citylist.map(item => {
            return item['_Name']
        })
        for (let i = 0, len = radarcache.length; i < len; i += 78) {
            for (let k = 0, len1 = citylist.length; k < len1; k++) {
                let cityname = citylist[k]
                let geocityname = radarcache[i]['city']
                if (geocityname.indexOf(cityname) >= 0 || cityname.indexOf(geocityname) >= 0) {
                    for (let num = 0; num < 6; num++) {
                        let polu_t = resdata[num].subject
                        resdata[num][geocityname] = radarcache[i][polu_t];
                    }
                }
            }
        }
        res.send(resdata)
    } else {
        fs.readFile('./source/province_city.json', 'utf8', function read(err, data1) {
            let _data1 = JSON.parse(data1)
            cityprcache = _data1;
            let citylist = searchpr(city, cityprcache['Province'])
            if (citylist == "err") {
                res.send({ 'data': 'err' })
                return false;
            }
            citylist = citylist.map(item => {
                return item['_Name']
            })
            fs.readFile('./source/city_detail.json', 'utf8', function read(err, data) {
                _data = JSON.parse(data)
                radarcache = _data;
                for (let i = 0, len = radarcache.length; i < len; i += 78) {
                    for (let k = 0, len1 = citylist.length; k < len1; k++) {
                        let cityname = citylist[k]
                        let geocityname = radarcache[i]['city']
                        if (geocityname.indexOf(cityname) >= 0 || cityname.indexOf(geocityname) >= 0) {
                            for (let num = 0; num < 6; num++) {
                                let polu_t = resdata[num].subject
                                resdata[num][geocityname] = radarcache[i][polu_t];
                            }
                        }
                    }
                }
                res.send(resdata)

            })

        })

    }




    // res.send({ data: 1 })
})
module.exports = router;