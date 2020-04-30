const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const hashHelper = require('../helpers/hashHelper');

const User = new Schema({
	email: {
		type: String,
		unique: true,
		required: true
	},
	password: {
    type: String,
    required: true,
    set: v => hashHelper.hash(v)
	},
	apiKey: {
		type: String,
		unique: true
	},
	apiSecret: {
		type: String,
		unique: true
	},
	deviceIdLocation: String
}, {timestamps: {createdAt: 'createdAt', updatedAt: 'updatedAt'}});

module.exports = mongoose.model('User', User);