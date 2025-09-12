const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utilities/catchAsync');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const review = require('../controllers/review');

//Review 

router.post('/', isLoggedIn, validateReview, catchAsync(review.createReview));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(review.deleteReview));

module.exports = router;