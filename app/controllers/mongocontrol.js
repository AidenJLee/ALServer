
/*
 * MongoDB Collection Controll Method Implement
 */

var crypto = require('crypto');
// var assert = require('assert');

module.exports = function(db, name) {
    
    var collection = function() {};
    
    // Insert Document
    collection.createDocument = function(document, callback) {
        console.log(document);
        db.collection(name).insert(document, { w:1 }, callback);
    };
    
    collection.findDocuments = function(query, options, fields, callback) {
        db.collection(name).find(query, options, fields).toArray(callback);
    };
    
    collection.feedDocuments = function(query, sort, limit, callback) {
        db.collection(name).find(query).sort(sort).limit(limit).toArray(callback);
    };
    
    collection.findDocument = function(query, callback) {
        console.log('findDocument');
        db.collection(name).findOne(query, callback);
    };
    
    collection.findAndModify = function(query, modifyDocument, callback) {
        db.collection(name).findAndModify(query, [['_id', 1]], { $set: modifyDocument }, {upsert:true}, callback);
    };
    
    collection.updateDocument = function(query, documentObject, callback) {
        db.collection(name).update(query, documentObject, {upsert:true}, callback);
    };
    
    collection.findAndRemove = function(query, callback) {
        db.collection(name).findAndRemove(query, [['_id', 1]], callback);
    };
    
    collection.findByEmailAndPassword = function(user_email, password, callback) {
        // Hash password
        var sha1 = crypto.createHash('sha1');
        sha1.update(password);
        // Get digest
        var hashed_password = sha1.digest('hex');
        // Locate user
        db.collection(name).findOne({ email: user_email, password: hashed_password}, callback);
    };
    
    
    // Create a new user with password
    collection.createUserWithPassword = function(user_document, password, callback) {
        // Hash password
        var sha1 = crypto.createHash('sha1');
        sha1.update(password);
        // Get digest
        var hashed_password = sha1.digest('hex');
        console.log(hashed_password);
        // Update User Password
        user_document.password = hashed_password;
        console.log(user_document);
        // Insert user
        db.collection(name).insert(user_document, { w:1 }, callback);
    };

    // Initialize the users collection, by adding indexes etc
    collection.init = function(callback) {
        db.collection(name).ensureIndex({updated_on: 1}, {expireAfterSeconds: (60 * 60)}, callback);
    };
    
    return collection;
    
};
