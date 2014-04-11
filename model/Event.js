var r = require('rethinkdb')

var table = r.table('events')

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

exports.insert = function(event) {
    delete event.id
    return run(table.insert(event))
}

exports.delete = function(id) {
    return run(table.get(id).delete())
}
