require('dotenv').config();

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/user');
const ExpressError = require('./utilities/expressError');


const userRoutes = require('./routes/user');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/review');


const dbUrl = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/Campground-data';
mongoose.connect(dbUrl, {
    serverSelectionTimeoutMS: 30000,
    appName: 'campgrounds-app',
})
    .then(() => {
        console.log("Connected to Database");
    })
    .catch(err => {
        console.log("Connection Failed");
        console.log(err)
    })

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

const secret = process.env.SECRET || 'campgroundSecret';
const sessionConfig = {
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());

passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

//home page
app.get('/', (req, res) => {
    res.render('home');
});

//User Router
app.use('/', userRoutes);

//campground router
app.use('/campgrounds', campgroundRoutes);

//review router
app.use('/campgrounds/:id/review', reviewRoutes);

//Error Handling

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Something Went Wrong!'
    res.status(statusCode).render('error', { err });
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})


