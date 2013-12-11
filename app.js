
/**
 * # ALServer (이하 ALS)
 * 
 * @namespace: app.js - Main Process
 * @author: AidenJLee
 * @dependencies : package.json
 * @version: 0.0.2
 * @since: 11. 11. 2013
 * @description: Server의 시작점이며 API의 진입점이다.
 *              API요청이 들어오면 해당 하는 Route함수를 호출 한다.
 */
// 환경 설정
var env = require('./environment');

// Routes 메소드
var restful = require('./app/routes/restful');
var extend  = require('./app/routes/extend');

var info  = require('./standardinformation');

env.initialize(function(err, app, db) {
    
    if(err) { throw err; }
    
    /** Standard Infomation **/
    app.get('/v1/standardinformation', function(req, res) {
        res.send(info);
        res.end();
    });
    
    
    /** USERS **/
    app.post('/v1/users', restful(db, 'users').documentCreate);         // 새로운 도큐먼트 생성
    app.get('/v1/users', restful(db, 'users').documentFinds);           // 도큐먼트 리스트 반환 (쿼리 정보는 param에 담겨져 온다)
    app.get('/v1/users/:id?', restful(db, 'users').documentRead);       // 도큐먼트 반환(쿼리는 id 값)
    app.put('/v1/users/:id', restful(db, 'users').documentUpdate);      // 도큐멘트 업데이트(쿼리는 id 값)
    app.del('/v1/users/:id', restful(db, 'users').documentRemove);      // 도큐멘트 삭제(쿼리는 id 값)
    
    /** GIFTS **/
    app.post('/v1/gifts', restful(db, 'gifts').documentCreate);
    app.get('/v1/gifts', restful(db, 'gifts').documentFinds);
    app.get('/v1/gifts/:id?', restful(db, 'gifts').documentRead);
    app.put('/v1/gifts/:id', restful(db, 'gifts').documentUpdate);
    app.del('/v1/gifts/:id', restful(db, 'gifts').documentRemove);
    
    
    /** EXTEND **/
    app.post('/v1/feeds', extend(db, 'gifts').feedLists);                   // FEED LISTS
    app.post('/v1/session', extend(db, 'users').sessionCheck);              // 로그인 세션 확인
    app.post('/v1/following/:id', extend(db, 'users').followingPush);       // following 추가
    app.post('/v1/unfollowing/:id', extend(db, 'users').followingPull);     // following 삭제
    
    
    env.run(function(err) {
        if(err) { throw err; }
        // nothing to do
    });
    
});
