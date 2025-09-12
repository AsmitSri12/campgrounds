const Review = require('../models/review');
const Campground = require('../models/campgrounds');

module.exports.createReview = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    campground.reviews.push(newReview);
    await newReview.save();
    await campground.save();
    req.flash('success', 'New Review Created');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); //$pull is a operator in  mongoDB
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review Deleted');
    res.redirect(`/campgrounds/${id}`);
}