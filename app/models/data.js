const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Data = new Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  deviceId: String,
  payload: {
    type: Map,
    required: true
  },
  data: Map
}, {timestamps: {createdAt: 'createdAt', updatedAt: 'updatedAt'}});

module.exports = mongoose.model('Data', Data);