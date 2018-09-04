var express = require('express');
var router = express.Router();

const jwt = require('jsonwebtoken');

//Get Homepage
router.get( '/', verifyToken, function( req, res ){

    jwt.verify( req.token, 'secretkey', (err, authData) =>{
      if(err)
      {
        res.render('login');
      }
      else {
          res.json({
            message: 'Post created...',
            authData
          });
      }
    });

    res.render('index');

});


//Verify to
// Verify Token
function verifyToken(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers['authorization'];
  // Check if bearer is undefined
  if(typeof bearerHeader !== 'undefined') {
    // Split at the space
    const bearer = bearerHeader.split(' ');
    // Get token from array
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;
    // Next middleware
    next();
  } else {
    // Forbidden
    res.render('');
  }

}

module.exports = router;
