const Tag = require('./model');
const { policyFor } = require('../policy');

async function store(req, res, next) {
	let policy = policyFor(req.user);

	if (!policy.can('create', 'Tag')) {
		return res.json({
			error: 1,
			message: `Anda tidak memiliki akses untuk membuat tag`,
		});
	}

	try {
		let payload = req.body;

		let tag = new Tag(payload);

		await tag.save();

		res.status(200).json({
			error: 0,
			message: 'Tag created',
			data: tag,
		});
	} catch (err) {
		if (err && err.name === 'ValidationError') {
			res.status(400).json({
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

	if (!policy.can('update', 'Tag')) {
		return res.json({
			error: 1,
			message: `Anda tidak memiliki akses untuk mengupdate tag`,
		});
	}

	try {
		let payload = req.body;
		const _id = req.params.id;

		let tag = await Tag.findOneAndUpdate({ _id }, payload, {
			new: true,
			runValidators: true,
		});

		res.status(200).json({
			error: 0,
			message: 'Tag updated',
			data: tag,
		});
	} catch (err) {
		if (err && err.name === 'ValidationError') {
			res.status(400).json({
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

	if (!policy.can('delete', 'Tag')) {
		return res.json({
			error: 1,
			message: `Anda tidak memiliki akses untuk menghapus tag`,
		});
	}

	try {
		const _id = req.params.id;

		let tag = await Tag.findById({ _id });

		if (!tag) {
			return res.status(404).json({
				error: 1,
				message: 'Tag not found',
			});
		} else {
			await Tag.findByIdAndDelete(_id);

			res.status(200).json({
				error: 0,
				message: 'Tag deleted',
				data: tag,
			});
		}
	} catch (err) {
		next(err);
	}
}

module.exports = {
	store,
	update,
	destroy,
};
