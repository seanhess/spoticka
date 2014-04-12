var r = require('rethinkdb')
var db = require('./db')

var table = r.table('users')

// set me from the outside
var run = null
exports.init = function(r) {
    run = r
}

exports.findOne = function findOne(id) {
    return run(table.get(id))
}

exports.findAll = function() {
    return run(table)
}

// Creates the user if they don't exist by username
exports.create = function*(user) {
    user.id = user.username
    if (!user.username) throw new Error("Missing user.username")
    var found = yield exports.findOne(user.username)
    if (found) return onlyId(found)
    var result = yield run(table.insert(user))
    return db.toKey(result)
}

exports.save = function(id, user) {
    return run(table.get(id).replace(user))
}

exports.delete = function(id) {
    return run(table.get(id).delete())
}

function onlyId(obj) {
    return {id: obj.id}
}

// username: "gisheri"
// {generated_keys: ["asdfasdf"]}

// key users by facebook
// facebook
// find or create on login
