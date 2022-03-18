const express = require('express');
const router = express.Router();
const Certification = require('../core/userCertification');
const BoardCtrl = require('../controllers/boardController');
const CommnetCtrl = require('../controllers/commentController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* Board */
router.post('/board', Certification.login_required, BoardCtrl.addBoard)

/* Comment */
router.get('/comment/:id', Certification.login_required, CommnetCtrl.getComment)
router.post('/comment', Certification.login_required, CommnetCtrl.addComment)

module.exports = router;
