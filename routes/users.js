const express = require('express');
const router = express.Router();
const UserCtrl = require('../controllers/userController');
const Certification = require('../core/userCertification');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* User */
router.post('/signup', UserCtrl.signUp)
router.post('/signin', UserCtrl.signIn)
router.post('/emailcheck', UserCtrl.checkEmail)
router.post('/usernamecheck', UserCtrl.checkUsername)
router.post('/follow', Certification.login_required, UserCtrl.addFollow)
router.post('/follow_list', UserCtrl.getFollow)
router.post('/follower_list', UserCtrl.getFollower)

module.exports = router;
