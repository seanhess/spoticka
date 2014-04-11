var koa = require('koa')
var router = require('koa-router')
var User = require('./model/User')
var r = require('rethinkdb')
var body = require('koa-body')


// DATABSE CONNECTION /////////////

var conn = null

r.connect({host:'localhost', port:28015, db:'spoticka'}, function(err, c) {
    User.init(c)
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

app.get('/users', function*(next) {
    var users = yield User.findAll()
    this.body = users
})

app.get('/users/:id', function*(next) {
    var user = yield User.findOne(this.params.id)
    this.body = user
})

app.post('/users', function*(next) {
    this.body = this.request.body
})

app.listen(3000)
console.log("Started on 3000")
