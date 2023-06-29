const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const reviewController = require('../controllers/review');
const { isLoggedIn, validateReview } = require('../middleware');

// Create and post a review
router.post('/', isLoggedIn, validateReview, catchAsync(reviewController.submitReview));

// Delete a review
router.delete('/:reviewId', isLoggedIn, catchAsync(reviewController.deleteReview));

module.exports = router;
