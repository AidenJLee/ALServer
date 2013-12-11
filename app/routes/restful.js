
/**
 * Restgful API listing.
 */
 
var mongodb   = require('mongodb');
var BSON      = mongodb.BSONPure;

var _         = require('underscore');
var moment    = require('moment');
var dbcontrol = require('./../controllers/mongocontrol');

module.exports = function(db, name) {
    
    var routes = function() {};
    
    routes.documentCreate = function(req, res) {
        
        var commonDocument = req.body;
        commonDocument.create_date = moment.utc().format(); // 생성일 추가 (UTC)
        console.log(commonDocument);
        dbcontrol(db, name).createDocument(commonDocument, function (err, doc) {
            
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
    
    routes.documentFinds = function(req, res, next) {
        
        // make options
        var limit  = parseInt(req.query.limit, 10) || 0;
        var skip   = parseInt(req.query.skip, 10) || 0;
        var options = {
            limit: limit,
            skip: skip
        };
        
        // make fields
        var fields = _.pick(req.query, 'fields') || {};
        
        // some query filter
        var test = ['limit','sort','fields','skip','explain'];
        var query = _.omit(req.query, test) || {};
        
        dbcontrol(db, name).findDocuments(query, options, fields, function(err, docs) {
            
            var result = {};
            var success = false;
            if (err) { throw err; }
            if (docs) {
                result = docs;
                success = true;
            }
            res.send({
                result: result,
                success: success
            });
            res.end();
            
        });
    };
    
    routes.documentRead = function(req, res, next) {
        
        var objectId = req.params.id;
        if (objectId) {
            var query = { '_id': new BSON.ObjectID(objectId) };
            console.log('documentRead');
            console.log(query);
            dbcontrol(db, name).findDocument(query, function(err, doc) {
                
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
        } else {
            next();
        }
        
    };
    
    routes.documentUpdate = function(req, res) {
        
        var objectId = req.params.id;
        if (objectId) {
            var query = { '_id': new BSON.ObjectID(objectId) };
            var updateObject = { '$set': req.body };
            console.log(query);
            console.log(updateObject);
            dbcontrol(db, name).updateDocument(query, updateObject, function(err, doc) {
                
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
        } else {
            res.send({
                success: false,
                result: { 'error': 'Missing ObjectId' }
            });
            res.end();
        }
        
    };
    
    routes.documentRemove = function(req, res) {
        
        var objectId = req.params.id;
        if (objectId) {
            var query = { '_id': new BSON.ObjectID(objectId) };
            console.log(query);
            dbcontrol(db, name).findAndRemove(query, function(err, doc) {
                
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
        } else {
            res.send({
                result: { 'error': 'Missing ObjectId' },
                success: false
            });
            res.end();
        }
        
    };
    
    return routes;
};
