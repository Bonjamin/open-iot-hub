
const User = require('../models/user');
const Map = require('../models/map');

exports.index = (req, res) => {
  if (req.session.userId) {
    res.redirect('/dashboard');
    return;
  }
  res.render('index/index');
}

exports.dashboard = (req, res) => {
  res.render('index/dashboard');
}

exports.info = (req, res) => {
  User.findOne({_id: req.session.userId}, (error, result) => {
    res.render('index/info', {breadcrumb: 1, user: result, req: req});
  });
}

exports.map = (req, res) => {
  // https://qiita.com/yukin01/items/1a36606439123525dc6d
  (async() => {
    let deviceIdLocation = req.body && req.body.deviceIdLocation;
    let maps = [];

    if (deviceIdLocation) {
      const result = await User.updateOne({_id: req.session.userId}, {deviceIdLocation: req.body.deviceIdLocation});
      res.redirect('/map');
      return;
    }

    if (req.body && req.body.location && req.body.location.length > 1) {
      for (let i = 0; i < req.body.location.length; i++) {
        const location = req.body.location[i];
        const start = req.body.start[i];
        const length = req.body.length[i];
        const littleEndian = req.body.littleEndian[i] == '1';
        const unsigned = req.body.unsigned[i] == '1';
        const label = req.body.label[i];

        if (!(location && start && length && label)) {
          continue;
        }
        maps.push({
          userId: req.session.userId,
          location: location,
          start: start,
          length: length,
          littleEndian: littleEndian,
          unsigned: unsigned,
          label: label
        });
      }
      let result = await Map.deleteMany({userId: req.session.userId});
      result = await Promise.all(maps.map(async (v) => await Map.create(v)));
      res.redirect('/map');
      return;
    }

    const user = await User.findOne({_id: req.session.userId});
    deviceIdLocation = user.deviceIdLocation || "";
    maps = await Map.find({userId: req.session.userId}).sort({start: 1}).exec();
  
    res.render('index/map', {breadcrumb: 1, deviceIdLocation: deviceIdLocation, maps: maps});
  })();
}