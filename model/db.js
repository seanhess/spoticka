var r = require('rethinkdb')
var Promise = require('bluebird')

exports.run = function(conn, query) {
    return new Promise(function(resolve, reject) {
        if (!conn) return reject(new Error("Missing Connection"))
        if (!query) return reject(new Error("Missing Query"))
        query.run(conn, function(err, cursor) {
            if (err) return reject(err)
            if (!cursor) return resolve(cursor)
            if (!cursor.toArray) return resolve(cursor)
            cursor.toArray(function(err, results) {
                if (err) return reject(err)
                resolve(results)
            })
        })
    })
}


exports.toKey = function(result) {
    return { id: result.generated_keys[0] }
}
