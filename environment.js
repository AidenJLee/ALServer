
/**
 * # WishPick Server Environment
 * 
 * @namespace: env.js - Environment Configuration
 * @author: AidenJLee
 * @description: Server의 환경을 지정하는 곳이다.
 *              Config.js 파일의 환경 변수를 기반으로
 *              Application의 환경을 설정한다.
 */
var express     = require('express'),
    app         = express(),
    server      = require('http').createServer(app);
var config      = require('./config');
var mongodb     = require('mongodb');

// Application HOST, PORT, 세션_암호 정보.
var APP_HOST        = config.apps.hostname || process.env.APP_HOST || 'localhost';
var APP_PORT        = config.apps.portnumber || process.env.APP_PORT || 80;
var SESSION_SECRET  = process.env.SESSION_SECRET || '9to4entist';


// MongoDB 기본 설정 및 Setup.
// Database 기본 셋팅정보.
var MONGODB_URL = config.mongo.URL || process.env.MONGO_DB;
var db_options = {
    native_parser: config.mongo.native_parser,
    auto_reconnect: config.mongo.autoReconnect,
    poolSize: config.mongo.poolSize
};


// db 레퍼런스 및 세션을 유지하기 위한 세션 스토어 설정
// 세션스토어의 경우 릴리즈 환경에서는 Redis를 사용하라는 경고가 나온다.
// 이 점은 어떻게 처리 해야 할지 고민이다.
var db = null; // db connection을 유지하기 위한 Value


// Express 환경 설정
var initialize = function(callback) {
    
    app.configure(function() {
        app.use(express.favicon());
        // app.use(express.bodyParser());  // Request의 Body를 자동으로 JSON 파싱한다.
        app.use(express.json());
        app.use(express.urlencoded());
        app.use(express.cookieParser());// 쿠키정보 JSON 파싱
        app.use(express.static(__dirname + '/public')); // 기본 공유 폴더 지정
    });

    // 개발용 로거 및 예외처리
    app.configure('development', function() {
        app.use(express.logger('dev'));
        app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    });

    // 실제 환경에서 로거 및 예외처리
    app.configure('production', function() {
        app.use(express.logger());
        app.use(express.errorHandler());
    });

    // expressjs 컨텍스트를 잃지 않기 위해 middleware에서 exception 처리
    app.use(function(err, req, res, next) {
        console.log('expressjs =============================================');
        console.error(err.stack);
        res.statusCode = 500;
        res.send('Something broke!');
    });
    
    // MongoDB와 연결 후 db 레퍼런스 정보를 담는다.
    mongodb.MongoClient.connect(MONGODB_URL, db_options, function(err, _db) {
        if(err) {
            return callback(err);
        }
        db = _db;// db reference 저장
        callback(null, app, db);
    });
};

var run = function(callback) {
    // 서버 구동
    server.listen(APP_PORT, APP_HOST, function(err) {
        if(err) {
            db.close();
            return callback(err);
        }
        
        console.log("Server is Working! - v" + require('./package.json').version);
        console.log("listening on port " + APP_PORT + " and host " + APP_HOST);
        
        callback(null);
    });
};

exports.initialize = initialize;
exports.run = run;

