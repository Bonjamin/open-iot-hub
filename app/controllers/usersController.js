const User = require('../models/user');
const hashHelper = require('../helpers/hashHelper')

exports.new = (req, res) => {
  if (req.body.email && req.body.password) {
    const apiKey = hashHelper.hash('key' + Math.random() + Date.now, process.env.API_KEY_SECRET);
    const apiSecret = hashHelper.hash('secret' + Math.random() + Date.now, process.env.API_SECRET_SECRET);
    User.create({
      email: req.body.email,
      password: req.body.password,
      apiKey: apiKey,
      apiSecret, apiSecret
    }, error => {
      if (!error) {
        res.redirect('/users/login')
        return;
      }
    });
    return;
  }
  res.render('users/new');
}

exports.login = (req, res) => {
  if (req.body.email && req.body.password) {
    User.findOne({email: req.body.email, password: req.body.password}, (error, result) => {
      if (result.email === req.body.email) {
        req.session.userId = result._id
        res.redirect('/dashboard');
        return;
      }
      res.redirect('/');
    });
    return;
  }
  res.render('users/login');
}

exports.logout = (req, res) => {
  if (req.session) {
    req.session.destroy();
  }
  res.redirect('/');
}