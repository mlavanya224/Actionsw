'use strict';

var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var $ = require( "jquery" );
var path = require('path');
var app = express();
app.set('view engine', 'ejs');
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

var mysql = require('mysql')
var connection = mysql.createConnection({
        user: 'root',
        password: '',
        server: 'localhost', 
        database: 'actionsw'
})

connection.connect()

connection.query('SELECT username, project_title, categories_name FROM ilance_users LEFT JOIN ilance_projects ON ilance_users.user_id  = ilance_projects.user_id LEFT JOIN categories ON ilance_projects.cid  = categories.cid ', function (err, results) {
  if (err) throw err

  console.log('The solution is: ', results)
})

// connection.end()

    // config for your database


app.get('/users', function (req, res) {
        connection.query('SELECT username, project_title, categories_name FROM ilance_users LEFT JOIN ilance_projects ON ilance_users.user_id  = ilance_projects.user_id LEFT JOIN categories ON ilance_projects.cid  = categories.cid ', function (err, recordset) {
            if (err) console.log(err)
            res.render('pagination', {records:recordset});
        });
 
});

// app.post('/', (req, res) => {
// 	console.log(req.body)
//   return res.send('Received a POST HTTP method');
// });

app.post('/auth', function(request, response) {
	console.log(request.body.username)
	var username = request.body.username;
	var password = request.body.password;
	if (username) {
		connection.query('SELECT * FROM ilance_users WHERE username = ?', [username], function(error, results, fields) {
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
				response.redirect('/home');
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});


app.get('/home', function(request, response) {
	if (request.session.loggedin) {
        connection.query('SELECT username, project_title, categories_name FROM ilance_users LEFT JOIN ilance_projects ON ilance_users.user_id  = ilance_projects.user_id LEFT JOIN categories ON ilance_projects.cid  = categories.cid ', function (err, recordset) {
            if (err) console.log(err)
            response.render('pagination', {records:recordset});
        });

	}
});



var server = app.listen(5000, function () {
    console.log('Server is running..');
});