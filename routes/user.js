const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utilities/catchAsync');
const { storeReturnTo } = require('../middleware');
const {isLoggedIn } = require('../middleware');
const user = require('../controllers/user');


router.route('/register')
    .get(user.registerForm)
    .post(catchAsync(user.newUser));

router.route('/login')
    .get(user.loginForm)
    .post(storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), user.loginUser);

router.get('/user-profile/:userId', isLoggedIn, user.userProfile);

router.get('/logout', user.logoutUser);



module.exports = router;