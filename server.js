var koa = require('koa')
var router = require('koa-router')
var body = require('koa-body')
var cors = require('koa-cors')

var User = require('./model/User')
var Event = require('./model/Event')
var Badge = require('./model/Badge')

var r = require('rethinkdb')
var db = require('./model/db')

// DATABSE CONNECTION /////////////

var conn = null
function run(query) {
    return db.run(conn, query)
}

r.connect({host:'localhost', port:28015, db:'spoticka'}, function(err, c) {
    conn = c
    User.init(run)
    Event.init(run)
    Badge.init(run)
})

var app = koa()
var url = "http://spoticka.orbit.al:5050"

app.use(cors())
app.use(body())
app.use(function*(next) {
    yield next
    if (!this.body) {
        if (this.request.method === "GET") {
            this.body = "Not Found"
            this.status = 404
        }

        else if (this.request.method === "POST" || this.request.method === "PUT" || this.request.method === "DELETE") {
            this.body = "OK"
            this.status = 200
        }
    }
})

app.use(router(app))

app.get('/', function*() {
    this.body = {
        name: "Spoticka",
        version: "1.0",
        resources: {
            "users": url+"/users",
            "events": url+"/events",
            "badges": url+"/badges"
        }
    }
})

// USERS
app.get('/users', function*() {
    var users = yield User.findAll()
    this.body = users
})

app.get('/users/:id', function*() {
    var user = yield User.findOne(this.params.id)
    this.body = user
})

app.put('/users/:id', function*() {
    yield User.save(this.params.id, this.request.body)
})

app.delete('/users/:id', function*() {
    yield User.delete(this.params.id)
})

app.post('/users', function*() {
    var user = this.request.body
    this.body = yield User.create(user)
})



// EVENTS
app.get('/events', function*() {
    this.body = yield Event.findAll()
})

app.get('/events/:id', function*() {
    this.body = yield Event.findOne(this.params.id)
})

app.put('/events/:id', function*() {
    yield Event.save(this.params.id, this.request.body)
})

app.delete('/events/:id', function*() {
    yield Event.delete(this.params.id)
})

app.post('/events', function*() {
    var event = this.request.body
    this.body = yield Event.insert(event)
})



// BADGES
app.get('/badges', function*() {
    this.body = yield Badge.findAll()
})

app.get('/badges/:id', function*() {
    this.body = yield Badge.findOne(this.params.id)
})

app.put('/badges/:id', function*() {
    yield Badge.save(this.params.id, this.request.body)
})


app.delete('/badges/:id', function*() {
    yield Badge.delete(this.params.id)
})

app.post('/badges', function*() {
    var badge = this.request.body
    this.body = yield Badge.insert(badge)
})





var PORT = process.env.PORT || 5050
app.listen(PORT)
console.log("Started on", PORT)
