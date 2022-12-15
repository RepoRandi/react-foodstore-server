const { subject } = require('@casl/ability');

const DeliveryAddress = require('./model');
const { policyFor } = require('../policy');

async function store(req, res, next) {
	let policy = policyFor(req.user);

	if (!policy.can('create', 'DeliveryAddress')) {
		return res.status(403).json({
			error: 0,
			message: `You're not allowed to perform this action`,
		});
	}

	try {
		const payload = req.body;
		const user = req.user;

		let address = new DeliveryAddress({
			...payload,
			user: user._id,
		});

		console.log(address);

		await address.save();

		res.status(201).json({
			error: 0,
			message: 'Alamat pengiriman berhasil ditambahkan',
			data: address,
		});
	} catch (err) {
		if (err && err.name === 'ValidationError') {
			return res.status(400).json({
				error: 1,
				message: err.message,
				fields: err.errors,
			});
		}

		next(err);
	}
}

async function update(req, res, next) {
	let policy = policyFor(req.user);

	try {
		let { id } = req.params;

		let { _id, ...payload } = req.body;

		let address = await DeliveryAddress.findOne({ _id: id });

		let subjectAddress = subject('DeliveryAddress', {
			...address,
			user_id: address.user,
		});

		if (!policy.can('update', subjectAddress)) {
			return res.status(403).json({
				error: 0,
				message: `You're not allowed to perform this action`,
			});
		}

		address = await DeliveryAddress.findOneAndUpdate({ _id: id }, payload, {
			new: true,
		});

		res.status(200).json({
			error: 0,
			message: 'Alamat pengiriman berhasil diubah',
			data: address,
		});
	} catch (err) {
		if (err && err.name === 'ValidationError') {
			return res.status(400).json({
				error: 1,
				message: err.message,
				fields: err.errors,
			});
		}

		next(err);
	}
}

async function destroy(req, res, next) {
	let policy = policyFor(req.user);

	try {
		let { id } = req.params;

		let address = await DeliveryAddress.findOne({ _id: id });

		let subjectAddress = subject('DeliveryAddress', {
			...address,
			user_id: address.user,
		});

		if (!policy.can('delete', subjectAddress)) {
			return res.status(403).json({
				error: 0,
				message: `You're not allowed to perform this action`,
			});
		}

		await DeliveryAddress.findOneAndDelete({ _id: id });

		res.status(200).json({
			error: 0,
			message: 'Alamat pengiriman berhasil dihapus',
			data: address,
		});
	} catch (err) {
		if (err && err.name === 'ValidationError') {
			return res.status(400).json({
				error: 1,
				message: err.message,
				fields: err.errors,
			});
		}

		next(err);
	}
}

async function index(req, res, next) {
	const policy = policyFor(req.user);

	if (!policy.can('view', 'DeliveryAddress')) {
		return res.json({
			error: 1,
			message: `You're not allowed to perform this action`,
		});
	}

	try {
		let { limit = 10, skip = 0 } = req.query;

		const count = await DeliveryAddress.find({
			user: req.user._id,
		}).countDocuments();

		const deliveryAddress = await DeliveryAddress.find({
			user: req.user._id,
		})
			.limit(parseInt(limit))
			.skip(parseInt(skip))
			.sort('-createdAt');

		return res.status(200).json({
			error: 0,
			message: 'Alamat pengiriman berhasil ditampilkan',
			data: deliveryAddress,
			count: count,
		});
	} catch (err) {
		if (err && err.name === 'ValidationError') {
			return res.status(400).json({
				error: 1,
				message: err.message,
				fields: err.errors,
			});
		}

		next(err);
	}
}

module.exports = {
	store,
	update,
	destroy,
	index,
};
