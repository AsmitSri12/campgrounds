const express=require('express');
const ejsMate=require('ejs-mate');
const path=require('path');
const mongoose=require('mongoose');
const app=express();
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
const Campground = require('./models/campgrounds');
const User = require('./models/user');
mongoose.connect('mongodb://127.0.0.1:27017/Campground-data').then(async () => {
    try {
        const campgrounds = await Campground.find({}).populate({path: 'author', populate: {path: 'user'}}).populate('author');
        const lowPriceCamp = await Campground.find({price: {$gte: 2000}}).limit(4);
        console.log(`Campgrounds length: ${campgrounds.length}`);
        console.log(`Low price length: ${lowPriceCamp.length}`);
        app.render('campground/index', {campgrounds, lowPriceCamp, currentUser: null, success: [], error: []}, (err, html) => {
            if(err) {
                console.error('RENDER ERROR', err.message);
                console.log(err.stack);
            }
            else {
                console.log('RENDER HTML LENGTH', html.length);
            }
            process.exit();
        });
    } catch(e) {
        console.error(e);
        process.exit(1);
    }
});
