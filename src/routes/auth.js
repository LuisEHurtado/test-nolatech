const express = require('express');
const router = express.Router();
const passport = require('passport');
const { isLoggedIn,isNotLoggedIn } = require('../middlewares/auth');
const { validationResult } = require('express-validator');
const { signinValidator, signupValidator } = require("../controllers/validators/validator");


/** RUTAS PARA LAS VISTAS ***/
router.get('/signup',isNotLoggedIn, (req, res) => {
    res.render('auth/signup');
});

router.get('/profile', isLoggedIn, (req, res) => {
  res.render('profile');
});



/* CREAR CUENTA */
router.post('/signup',signupValidator, (req, res, next) => {
  const errorsSignup = validationResult(req)
  if (!errorsSignup.isEmpty()) {
    req.flash('message', errorsSignup.errors[0].msg);
    res.redirect('/signup');
  }else{
    passport.authenticate('local.signup', {
      successRedirect: '/users',
      failureRedirect: '/signup',
      failureFlash: true
    })(req, res, next);
  }
  
  
});

/* INICIAR SESION */
router.post('/signin',signinValidator, (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    req.flash('message', errors.errors[0].msg);
    res.redirect('/');
  }else{
    passport.authenticate('local.signin', {
      successRedirect: '/users',
      failureRedirect: '/',
      failureFlash: true
    })(req, res, next);
  }
  
  
});

/* CERRAR SESION */
router.post('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});


module.exports = router;