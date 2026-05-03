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
const Campground = require('./models/campgrounds');
const ExpressError = require('./utilities/expressError');


const userRoutes = require('./routes/user');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/review');


const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/Campground-data';

console.log('DB_URL:', dbUrl);

const app = express();

app.set('trust proxy', 1);

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
        maxAge: 1000 * 60 * 60 * 24 * 7,
        secure: process.env.NODE_ENV === 'production'
    }
};
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());

passport.deserializeUser(User.deserializeUser());

app.use(async (req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    try {
        if (mongoose.connection.readyState === 1) {
            res.locals.navCampgrounds = await Campground.find({}).limit(6);
        } else {
            res.locals.navCampgrounds = [];
        }
    } catch (e) {
        res.locals.navCampgrounds = [];
    }
    next();
})

//home page
app.get('/', (req, res) => {
    res.render('home');
});

app.get('/debug', async (req, res) => {
    const camps = await Campground.find({}).limit(2);
    res.json({ count: camps.length, data: camps });
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

const startServer = async () => {
    try {
        await mongoose.connect(dbUrl, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log("Connected to Database");
        
        app.listen(port, () => {
            console.log(`Listening on port ${port}`);
        });
    } catch (err) {
        console.log("Failed to connect to database:", err.message);
        app.listen(port, () => {
            console.log(`Listening on port ${port} (DB not connected)`);
        });
    }
};

startServer();


