const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const path = require('path');
const User = require('./models/user');
const passport = require('passport');
const LocalStrategy = require('passport-local');

//------------PASSPORT CONFIGURATION-----------
app.use(
  require('express-session')({
    secret: 'I am the best',
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//to get current logged in user
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

//---------DATABASE SETUP------------------
// const mongo_uri = 'mongodb://127.0.0.1:27017/supplychaintracking';

const mongo_uri =
  'mongodb+srv://cyberdome:cyberdome@cluster0.jntq8.mongodb.net/supplychaintracking?retryWrites=true&w=majority';

const connect = mongoose.connect(mongo_uri, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

connect.then(
  (db) => {
    console.log('Database Connected Successfully');
  },
  (err) => {
    console.log('Error occur while connecting ', err);
  }
);
// --------------------------------------

//-------------GENRAL CONFIGURATION----------
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'hbs');

app.use('/public', express.static('public'));
// app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
//-------------------------------------------
app.set('views', path.join(__dirname, '/views'));

//------------ROUTERS------------------------
const indexRoutes = require('./routes/index');
//---------------------------------------------

app.use('/', indexRoutes);

const port = 2000;
app.get('/', (req, res) => res.send('Hello World!'));
app.listen(port, () => console.log(`App Server Started On PORT ${port}!`));
