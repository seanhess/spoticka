var Promise = require('bluebird')
var r = require('rethinkdb')
var db = require('./db')

var table = r.table('users')

function run(query) {
    return db.run(conn, query)
}

var conn = null
exports.init = function(c) {
    conn = c
}

exports.findOne = function(id) {
    return run(table.get(id))
}

exports.findAll = function() {
    return run(table)
}

exports.insert = function(user) {
    console.log("INSERT", user)
    delete user.id
    return run(table.insert(user))
}
