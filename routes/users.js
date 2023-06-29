const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const { storeReturnTo } = require('../middleware');
const userController = require('../controllers/users');

router.get('/register', (req, res) => {
  res.render('auth/register');
});

router.post('/register', catchAsync(userController.register));

router.get('/login', (req, res) => {
  res.render('auth/login');
});

router.post(
  '/login',
  storeReturnTo,
  passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/login',
  }),
  userController.login,
);

router.get('/logout', userController.logout);

module.exports = router;
