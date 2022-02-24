const express = require('express');
const router = express.Router();
const UserCtrl = require('../controllers/userController');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* User */
router.post('/signup', UserCtrl.signUp)
router.post('/signin', UserCtrl.signIn)
router.post('/emailcheck', UserCtrl.checkEmail)
router.post('/usernamecheck', UserCtrl.checkUsername)

module.exports = router;
