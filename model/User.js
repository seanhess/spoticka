var Promise = require('bluebird')
var r = require('rethinkdb')

var table = r.table('users')

// set me from the outside
var run = null
exports.init = function(r) {
    run = r
}

exports.findOne = function(id) {
    return run(table.get(id))
}

exports.findAll = function() {
    return run(table)
}

exports.insert = function(user) {
    delete user.id
    return run(table.insert(user))
}

exports.delete = function(id) {
    return run(table.get(id).delete())
}
