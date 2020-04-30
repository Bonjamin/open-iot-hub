const User = require('../models/user');
const Map = require('../models/map');
const Data = require('../models/data');

function getData(body, location) {
  const keys = location.split('.');
  let data = body;
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    data = data[key];
    if (!data) {
      return null;
    }
  }
  return data;
}

function mapping(body, maps) {
  let ret = {};
  for (let i = 0; i < maps.length; i++) {
    const map = maps[i];
    const data = getData(body, map.location);
    let value = 0;
    for (let j = 0; j < map.length; j++) {
      const start = (map.start + j) * 2;
      const bytechar = data.substring(start, start + 2);
      const byte = parseInt(bytechar, 16);
      if (map.littleEndian) {
        value += byte * (256 ** j);
      } else {
        value += byte * (256 ** (map.length - 1 - j))
      }
    }
    const uintmax = 256 ** map.length
    if (!map.unsigned && value > (uintmax / 2)) {
      value -= uintmax;
    }
    ret[map.label] = value;
  }
  return ret;
}

exports.index = (req, res) => {
  (async() => {
    const apiKey = req.header('x-api-key');
    let user;
    if (apiKey) {
      user = await User.findOne({apiKey: apiKey});
    }
    if (!user) {
      res.status(400).json({message:"bad request"});
      return;
    }
    
    if (req.body && Object.keys(req.body).length > 0) {
      res.json({message:'ok'});

      let data = {userId: user._id, payload: req.body};

      if (user.deviceIdLocation) {
        const deviceId = getData(req.body, user.deviceIdLocation);
        if (deviceId) {
          data.deviceId = deviceId;
        }
      }

      let maps = await Map.find({userId: user._id});
      if (maps && maps.length > 0) {
        const mapData = mapping(req.body, maps);
        data.data = mapData;
      }
      const result = await Data.create(data);
    } else {
      res.status(400).json({message:'no data'});
    }
  })();
}