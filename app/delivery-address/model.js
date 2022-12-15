const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const deliveryAddressSchema = Schema(
	{
		nama: {
			type: String,

			maxLength: [255, 'Panjang maksimal nama alamat 255 karakter'],
			required: [true, 'Nama alamat harus diisi'],
		},

		kelurahan: {
			type: String,
			maxLength: [255, 'Panjang maksimal kelurahan 255 karakter'],
			required: [true, 'Nama kelurahan harus diisi'],
		},

		kecamatan: {
			type: String,
			maxLength: [255, 'Panjang maksimal kecamatan 255 karakter'],
			required: [true, 'Nama kecamatan harus diisi'],
		},

		kabupaten: {
			type: String,
			maxLength: [255, 'Panjang maksimal kabupaten 255 karakter'],
			required: [true, 'Nama kabupaten harus diisi'],
		},

		provinsi: {
			type: String,
			maxLength: [255, 'Panjang maksimal provinsi 255 karakter'],
			required: [true, 'Nama provinsi harus diisi'],
		},

		detail: {
			type: String,
			maxLength: [1000, 'Panjang maksimal detail alamat 1000 karakter'],
			required: [true, 'Detail alamat harus diisi'],
		},

		user: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
	},
	{ timestamps: true }
);

module.exports = model('DeliveryAddress', deliveryAddressSchema);
