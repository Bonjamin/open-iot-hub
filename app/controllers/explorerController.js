const User = require('../models/user');
const Data = require('../models/data');

exports.index = (req, res) => {
  (async() => {
    const data = await Data.find({userId: req.session.userId}).sort({createdAt: -1}).limit(10).exec();
    res.render('explorer/index', {breadcrumb: 1, data: (data || [])});
  })();
}

// exports.show = (req, res) => {
//   (async() => {
//     const data =await Data.findOne({_id: req.params.dataId});
//     res.render('exporoer/show', {breadcrumb: 1, data: data});
//   })();
// }