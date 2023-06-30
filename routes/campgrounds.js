const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const campgroundController = require('../controllers/campgrounds');
const { isLoggedIn, authorizeChanges, validateCampground } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router
  .route('/')
  // Show all campgrounds
  .get(catchAsync(campgroundController.index))
  // Create campground
  .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgroundController.create));

// Route to the campground creation page
router.get('/new', isLoggedIn, campgroundController.showNew);

router
  .route('/:id')
  // Update a campground
  .put(isLoggedIn, authorizeChanges, upload.array('image'), validateCampground, catchAsync(campgroundController.update))
  // Route to a specific campground page
  .get(catchAsync(campgroundController.showCampground))
  // Remove a campground
  .delete(isLoggedIn, authorizeChanges, catchAsync(campgroundController.delete));

// Route to the campground edit page
router.get('/:id/edit', isLoggedIn, catchAsync(campgroundController.showEdit));

module.exports = router;
