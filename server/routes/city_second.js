var express = require('express');
var router = express.Router();
var URL = require('url')
const fs = require('fs');
let city = null;
let dataset = null;
function sortAscend(data) {
    data = data.sort((a, b) =>
        +a['Zi'] > +b['Zi'] ? 1 : +b['Zi'] > +a['Zi'] ? -1 : 0
    );
    return data
}
/* GET users listing. */
router.get('/', function (req, res, next) {
    //设置允许跨域的域名，*代表允许任意域名跨域 http:127.0.0.1:8080
    res.header("Access-Control-Allow-Origin", "*");
    //允许的header类型
    res.header("Access-Control-Allow-Headers", "content-type");
    //跨域允许的请求方式
    res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");

    let params = URL.parse(req.url, true).query;
    let ttime = params.time.split("-")
    tyear = parseInt(ttime[0])
    tmonth = parseInt(ttime[1])
    let detail = []
    if (dataset == null) {
        fs.readFile('./source/city_moran.json', 'utf8', function read(err, data1) {
            dataset = JSON.parse(data1);
            fs.readFile('./source/city_point.json', 'utf8', function read(err, data2) {
                city = JSON.parse(data2);
                for (var i = 0; i < city["features"].length; i++) {
                    let obj = {}
                    for (var j = 0; j < dataset.length; j++) {
                        if (city["features"][i]["properties"]["name"] == dataset[j]['city']) {
                            if (dataset[j]["month"] == tmonth) {
                                if (dataset[j]['year'] == tyear) {
                                    if (dataset[j]["data"]['AQI']['Ii'] > 0 && dataset[j]["data"]['AQI']['Zi'] > 0) {
                                        obj['name'] = dataset[j]['city']
                                        obj['color'] = 'red'
                                        obj['Zi'] = dataset[j]["data"]['AQI']['Zi']
                                    } else if (dataset[j]["data"]['AQI']['Ii'] > 0 && dataset[j]["data"]['AQI']['Zi'] < 0) {
                                        obj['name'] = dataset[j]['city']
                                        obj['color'] = 'green'
                                        obj['Zi'] = Math.abs(dataset[j]["data"]['AQI']['Zi'])
                                    } else if (dataset[j]["data"]['AQI']['Ii'] < 0 && dataset[j]["data"]['AQI']['Zi'] < 0) {
                                        obj['name'] = dataset[j]['city']
                                        obj['color'] = 'yellow'
                                        obj['Zi'] = Math.abs(dataset[j]["data"]['AQI']['Zi'])
                                    } else {
                                        obj['name'] = dataset[j]['city']
                                        obj['color'] = 'blue'
                                        obj['Zi'] = dataset[j]["data"]['AQI']['Zi']
                                    }
                                    detail.push(obj)
                                }
                            }
                        }
                    }
                }
                let red = []
                let green = []
                let yellow = []
                let blue = []
                for (var i in detail) {
                    if (detail[i]['color'] == 'red') {
                        red.push(detail[i])
                    } else if (detail[i]['color'] == 'green') {
                        green.push(detail[i])
                    } else if (detail[i]['color'] == 'yellow') {
                        yellow.push(detail[i])
                    } else {
                        blue.push(detail[i])
                    }
                }
                red = sortAscend(red)
                green = sortAscend(green)
                yellow = sortAscend(yellow)
                blue = sortAscend(blue)
                for (var i = 0; i < red.length; i++) {
                    for (var j = 0; j < city["features"].length; j++) {
                        if (city["features"][j]["properties"]["name"] == red[i]["name"]) {
                            if (i < red.length * 0.25) {
                                city["features"][j]["properties"]["color"] = '#fb6a4a'
                            } else if (i < red.length * 0.5 && i >= red.length * 0.25) {
                                city["features"][j]["properties"]["color"] = '#ef3b2c'
                            } else if (i < red.length * 0.75 && i >= red.length * 0.5) {
                                city["features"][j]["properties"]["color"] = '#a50f15'
                            } else if (i >= red.length * 0.75) {
                                city["features"][j]["properties"]["color"] = '#67000d'
                            }
                        }
                    }
                }
                for (var i = 0; i < green.length; i++) {
                    for (var j = 0; j < city["features"].length; j++) {
                        if (city["features"][j]["properties"]["name"] == green[i]['name']) {
                            if (i < green.length * 0.25) {
                                city["features"][j]["properties"]["color"] = '#41ab5d'
                            } else if (i < green.length * 0.5 && i >= green.length * 0.25) {
                                city["features"][j]["properties"]["color"] = '#238b45'
                            } else if (i < green.length * 0.75 && i >= green.length * 0.5) {
                                city["features"][j]["properties"]["color"] = '#006d2c'
                            } else if (i >= green.length * 0.75) {
                                city["features"][j]["properties"]["color"] = '#00441b'
                            }
                        }
                    }
                }
                for (var i = 0; i < yellow.length; i++) {
                    for (var j = 0; j < city["features"].length; j++) {
                        if (city["features"][j]["properties"]["name"] == yellow[i]['name']) {
                            if (i < yellow.length * 0.25) {
                                city["features"][j]["properties"]["color"] = '#9ecae1'
                            } else if (i < yellow.length * 0.5 && i >= yellow.length * 0.25) {
                                city["features"][j]["properties"]["color"] = '#6baed6'
                            } else if (i < yellow.length * 0.75 && i >= yellow.length * 0.5) {
                                city["features"][j]["properties"]["color"] = '#2171b5'
                            } else if (i >= yellow.length * 0.75) {
                                city["features"][j]["properties"]["color"] = '#08306b'
                            }
                        }
                    }
                }
                for (var i = 0; i < blue.length; i++) {
                    for (var j = 0; j < city["features"].length; j++) {
                        if (city["features"][j]["properties"]["name"] == blue[i]['name']) {
                            if (i < blue.length * 0.25) {
                                city["features"][j]["properties"]["color"] = '#807dba'
                            } else if (i < blue.length * 0.5 && i >= blue.length * 0.25) {
                                city["features"][j]["properties"]["color"] = '#6a51a3'
                            } else if (i < blue.length * 0.75 && i >= blue.length * 0.5) {
                                city["features"][j]["properties"]["color"] = '#54278f'
                            } else {
                                city["features"][j]["properties"]["color"] = '#3f007d'
                            }
                        }
                    }
                }
                res.send(city)
            });
        });
    } else {
        for (var i = 0; i < city["features"].length; i++) {
            let obj = {}
            for (var j = 0; j < dataset.length; j++) {
                if (city["features"][i]["properties"]["name"] == dataset[j]['city']) {
                    if (dataset[j]["month"] == tmonth) {
                        if (dataset[j]['year'] == tyear) {
                            if (dataset[j]["data"]['AQI']['Ii'] > 0 && dataset[j]["data"]['AQI']['Zi'] > 0) {
                                obj['name'] = dataset[j]['city']
                                obj['color'] = 'red'
                                obj['Zi'] = dataset[j]["data"]['AQI']['Zi']
                            } else if (dataset[j]["data"]['AQI']['Ii'] > 0 && dataset[j]["data"]['AQI']['Zi'] < 0) {
                                obj['name'] = dataset[j]['city']
                                obj['color'] = 'green'
                                obj['Zi'] = Math.abs(dataset[j]["data"]['AQI']['Zi'])
                            } else if (dataset[j]["data"]['AQI']['Ii'] < 0 && dataset[j]["data"]['AQI']['Zi'] < 0) {
                                obj['name'] = dataset[j]['city']
                                obj['color'] = 'yellow'
                                obj['Zi'] = Math.abs(dataset[j]["data"]['AQI']['Zi'])
                            } else {
                                obj['name'] = dataset[j]['city']
                                obj['color'] = 'blue'
                                obj['Zi'] = dataset[j]["data"]['AQI']['Zi']
                            }
                            detail.push(obj)
                        }
                    }
                }
            }
        }
        let red = []
        let green = []
        let yellow = []
        let blue = []
        for (var i in detail) {
            if (detail[i]['color'] == 'red') {
                red.push(detail[i])
            } else if (detail[i]['color'] == 'green') {
                green.push(detail[i])
            } else if (detail[i]['color'] == 'yellow') {
                yellow.push(detail[i])
            } else {
                blue.push(detail[i])
            }
        }
        red = sortAscend(red)
        green = sortAscend(green)
        yellow = sortAscend(yellow)
        blue = sortAscend(blue)
        for (var i = 0; i < red.length; i++) {
            for (var j = 0; j < city["features"].length; j++) {
                if (city["features"][j]["properties"]["name"] == red[i]["name"]) {
                    if (i < red.length * 0.25) {
                        city["features"][j]["properties"]["color"] = '#fb6a4a'
                    } else if (i < red.length * 0.5 && i >= red.length * 0.25) {
                        city["features"][j]["properties"]["color"] = '#ef3b2c'
                    } else if (i < red.length * 0.75 && i >= red.length * 0.5) {
                        city["features"][j]["properties"]["color"] = '#a50f15'
                    } else if (i >= red.length * 0.75) {
                        city["features"][j]["properties"]["color"] = '#67000d'
                    }
                }
            }
        }
        for (var i = 0; i < green.length; i++) {
            for (var j = 0; j < city["features"].length; j++) {
                if (city["features"][j]["properties"]["name"] == green[i]['name']) {
                    if (i < green.length * 0.25) {
                        city["features"][j]["properties"]["color"] = '#41ab5d'
                    } else if (i < green.length * 0.5 && i >= green.length * 0.25) {
                        city["features"][j]["properties"]["color"] = '#238b45'
                    } else if (i < green.length * 0.75 && i >= green.length * 0.5) {
                        city["features"][j]["properties"]["color"] = '#006d2c'
                    } else if (i >= green.length * 0.75) {
                        city["features"][j]["properties"]["color"] = '#00441b'
                    }
                }
            }
        }
        for (var i = 0; i < yellow.length; i++) {
            for (var j = 0; j < city["features"].length; j++) {
                if (city["features"][j]["properties"]["name"] == yellow[i]['name']) {
                    if (i < yellow.length * 0.25) {
                        city["features"][j]["properties"]["color"] = '#9ecae1'
                    } else if (i < yellow.length * 0.5 && i >= yellow.length * 0.25) {
                        city["features"][j]["properties"]["color"] = '#6baed6'
                    } else if (i < yellow.length * 0.75 && i >= yellow.length * 0.5) {
                        city["features"][j]["properties"]["color"] = '#2171b5'
                    } else if (i >= yellow.length * 0.75) {
                        city["features"][j]["properties"]["color"] = '#08306b'
                    }
                }
            }
        }
        for (var i = 0; i < blue.length; i++) {
            for (var j = 0; j < city["features"].length; j++) {
                if (city["features"][j]["properties"]["name"] == blue[i]['name']) {
                    if (i < blue.length * 0.25) {
                        city["features"][j]["properties"]["color"] = '#807dba'
                    } else if (i < blue.length * 0.5 && i >= blue.length * 0.25) {
                        city["features"][j]["properties"]["color"] = '#6a51a3'
                    } else if (i < blue.length * 0.75 && i >= blue.length * 0.5) {
                        city["features"][j]["properties"]["color"] = '#54278f'
                    } else {
                        city["features"][j]["properties"]["color"] = '#3f007d'
                    }
                }
            }
        }
        res.send(city)
    }
})
module.exports = router;