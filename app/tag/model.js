const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const tagSchema = Schema({
	name: {
		type: String,
		minLength: [3, 'Panjang nama tag minimal 3 karakter'],
		maxLength: [20, 'Panjang nama tag maksimal 20 karakter'],
		required: [true, 'Nama tag harus diisi'],
	},
});

module.exports = model('Tag', tagSchema);
