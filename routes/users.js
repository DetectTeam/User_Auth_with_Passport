var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken');

var User = require('../models/user');
const uuidv1 = require('uuid/v1');


//Public Key Encryption Openssl
const NodeRSA = require('node-rsa');




console.log( uuidv1() );


var key = new NodeRSA( { b: 2048 } );




//Register
router.get( '/register', function( req, res ){

    res.render('register');

});

//Login
router.get( '/login', function( req, res ){

    res.render('login');

});


//Register User
router.post('/register', function (req, res)
{

  console.log( 'Register Called ....' );

  var name = req.body.name;
  var username = req.body.username;
  var email = req.body.email;
  var password = req.body.password;
  var password2 = req.body.password2;

  //console.log( name + ' : ' + username + ' : ' + email + ' : ' + password + ' : ' + password2 );


  // Validation
	req.checkBody('name', 'First Name is required').notEmpty();
  req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  var errors = req.validationErrors();

  //res.send("ALL OK HERE ...... ");

  if( errors )
  {

      console.log('Errors: ' + errors );

      // res.render('register',
      // {
      //   errors: errors
      // });

      res.json( { errors: errors } );
  }
  else
  {

      var uName = '';
      console.log( 'No Errors Found...  ' + username );

     // User.findOne({ username: {
     //    "$regex": "^" + username + "\\b", "$options": "i"
     //  }}, function(err, user){
     //
     //      if( err ) throw err;
     //
     //      if( user !=  null )
     //      {
     //        console.log( user );
     //        uName = user.username;
     //      }
     //      else {
     //        uName = '';
     //      }
     //
     //
     //  });

      User.findEmail(email, function( err, isEmail )
      {
          console.log( "EMAIL " + isEmail );

          // if( uName.length > 0  ) //Email Found ...Respond to client
          // {
          //   res.json( { error: 'username_exists' } );
          //
          // }


          if( isEmail )
          {
            res.json( { error: 'email_exists' } );
          }
          else
          {
                var newUser = new User(
                {
                    name: name,
                    email: email,
                    encryptedEmail: email,
                    username: username,
                    password: password
                });

                User.createUser(newUser, function (err, user)
                {
                    console.log( "Saving new user..."   );

                    if (err) throw err;

                });

                jwt.sign( {newUser}, 'secretkey', { expiresIn: '3000s' }, (err, token) => {
                   res.json({
                      success: 'saved',
                      token : token
                           });

                  });


          }

      });


      //check if email and username are already taken
  /*    User.findOne({ username:
      {
        "$regex": "^" + username + "\\b", "$options": "i"
      }}, function (err, user)
      {

          User.compareEmail( email, user.email, function( err, isMatch ){
              console.log(err + ' ' + isMatch);
              if(isMatch)
              {
                console.log( 'Emails Match' );
              }
              else {
                console.log( 'Emails do not match' );
              }
          });


              if (user || mail)
              {

                // res.render('register', {
                //   user: user,
                //   mail: mail
                //   });



              }
              else
              {

                console.log('We are here ...');
                var newUser = new User(
                {
                    name: name,
                    email: email,
                    encryptedEmail: email,
                    username: username,
                    password: password
                });

                User.createUser(newUser, function (err, user)
                {
                    console.log( "Saving new user" );

                    if (err) throw err;
                    console.log(user);
                });

                //req.flash('success_msg', 'You are registered and can now login');
                //res.redirect('/users/login');


                jwt.sign( {user}, 'secretkey', { expiresIn: '3000s' }, (err, token) => {
                   res.json({
                      token
                           });

                  });

                  req.flash('success_msg', 'You are registered and can now login');

                  //res.redirect('login');
              }
    });*/


  }

});

passport.use(new LocalStrategy(
	function (username, password, done) {
    console.log( 'PASSPORT>USE CALLED' );
		User.getUserByUsername(username, function (err, user) {
			if (err) throw err;
			if (!user) {
				return done(null, false, { message: 'Unknown User' });
			}

			User.comparePassword(password, user.password, function (err, isMatch) {
				if (err) throw err;
				if (isMatch) {
					return done(null, user);
				} else {
					return done(null, false, { message: 'Invalid password' });
				}
			});
		});
	}));

  passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.getUserById(id, function (err, user) {
		done(err, user);
	});
});

router.post('/login',
	passport.authenticate('local', { successRedirect: '/', failureRedirect: '/users/login', failureFlash: true }),
	function (req, res) {
		res.redirect('/');
	});

router.get('/logout', function (req, res) {
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/users/login');
});




module.exports = router;
