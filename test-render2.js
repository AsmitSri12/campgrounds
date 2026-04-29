const express=require('express');
const ejsMate=require('ejs-mate');
const path=require('path');
const mongoose=require('mongoose');
const fs=require('fs');
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
        app.render('campground/index', {campgrounds, lowPriceCamp, currentUser: null, success: [], error: []}, (err, html) => {
            if(err) {
                console.error('RENDER ERROR', err.message);
            }
            else {
                fs.writeFileSync('test-output.html', html);
                console.log('Written to test-output.html');
            }
            process.exit();
        });
    } catch(e) {
        console.error(e);
        process.exit(1);
    }
});
