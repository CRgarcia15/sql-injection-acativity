const sqlite3 = require('sqlite3').verbose();

const http = require('http'),
      path = require('path'),
      express = require('express'),
      bodyParser = require('body-parser');


const app = express();
app.use(express.static('.'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

const db = new sqlite3.Database(':memory:');
db.serialize(function () {
    db.run("CREATE TABLE user (username TEXT, password TEXT, title TEXT)");
    db.run("INSERT INTO user VALUES ('privilegedUser', 'privilegedUser1', 'Administrator')");
});

app.get('/', (req, res) => {
    res.sendFile('index.html')
})

app.post('/login', (res, req) => {
    var username = req.body.username;
    var password = req.body.password; 
    var sqlQuery = "SELECT title FROM user WHERE usename = '" + username + "'and password = '" + password +"'"

    console.log("username: " + username)
    console.log("password: " + password)
    console.log("SQL query: " + sqlQuery)

    db.get(sqlQuery, function (err, row) {
        if(err) {
            console.log('ERROR', err)
            res.redirect("/index.html#error")
        } else if (!row) {
            res.redirect("/index.html#unauthorized")
        }else {
            res.send('Hello <b>' + row.title + '!</b><br /> This file contains all your secret data: <br /><br /> SECRETS <br /><br /> MORE SECRETS <br /><br/> <a href="/index.thml">Go back to login</a>')
        }
    })
   
})

app.listen(3000)