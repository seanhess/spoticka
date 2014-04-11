var koa = require('koa')
var router = require('koa-router')
var User = require('./model/User')
var r = require('rethinkdb')
var body = require('koa-body')
var db = require('./model/db')

// DATABSE CONNECTION /////////////

var conn = null
function run(query) {
    return db.run(conn, query)
}

r.connect({host:'localhost', port:28015, db:'spoticka'}, function(err, c) {
    conn = c
    User.init(run)
})


var app = koa()

app.use(body())
app.use(function*(next) {
    yield next
    if (this.request.method === "GET" && this.body === null) {
        this.body = "Not Found"
        this.status = 404
    }
})

app.use(router(app))

app.get('/users', function*() {
    var users = yield User.findAll()
    this.body = users
})

app.get('/users/:id', function*() {
    var user = yield User.findOne(this.params.id)
    this.body = user
})

app.delete('/users/:id', function*() {
    yield User.delete(this.params.id)
    this.status = 200
    this.body = "OK"
})


app.post('/users', function*() {
    var user = this.request.body
    yield User.insert(user)
    this.status = 200
    this.body = "OK"
})




app.listen(3000)
console.log("Started on 3000")
