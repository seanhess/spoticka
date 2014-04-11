var r = require('rethinkdb')

var table = r.table('badges')

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

exports.insert = function(badge) {
    delete badge.id
    return run(table.insert(badge))
}

exports.delete = function(id) {
    return run(table.get(id).delete())
}
