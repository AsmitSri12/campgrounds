const User = require('../models/user');
const Campground = require('../models/campgrounds');
const user = require('../models/user');

module.exports.registerForm = (req, res) => {
    res.render('users/register');
}

module.exports.newUser = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registerUser = await User.register(user, password);
        req.login(registerUser, function (err) {
            if (err) {
                return next(err);
            }
            req.flash('success', 'Welcome to Campground');
            res.redirect('/campgrounds');
        })
    }
    catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}

module.exports.loginForm = (req, res) => {
    res.render('users/login');
}

module.exports.loginUser = (req, res) => {
    req.flash('success', `Welcome Back , ${req.body.username}`);
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logoutUser = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye !');
        res.redirect('/campgrounds');
    })
}

module.exports.userProfile = async (req, res, next) => {
    try{ 
        const {userId} = req.params;
        const allCampgrounds = await Campground.find({author: userId});
        const userProfile = await User.findById({_id: userId});
        res.render('users/userProfile', {allCampgrounds, userProfile});
    } catch(err) {
        req.flash('error', err.message);
        res.redirect('/login');
    }
}