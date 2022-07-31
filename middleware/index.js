//all the middleware goes here
var middlewareObj = {};

middlewareObj.isLoggedIn = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.render('app-login');
};

module.exports = middlewareObj;
