const express = require('express');
const router = express.Router();
const Certification = require('../core/userCertification');
const UserCtrl = require('../controllers/boardController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* Board */
router.post('/board', Certification.login_required, UserCtrl.addBoard)

module.exports = router;
