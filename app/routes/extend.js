
/**
 * Extend API listing.
 */
 
var mongodb   = require('mongodb');
var BSON      = mongodb.BSONPure;

var crypto    = require('crypto');
var _         = require('underscore');
var moment    = require('moment');
var dbcontrol = require('./../controllers/mongocontrol');

module.exports = function(db, name) {
    
    var routes = function() {};
    
    routes.documentCreateWithPassword = function(req, res) {
        
        var userDocument = req.body;
        userDocument.create_date = moment.utc().format(); // 생성일 추가 (UTC)
        // Hash password
        var sha1 = crypto.createHash('sha1');
        sha1.update(userDocument.password);
        // Get digest
        var hashed_password = sha1.digest('hex');
        console.log(hashed_password);
        // Update User Password
        userDocument.password = hashed_password;
        console.log(userDocument);
        
        dbcontrol(db, name).createDocument(userDocument, function (err, doc) {
            
            var result = {};
            var success = false;
            if (err) { throw err; }
            if (doc) {
                result = doc;
                success = true;
            }
            res.send({
                result: result,
                success: success
            });
            res.end();
        });
        
    };
    
    routes.feedLists = function (req, res) {
        
        console.log('feed Lists');
        console.log(req.body);
        var queryValue = req.body.following;
        var queryDate = moment.utc(req.body.search_date).format();
        var query = { 'user_id': { '$in': queryValue }, 'create_date': { '$lt': queryDate } };
        var sort = { 'create_date': 1 };
        console.log(queryValue);
        console.log(queryDate);
        console.log(query);
        // some query filter
        // var test = ['limit','sort','fields','skip','explain'];
        // query = _.omit(query, test) || {};
        
        // make options
        var limit  = parseInt(req.body.limit, 10) || 0;
        // var skip   = parseInt(req.body.skip, 10) || 0;
        // var options = {
        //     limit: limit,
        //     skip: skip
        // };
        
        dbcontrol(db, name).feedDocuments(query, sort, limit, function(err, doc) {
            console.log(doc);
            var result = {};
            var success = false;
            if (err) { throw err; }
            if (doc) {
                success = true;
                result = doc;
            }
            res.send({
                success: success,
                result: result
            });
            res.end();
            
        });
        
    };
    
    return routes;
    
};
