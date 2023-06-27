const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { campgroundSchema } = require('../schema');

const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');


// Validation middleware
const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body); // Uses Joi
  if (error) {
    const msg = error.details.map((el) => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

// Show all campgrounds
router.get(
  '/',
  catchAsync(async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render('./campgrounds/index.ejs', { campgrounds });
  }),
);

// Update a campground
router.put(
  '/:id',
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'Campground updated!');
    res.redirect(`/campgrounds/${campground._id}`);
  }),
);

// Route to the campground edit page
router.get(
  '/:id/edit',
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
  }),
);

// Route to the campground creation page
router.get('/new', (req, res) => {
  res.render('campgrounds/new');
});

// Create campground
router.post(
  '/',
  validateCampground,
  catchAsync(async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash('success', 'Campground created!');
    res.redirect(`campgrounds/${campground._id}`);
  }),
);

// Route to a specific campground page
router.get(
  '/:id',
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    // Populates allows mongoose to display the content of each review object (only referenced by their id in the reviews array)
    if (!campground) {
      req.flash('error', 'Cannot find that campground!');
      return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
  }),
);

// Remove a campground
router.delete(
  '/:id',
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
  }),
);

module.exports = router;
