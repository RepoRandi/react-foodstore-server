const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const bcrypt = require('bcrypt');

const { Schema, model } = mongoose;

const HASH_ROUND = 10;

let userSchema = new Schema(
	{
		full_name: {
			type: String,
			minLength: [3, 'Panjang nama harus antara 3 - 255 karakter'],
			maxLength: [255, 'Panjang nama harus antara 3 - 255 karakter'],
			required: [true, 'Nama harus diisi'],
		},

		customer_id: {
			type: Number,
		},

		email: {
			type: String,
			maxLength: [255, 'Panjang email maksimal 255 karakter'],
			required: [true, 'Email harus diisi'],
		},

		password: {
			type: String,
			minLength: [8, 'Panjang password minimal 8 karakter'],
			maxLength: [255, 'Panjang password maksimal 255 karakter'],
			required: [true, 'Password harus diisi'],
		},

		role: {
			type: String,
			enum: ['admin', 'user'],
			default: 'user',
		},

		token: [String],
	},

	{ timestamps: true }
);

userSchema.path('email').validate(
	(value) => {
		const emailRE = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

		return emailRE.test(value);
	},
	(attr) => `${attr.value} harus merupakan email yang valid!`
);

userSchema.path('email').validate(
	async function (value) {
		try {
			const count = await this.model('User').count({ email: value });

			return !count;
		} catch (err) {
			throw new Error(err);
		}
	},
	(attr) => `Email ${attr.value} sudah terdaftar!`
);

userSchema.pre('save', function (next) {
	this.password = bcrypt.hashSync(this.password, HASH_ROUND);
	next();
});

userSchema.plugin(AutoIncrement, { inc_field: 'customer_id' });

module.exports = model('User', userSchema);
