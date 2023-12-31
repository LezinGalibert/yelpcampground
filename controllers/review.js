const Review = require('../models/review');
const Campground = require('../models/campground');

module.exports.submitReview = async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  req.flash('success', 'Review submitted!');
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await campground.save();
  await Review.findByIdAndDelete(id);
  req.flash('success', 'Review deleted!');
  res.redirect(`/campgrounds/${id}`);
};
