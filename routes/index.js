const express = require('express');
const router = express.Router();
const bp = require('body-parser');
const path = require('path');
const Collector = require('../models/user');
const Request = require('../models/request');
const passport = require('passport');
const middleware = require('../middleware');
const file = require('fs');
const multer = require('multer');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(
  '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'
);

// router.use(express.static(__dirname + '/public/'));
router.use('/public', express.static('public'));

if (typeof localStorage === 'undefined' || localStorage === null) {
  const LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

var Storage = multer.diskStorage({
  destination: 'public/uploads',
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + '_' + Date.now() + path.extname(file.originalname)
    );
  },
});
var upload = multer({ storage: Storage }).single('profile');

// Show login form on homepage
router.get('/', (req, res) => {
  res.render('app-login');
});

router.get('/login', (req, res) => {
  res.render('app-login');
});

//show register form
router.get('/register', (req, res) => {
  res.render('app-register');
});

// show homepage
router.get('/home', middleware.isLoggedIn, (req, res) => {
  Request.find({}, (err, allrequests) => {
    if (err) {
      console.log('Error in find');
      console.log(err);
    } else {
      res.render('index', {
        requests: allrequests.reverse(),
        totalcount: allrequests.length,
      });
    }
  });
  // AppUser.find({ username: req.user.username }, (err, data) => {
  //   if (err) {
  //     console.log('Error in find');
  //     console.log(err);
  //   } else {
  //     res.render('index', {
  //       profileimg: data[0].profileimg,
  //     });
  //     // console.log(data[0]);
  //   }
  // });
  // Request.countDocuments({ author: req.user.username }, (err, count) => {
  //   console.log(count);
  //   if (err) {
  //     console.log('Error in find');
  //     console.log(err);
  //   } else {
  //     res.render('index', {
  //       totalcount: count,
  //       currentUser: req.user,
  //     });
  //   }
  // });
});

// show settings page
router.get('/settings', middleware.isLoggedIn, (req, res) => {
  res.render('app-settings');
});

// show notifications page
router.get('/notifications', middleware.isLoggedIn, (req, res) => {
  res.render('app-notifications');
});

// show notifications detail page
router.get('/notifications-detail', middleware.isLoggedIn, (req, res) => {
  res.render('app-notification-detail');
});

// show detai request page
router.get('/request-detail', middleware.isLoggedIn, (req, res) => {
  res.render('app-request-detail');
});

// show request page
router.get('/acceptrequest', middleware.isLoggedIn, (req, res) => {
  res.render('scanqr');
});

// handle request logic
router.post('/acceptrequest', middleware.isLoggedIn, (req, res) => {
  // var pname = req.body.pname;
  // var size = req.body.size;
  // var height = req.body.height;
  // var width = req.body.width;
  // var weight = req.body.weight;
  // var author = req.user.username;
  // var address = req.user.address;
  // var mobile = req.user.mobile;

  console.log(req.body);
  console.log(req.user);
  console.log('USERNAME : ' + req.user.username);

  Request.find({ pname: req.body.pname }, (err, allrequests) => {
    if (err) {
      console.log('Error in find');
      console.log(err);
    } else {
      res.render('index', {
        requests: allrequests.reverse(),
      });
      console.log(allrequests[0]);
      if (
        allrequests[0].pname == req.body.pname &&
        allrequests[0].size == req.body.size &&
        allrequests[0].height == req.body.height &&
        allrequests[0].width == req.body.width &&
        allrequests[0].weight == req.body.weight
      ) {
        console.log('Request Matched');

        const msg = {
          to: allrequests[0].author.email, // Change to your recipient
          from: 'pp0428281@gmail.com', // Change to your verified sender
          subject: 'Saaf India - Request Accepted',
          text: 'Saaf India - Request Accepted',
          html: '<table><tr><td><center><img src="https://espumil.com.br/wp-content/uploads/2021/03/simbolo-reciclagem-1.png" alt=""height="300" width="400"></center></td></tr><tr><td><center><h1>Request Accepted</h1></center></td></tr></table>',
        };
        sgMail
          .send(msg)
          .then(() => {
            console.log('Email sent');
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        console.log('Request Not Matched');
      }
    }
  });
});

// handle login logic
//handle login logic
// ----------> router.post('/login', middleware, callback)
router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/',
  }),
  (req, res) => {}
);

// habdle signup logic

router.post('/register', upload, (req, res) => {
  console.log(req.body);
  const pass = req.body.password;
  const confirmPass = req.body.confirmpassword;
  const email = req.body.email;

  var newUser = new Collector({
    username: req.body.username,
    email: email,
    mobile: req.body.mobile,
    // profileimg: req.file.filename,
  });
  // console.log('filename ' + req.file.filename);

  Collector.register(newUser, pass, (err, user) => {
    if (err) {
      console.log(err);
      return res.render('app-register', {
        message: 'This Email is Already Exists',
      });
    }
    passport.authenticate('local')(req, res, () => {
      res.render('index', {
        currentUser: req.user,
        // profileimg: req.file.filename,
      });
    });
  });
});

//handle signup logic
// router.post('/register', (req, res) => {
//   console.log(req.body);
//   var schema = new passwordValidator();
//   const pass = req.body.password;
//   const confirmPass = req.body.confirmpassword;
//   schema.is(pass).min(8);
//   const email = req.body.email;

//   if (isEmailValid.validate(email)) {
//     if (schema.validate(pass) && pass == confirmPass) {
//       var newUser = new AppUser({
//         username: req.body.username,
//         email: email,
//       });
//       AppUser.register(newUser, req.body.password, (err, user) => {
//         if (err) {
//           console.log(err);
//           return res.render('register', {
//             message: 'This Email is Already Exists',
//           });
//         }
//         passport.authenticate('local')(req, res, () => {
//           res.render('index');
//         });
//       });
//     } else {
//       return res.render('register', {
//         message: 'Password is Too Short / Passwords Do Not Match',
//       });
//     }
//   } else {
//     return res.render('register', {
//       message: 'This Email is Invalid',
//     });
//   }
// });

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/app-login');
}

// handle logout logic
router.get('/logout', (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

module.exports = router;
