var r = require('rethinkdb')
var db = require('./db')


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

exports.insert = function*(item) {
    delete item.id
    var result = yield run(table.insert(item))
    return db.toKey(result)
}


exports.delete = function(id) {
    return run(table.get(id).delete())
}
