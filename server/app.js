var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var provinceFirstRouter = require('./routes/province_first')
var cityFirstRouter = require('./routes/city_first')
var sankeychartRouter = require('./routes/sankeychart')
var provinceDetailRouter = require('./routes/province_detail')
var mainPolutionRouter = require('./routes/mainpolution')
var radarRouter = require('./routes/raderchart')
var corChartRouter = require('./routes/corChart')
var citySecondRouter = require('./routes/city_second')
var barChartRouter = require('./routes/barchart_data')
var recordChartRouter = require('./routes/recordchart_data')
var wordCloudRouter = require('./routes/wordCloud_data')
var lineChartRouter = require('./routes/lineChart')
var analyse = require('./routes/analyse')
var cityFactoryRouter = require('./routes/cityFactory')
var cityOnceRouter = require('./routes/city_one_data')
var rosepieChartRouter = require('./routes/rosepieChart')
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/provinceFirst', provinceFirstRouter);
app.use('/cityFirst', cityFirstRouter);
app.use('/sankeychart', sankeychartRouter);
app.use('/province_detail', provinceDetailRouter);
app.use('/mainpolution', mainPolutionRouter)
app.use('/radar', radarRouter)
app.use('/corChart', corChartRouter)
app.use('/mainpolution', mainPolutionRouter);
app.use('/citySecond', citySecondRouter);
app.use('/barChartData', barChartRouter);
app.use('/recordChartData', recordChartRouter)
app.use('/wordCloud', wordCloudRouter)
app.use('/lineChart', lineChartRouter);
app.use('/analyse', analyse);
app.use('/cityFactory', cityFactoryRouter);
app.use('/cityOnce', cityOnceRouter)
app.use('/rosepieChart',rosepieChartRouter)
    // catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
app.all("*", function(req, res, next) {
    //设置允许跨域的域名，*代表允许任意域名跨域 http:127.0.0.1:8080
    res.header("Access-Control-Allow-Origin", "*");
    //允许的header类型
    res.header("Access-Control-Allow-Headers", "content-type");
    //跨域允许的请求方式
    res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
    if (req.method.toLowerCase() == 'options')
        res.send(200); //让options尝试请求快速结束
    else
        next();
});

module.exports = app;