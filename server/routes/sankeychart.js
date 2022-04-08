var express = require('express');
var router = express.Router();
var URL = require('url')
const fs = require('fs');

function getdegree(aqi) {
    if (aqi >= 0 && aqi <= 50) {
        return 1;
    } else if (aqi > 50 && aqi <= 100) {
        return 2;
    } else if (aqi > 100 && aqi <= 150) {
        return 3;
    } else if (aqi > 150 && aqi <= 200) {
        return 4;
    } else if (aqi > 200 && aqi <= 300) {
        return 5;
    } else if (aqi > 300) {
        return 6;
    } else {
        console.log(aqi)
        return 7;
    }
}
/* GET users listing. */
router.get('/', function(req, res, next) {
    //设置允许跨域的域名，*代表允许任意域名跨域 http:127.0.0.1:8080
    res.header("Access-Control-Allow-Origin", "*");
    //允许的header类型
    res.header("Access-Control-Allow-Headers", "content-type");
    //跨域允许的请求方式
    res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
    var LinkData = [],
        SourceData = [],
        TimeData;
    let params = URL.parse(req.url, true).query;
    console.log(params.mode)
    if (params.mode == 0) {
        fs.readFile('./source/year.json', 'utf8', function read(err, data) {
            if (err) {
                throw err;
            }

            let ret = JSON.parse(data);

            var jsondata = ret,
                sourcedata = [],
                linkdata = {},
                timedata = new Set();
            for (let i in jsondata) {
                var num = 0,
                    front = -1,
                    now = -1,
                    tmpdata = jsondata[i];
                tmpdata = tmpdata[Object.keys(tmpdata)[0]]
                if (typeof tmpdata === "object") {
                    for (let j in tmpdata) {
                        front = now;
                        now = j;
                        if (num == 0) {
                            num = 1;
                            continue;
                        }
                        var degree1 = getdegree(tmpdata[front].AQI);
                        var degree2 = getdegree(tmpdata[now].AQI);
                        var name1 = `${front}&${degree1}`;
                        var name2 = `${now}&${degree2}`;
                        timedata.add(`${front}`)
                        timedata.add(`${now}`)
                        if (sourcedata.indexOf(name1) == -1) {
                            sourcedata.push(name1);
                        }
                        if (sourcedata.indexOf(name2) == -1) {
                            sourcedata.push(name2);
                        }
                        var name = name1 + "$" + name2;

                        if (linkdata[name] == undefined) {
                            linkdata[name] = 0;
                        }
                        linkdata[name]++;
                    }
                }
            }

            for (let i in linkdata) {
                let ar1 = i.split('$')
                LinkData.push({ source: ar1[0], target: ar1[1], value: linkdata[i] });
            }
            SourceData = sourcedata.map(item => {
                return { name: item, category: item };
            })
            TimeData = [...timedata]
            TimeData.sort(function(a, b) {
                let arr1 = a.split('-'),
                    arr2 = b.split('-');
                let year1 = +arr1[0],
                    year2 = +arr2[0],
                    month1 = +arr1[1],
                    month2 = +arr2[1];
                if (year1 == year2) {
                    return month1 - month2;
                } else return year1 - year2;

            })
            res.send({ links: LinkData, nodes: SourceData, time: TimeData });
        });
    } else if (params.mode == 1) {
        fs.readFile('./source/month.json', 'utf8', function read(err, data) {
            if (err) throw err;
            let ret = JSON.parse(data);

            var jsondata = ret,
                sourcedata = [],
                linkdata = {},
                timedata = new Set();
            for (let i in jsondata) {
                var num = 0,
                    front = -1,
                    now = -1,
                    tmpdata = jsondata[i];
                tmpdata = tmpdata[Object.keys(tmpdata)[0]]
                if (typeof tmpdata === "object") {
                    let frontyear = 0;
                    let nowyear = 0;
                    for (let j in tmpdata) {
                        frontyear = nowyear;
                        nowyear = j;
                        var temp = tmpdata[j];
                        var len = Object.keys(temp).length
                        for (let k = 1; k <= len; k++) {
                            front = now;
                            now = k;
                            if (num == 0) {
                                num = 1;
                                continue;
                            }
                            front = (front + '').padStart(2, '0');
                            now = (now + '').padStart(2, '0');
                            var degree1 = getdegree(temp[front].AQI);
                            var degree2 = getdegree(temp[now].AQI);

                            var name1 = `${nowyear}-${front}&${degree1}`;
                            if (k == 1) name1 = `${frontyear}-${front}&${degree1}`;
                            var name2 = `${j}-${now}&${degree2}`;
                            timedata.add(`${j}-${front}`)
                            timedata.add(`${j}-${now}`)
                            if (sourcedata.indexOf(name1) == -1) {
                                sourcedata.push(name1);
                            }
                            if (sourcedata.indexOf(name2) == -1) {
                                sourcedata.push(name2);
                            }
                            var name = name1 + "$" + name2;

                            if (linkdata[name] == undefined) {
                                linkdata[name] = 0;
                            }
                            linkdata[name]++;
                        }

                    }
                }
            }
            for (let i in linkdata) {
                let ar1 = i.split('$')
                LinkData.push({ source: ar1[0], target: ar1[1], value: linkdata[i] });
            }
            SourceData = sourcedata.map(item => {
                return { name: item, category: item };
            })
            TimeData = [...timedata]
            TimeData.sort(function(a, b) {
                let arr1 = a.split('-'),
                    arr2 = b.split('-');
                let year1 = +arr1[0],
                    year2 = +arr2[0],
                    month1 = +arr1[1],
                    month2 = +arr2[1];
                if (year1 == year2) {
                    return month1 - month2;
                } else return year1 - year2;

            })
            res.send({ links: LinkData, nodes: SourceData, time: TimeData });
        })
    }


});

module.exports = router;