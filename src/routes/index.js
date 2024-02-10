const express = require('express');
const router = express.Router();
const { isLoggedIn,isNotLoggedIn } = require('../middlewares/auth');

router.get('/',isNotLoggedIn, (req, res) => {
    res.render('auth/signin');
});
  

  

module.exports = router;