var express = require('express');
var app = express();
var Sequelize = require('sequelize');
var bodyParser = require('body-parser');
var morgan = require('morgan');

app.use(express.static('client'));
app.use(bodyParser.json());

var sequelize = new Sequelize('postgres://localhost/codefeed');

var User = sequelize.define('users', {
	username: {
		type: Sequelize.STRING,
		field: 'username'
	},
	password: {
		type: Sequelize.STRING,
		field: 'password'
	},
	usertoken: {
		type: Sequelize.STRING,
		field: 'usertoken'
	},
	email: {
		type: Sequelize.STRING,
		field: 'email'
	}
	}, {
	freezeTableName: true
	
});

var Post =  sequelize.define('post',{
	title: {
		type: Sequelize.STRING,
		field: 'title'
	},
	url: {
		type: Sequelize.STRING,
		field: 'url'
	},	
	posts: {
		type: Sequelize.STRING,
		field: 'posts'
	}
    },{
	freezeTableName: true
});


User.hasMany(Post, {as: 'posts'});

User.sync();
Post.sync();


app.post('/signup', function (req, res) {
	//first check if username exists in database
	User.find({username: req.body.username})
    .then(function (user) {
      if (!user) {
        User
          .create(req.body)
          .then(function (user){
            res.json({message: 'Welcome to our site!'});
          })
          .catch(function (error) {
            if (error) {
              res.send(error);
            }
          });
          res.json({message: 'Creating user'});
      }
      else { //user exists in database. update access_token
      	user.updateAttributes({
      		usertoken : req.body.access_token
      	});
      }
      if (user.password !== password) {
        res.json({message: 'Wrong password'});
      }
    });
});
/*
app.post('/fb_login', function(req,res){
	console.log(req.body);
	User
	  .create(req.body)
	  .then(function (user){
	    res.json({message: 'Welcome to our site!'});
	  })
	  .catch(function (error) {
	    if (error) {
	      res.send(error);
	    }
	  });
});*/

app.post('/fb_login', function(req,res){
	console.log(req.body);
	User
	  .findOrCreate({
	  	where : {
	  		username : req.body.username
	  	},
	  	defaults:{
	  		usertoken : req.body.usertoken
	  	}
	  }).spread(function(user,created){
	  	user.updateAttributes({
      		usertoken : req.body.usertoken
      	});
	  	//console.log(user);
	  	//console.log("created);
	  });
});

app.get('/user/:id', function (req, res) {
  User
    .findById(id)
    .then(function (user) {
      res.send(user);
    })
    .catch(function (error) {
      if (error) {
        res.send(error);
      }
    });
});

app.post('/login', function (req, res) {
  User.find({username: username})
    .then(function (user) {
      if (!user) {
        res.json({message: 'Nobody here by that name'});
      }
      if (user.password !== password) {
        res.json({message: 'Wrong password'});
      }
    });
});

app.post('/post', function (req, res) {
  Post
    .create(req.body)
    .catch(function (error) {
      if (error) {
        res.send(error);
      }
    });
});

app.get('/post:id', function (req, res) {
  Post
    .findById(id)
    .then(function (post) {
      res.send(req.params.id);
    })
    .catch(function (error) {
      if (error) {
        res.send(error);
      }
    });
});


// middleware
app.use(express.static('client'));

app.get('/posts', function (req, res) {
  Post
    .findAll()
    .then(function (posts) {
      res.send(posts);
    })
    .catch(function (error) {
      res.send(error);
    });
});

app.get('/fb_users', function (req, res) {
  User
    .findAll()
    .then(function (users) {
      res.send(users);
    })
    .catch(function (error) {
      res.send(error);
    });
});

app.listen(3000);