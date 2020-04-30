const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Map = new Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
	location: {
		type: String,
		required: true
	},
	start: {
    type: Number,
    required: true
	},
	length: {
		type: Number,
		required: true
	},
	littleEndian: {
		type: Boolean,
		required: true
	},
	unsigned: {
    type: Boolean,
    required: true
  },
  label: {
    type: String,
    required: true
  }
}, {timestamps: {createdAt: 'createdAt', updatedAt: 'updatedAt'}});

module.exports = mongoose.model('Map', Map);