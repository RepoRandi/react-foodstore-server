const csv = require('csvtojson');
const path = require('path');

async function getProvinsi(_req, res, _next) {
	const db_provinsi = path.resolve(__dirname, './data/provinces.csv');

	try {
		const data = await csv().fromFile(db_provinsi);

		return res.status(200).json({
			error: 0,
			status: 'success',
			data: data,
		});
	} catch (err) {
		return res.status(500).json({
			error: 1,
			status: 'error',
			message:
				'Tidak bisa mengambil data provinsi, hubungi administrator',
		});
	}
}

async function getKabupaten(req, res, _next) {
	const db_kabupaten = path.resolve(__dirname, './data/regencies.csv');

	try {
		let { kode_induk } = req.query;
		const data = await csv().fromFile(db_kabupaten);

		if (!kode_induk)
			return res.status(200).json({
				error: 0,
				status: 'success',
				data: data,
			});

		return res.status(200).json({
			error: 0,
			status: 'success',
			data: data.filter(
				(kabupaten) => kabupaten.kode_provinsi === kode_induk
			),
		});
	} catch (err) {
		return res.status(500).json({
			error: 1,
			status: 'error',
			message:
				'Tidak bisa mengambil data kabupaten, hubungi administrator',
		});
	}
}

async function getKecamatan(req, res, _next) {
	const db_kecamatan = path.resolve(__dirname, './data/districts.csv');

	try {
		let { kode_induk } = req.query;
		const data = await csv().fromFile(db_kecamatan);

		if (!kode_induk)
			return res.status(200).json({
				error: 0,
				status: 'success',
				data: data,
			});

		return res.status(200).json({
			error: 0,
			status: 'success',
			data: data.filter(
				(kecamatan) => kecamatan.kode_kabupaten === kode_induk
			),
		});
	} catch (err) {
		return res.status(500).json({
			error: 1,
			status: 'error',
			message:
				'Tidak bisa mengambil data kecamatan, hubungi administrator',
		});
	}
}

async function getKelurahan(req, res, _next) {
	const db_kelurahan = path.resolve(__dirname, './data/villages.csv');

	try {
		let { kode_induk } = req.query;
		const data = await csv().fromFile(db_kelurahan);

		if (!kode_induk)
			return res.status(200).json({
				error: 0,
				status: 'success',
				data: data,
			});

		return res.status(200).json({
			error: 0,
			status: 'success',
			data: data.filter(
				(kelurahan) => kelurahan.kode_kecamatan === kode_induk
			),
		});
	} catch (err) {
		return res.status(500).json({
			error: 1,
			status: 'error',
			message:
				'Tidak bisa mengambil data kelurahan, hubungi administrator',
		});
	}
}

module.exports = {
	getProvinsi,
	getKabupaten,
	getKecamatan,
	getKelurahan,
};
