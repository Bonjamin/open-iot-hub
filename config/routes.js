const express = require('express');
const router = express.Router();

const checkUser = (req,res,next) => {
  if (req.session && req.session.userId) {
    next();
  } else {
    res.redirect('/users/login');
  }
};

const indexController = require('../app/controllers/indexController');
router.get('/', indexController.index);
router.get('/dashboard', checkUser, indexController.dashboard);
router.get('/info', checkUser, indexController.info);
router.use('/map', checkUser, indexController.map);

const usersController = require('../app/controllers/usersController');
router.use('/users/new', usersController.new);
router.use('/users/login', usersController.login);
router.use('/users/logout', usersController.logout);

const explorerController = require('../app/controllers/explorerController');
router.get('/explorer', checkUser, explorerController.index);

const importController = require('../app/controllers/importController');
router.post('/import', importController.index);

module.exports = router;