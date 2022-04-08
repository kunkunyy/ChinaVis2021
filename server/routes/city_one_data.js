var express = require('express');
var router = express.Router();
var URL = require('url')
const fs = require('fs');
var dataset = null
var database = null

function sortAscend(data) {
    data = data.sort((a, b) =>
        +a['value'] > +b['value'] ? 1 : +b['value'] > +a['value'] ? -1 : 0
    );
    return data
}
/* GET users listing. */
router.get('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    //允许的header类型
    res.header("Access-Control-Allow-Headers", "content-type");
    //跨域允许的请求方式
    res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
    let params = URL.parse(req.url, true).query;
    let ttime = params.time.split("-")
    let tyear = parseInt(ttime[0])
    let tmonth = parseInt(ttime[1])
    let list = []
    if (dataset == null) {
        fs.readFile('./source/邢台市_geojson.json', 'utf-8', function read(err, data) {
            dataset = JSON.parse(data);
            fs.readFile('./source/cityOnceData.json', 'utf-8', function read(err, data) {
                database = JSON.parse(data);
                for (var i = 0; i < dataset['features'].length; i++) {
                    for (var j = 0; j < database.length; j++) {
                        if (dataset['features'][i]['properties']['name'] == database[j]['city'] &&
                            database[j]['year'] == tyear && database[j]['month'] == tmonth) {
                            if (database[j]['AQI'] >= 0 && database[j]['AQI'] <= 50) {
                                list.push({
                                    name: database[j]['city'],
                                    color: 'rgb(0,228,0)',
                                    value: database[j]['AQI']
                                })
                            } else if (database[j]['AQI'] > 50 && database[j]['AQI'] <= 100) {
                                list.push({
                                    name: database[j]['city'],
                                    color: 'rgb(255,255,0)',
                                    value: database[j]['AQI']
                                })
                            } else if (database[j]['AQI'] > 100 && database[j]['AQI'] <= 150) {
                                list.push({
                                    name: database[j]['city'],
                                    color: 'rgb(255,126,0)',
                                    value: database[j]['AQI']
                                })
                            } else if (database[j]['AQI'] > 150 && database[j]['AQI'] <= 200) {
                                list.push({
                                    name: database[j]['city'],
                                    color: 'rgb(255,0,0)',
                                    value: database[j]['AQI']
                                })
                            } else if (database[j]['AQI'] > 200 && database[j]['AQI'] <= 300) {
                                list.push({
                                    name: database[j]['city'],
                                    color: 'rgb(153,0,76)',
                                    value: database[j]['AQI']
                                })
                            } else {
                                list.push({
                                    name: database[j]['city'],
                                    color: 'rgb(126,0,35)',
                                    value: database[j]['AQI']
                                })
                            }
                        }
                    }
                }
                let a = []
                let b = []
                let c = []
                let d = []
                let e = []
                let f = []
                for (var i in list) {
                    if (list[i]['color'] == 'rgb(0,228,0)') {
                        a.push(list[i])
                    } else if (list[i]['color'] == 'rgb(255,255,0)') {
                        b.push(list[i])
                    } else if (list[i]['color'] == 'rgb(255,126,0)') {
                        c.push(list[i])
                    } else if (list[i]['color'] == 'rgb(255,0,0)') {
                        d.push(list[i])
                    } else if (list[i]['color'] == 'rgb(153,0,76)') {
                        e.push(list[i])
                    } else if (list[i]['color'] == 'rgb(126,0,35)') {
                        f.push(list[i])
                    }
                }
                let a_op = 0.6 / a.length
                let b_op = 0.6 / b.length
                let c_op = 0.6 / c.length
                let d_op = 0.6 / d.length
                let e_op = 0.6 / e.length
                let f_op = 0.6 / f.length
                a = sortAscend(a)
                b = sortAscend(b)
                c = sortAscend(c)
                d = sortAscend(d)
                e = sortAscend(e)
                f = sortAscend(f)
                for (var i = 0; i < a.length; i++) {
                    for (var j = 0; j < dataset["features"].length; j++) {
                        if (dataset["features"][j]["properties"]["name"] == a[i]["name"]) {
                            dataset["features"][j]["properties"]["color"] = a[i]["color"]
                            if (i == a.length - 1) {
                                dataset["features"][j]["properties"]['opacity'] = 1
                            } else {
                                dataset["features"][j]["properties"]['opacity'] = a_op * (i + 1)
                            }
                        }
                    }
                }
                for (var i = 0; i < b.length; i++) {
                    for (var j = 0; j < dataset["features"].length; j++) {
                        if (dataset["features"][j]["properties"]["name"] == b[i]["name"]) {
                            dataset["features"][j]["properties"]["color"] = b[i]["color"]
                            if (i == b.length - 1) {
                                dataset["features"][j]["properties"]['opacity'] = 1
                            } else {
                                dataset["features"][j]["properties"]['opacity'] = b_op * (i + 1)
                            }
                        }
                    }
                }
                for (var i = 0; i < c.length; i++) {
                    for (var j = 0; j < dataset["features"].length; j++) {
                        if (dataset["features"][j]["properties"]["name"] == c[i]["name"]) {
                            dataset["features"][j]["properties"]["color"] = c[i]["color"]
                            if (i == c.length - 1) {
                                dataset["features"][j]["properties"]['opacity'] = 1
                            } else {
                                dataset["features"][j]["properties"]['opacity'] = c_op * (i + 1)
                            }
                        }
                    }
                }
                for (var i = 0; i < d.length; i++) {
                    for (var j = 0; j < dataset["features"].length; j++) {
                        if (dataset["features"][j]["properties"]["name"] == d[i]["name"]) {
                            dataset["features"][j]["properties"]["color"] = d[i]["color"]
                            if (i == d.length - 1) {
                                dataset["features"][j]["properties"]['opacity'] = 1
                            } else {
                                dataset["features"][j]["properties"]['opacity'] = d_op * (i + 1)
                            }
                        }
                    }
                }
                for (var i = 0; i < e.length; i++) {
                    for (var j = 0; j < dataset["features"].length; j++) {
                        if (dataset["features"][j]["properties"]["name"] == e[i]["name"]) {
                            dataset["features"][j]["properties"]["color"] = e[i]["color"]
                            if (i == e.length - 1) {
                                dataset["features"][j]["properties"]['opacity'] = 1
                            } else {
                                dataset["features"][j]["properties"]['opacity'] = e_op * (i + 1)
                            }
                        }
                    }
                }
                for (var i = 0; i < f.length; i++) {
                    for (var j = 0; j < dataset["features"].length; j++) {
                        if (dataset["features"][j]["properties"]["name"] == f[i]["name"]) {
                            dataset["features"][j]["properties"]["color"] = f[i]["color"]
                            if (i == f.length - 1) {
                                dataset["features"][j]["properties"]['opacity'] = 1
                            } else {
                                dataset["features"][j]["properties"]['opacity'] = f_op * (i + 1)
                            }
                        }
                    }
                }
                res.send(dataset);
            })
        });
    } else {
        for (var i = 0; i < dataset['features'].length; i++) {
            for (var j = 0; j < database.length; j++) {
                if (dataset['features'][i]['properties']['name'] == database[j]['city'] &&
                    database[j]['year'] == tyear && database[j]['month'] == tmonth) {
                    if (database[j]['AQI'] >= 0 && database[j]['AQI'] <= 50) {
                        list.push({
                            name: database[j]['city'],
                            color: 'rgb(0,228,0)',
                            value: database[j]['AQI']
                        })
                    } else if (database[j]['AQI'] > 50 && database[j]['AQI'] <= 100) {
                        list.push({
                            name: database[j]['city'],
                            color: 'rgb(255,255,0)',
                            value: database[j]['AQI']
                        })
                    } else if (database[j]['AQI'] > 100 && database[j]['AQI'] <= 150) {
                        list.push({
                            name: database[j]['city'],
                            color: 'rgb(255,126,0)',
                            value: database[j]['AQI']
                        })
                    } else if (database[j]['AQI'] > 150 && database[j]['AQI'] <= 200) {
                        list.push({
                            name: database[j]['city'],
                            color: 'rgb(255,0,0)',
                            value: database[j]['AQI']
                        })
                    } else if (database[j]['AQI'] > 200 && database[j]['AQI'] <= 300) {
                        list.push({
                            name: database[j]['city'],
                            color: 'rgb(153,0,76)',
                            value: database[j]['AQI']
                        })
                    } else {
                        list.push({
                            name: database[j]['city'],
                            color: 'rgb(126,0,35)',
                            value: database[j]['AQI']
                        })
                    }
                }
            }
        }
        let a = []
        let b = []
        let c = []
        let d = []
        let e = []
        let f = []
        for (var i in list) {
            if (list[i]['color'] == 'rgb(0,228,0)') {
                a.push(list[i])
            } else if (list[i]['color'] == 'rgb(255,255,0)') {
                b.push(list[i])
            } else if (list[i]['color'] == 'rgb(255,126,0)') {
                c.push(list[i])
            } else if (list[i]['color'] == 'rgb(255,0,0)') {
                d.push(list[i])
            } else if (list[i]['color'] == 'rgb(153,0,76)') {
                e.push(list[i])
            } else if (list[i]['color'] == 'rgb(126,0,35)') {
                f.push(list[i])
            }
        }
        let a_op = 0.6 / a.length
        let b_op = 0.6 / b.length
        let c_op = 0.6 / c.length
        let d_op = 0.6 / d.length
        let e_op = 0.6 / e.length
        let f_op = 0.6 / f.length
        a = sortAscend(a)
        b = sortAscend(b)
        c = sortAscend(c)
        d = sortAscend(d)
        e = sortAscend(e)
        f = sortAscend(f)
        for (var i = 0; i < a.length; i++) {
            for (var j = 0; j < dataset["features"].length; j++) {
                if (dataset["features"][j]["properties"]["name"] == a[i]["name"]) {
                    dataset["features"][j]["properties"]["color"] = a[i]["color"]
                    if (i == a.length - 1) {
                        dataset["features"][j]["properties"]['opacity'] = 1
                    } else {
                        dataset["features"][j]["properties"]['opacity'] = a_op * (i + 1)
                    }
                }
            }
        }
        for (var i = 0; i < b.length; i++) {
            for (var j = 0; j < dataset["features"].length; j++) {
                if (dataset["features"][j]["properties"]["name"] == b[i]["name"]) {
                    dataset["features"][j]["properties"]["color"] = b[i]["color"]
                    if (i == b.length - 1) {
                        dataset["features"][j]["properties"]['opacity'] = 1
                    } else {
                        dataset["features"][j]["properties"]['opacity'] = b_op * (i + 1)
                    }
                }
            }
        }
        for (var i = 0; i < c.length; i++) {
            for (var j = 0; j < dataset["features"].length; j++) {
                if (dataset["features"][j]["properties"]["name"] == c[i]["name"]) {
                    dataset["features"][j]["properties"]["color"] = c[i]["color"]
                    if (i == c.length - 1) {
                        dataset["features"][j]["properties"]['opacity'] = 1
                    } else {
                        dataset["features"][j]["properties"]['opacity'] = c_op * (i + 1)
                    }
                }
            }
        }
        for (var i = 0; i < d.length; i++) {
            for (var j = 0; j < dataset["features"].length; j++) {
                if (dataset["features"][j]["properties"]["name"] == d[i]["name"]) {
                    dataset["features"][j]["properties"]["color"] = d[i]["color"]
                    if (i == d.length - 1) {
                        dataset["features"][j]["properties"]['opacity'] = 1
                    } else {
                        dataset["features"][j]["properties"]['opacity'] = d_op * (i + 1)
                    }
                }
            }
        }
        for (var i = 0; i < e.length; i++) {
            for (var j = 0; j < dataset["features"].length; j++) {
                if (dataset["features"][j]["properties"]["name"] == e[i]["name"]) {
                    dataset["features"][j]["properties"]["color"] = e[i]["color"]
                    if (i == e.length - 1) {
                        dataset["features"][j]["properties"]['opacity'] = 1
                    } else {
                        dataset["features"][j]["properties"]['opacity'] = e_op * (i + 1)
                    }
                }
            }
        }
        for (var i = 0; i < f.length; i++) {
            for (var j = 0; j < dataset["features"].length; j++) {
                if (dataset["features"][j]["properties"]["name"] == f[i]["name"]) {
                    dataset["features"][j]["properties"]["color"] = f[i]["color"]
                    if (i == f.length - 1) {
                        dataset["features"][j]["properties"]['opacity'] = 1
                    } else {
                        dataset["features"][j]["properties"]['opacity'] = f_op * (i + 1)
                    }
                }
            }
        }
        res.send(dataset);
    }
})
module.exports = router;