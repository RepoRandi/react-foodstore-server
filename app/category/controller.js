const Category = require('./model');
const { policyFor } = require('../policy');

async function store(req, res, next) {
	let policy = policyFor(req.user);

	if (!policy.can('create', 'Category')) {
		return res.json({
			error: 1,
			message: `Anda tidak memiliki akses untuk membuat kategori`,
		});
	}

	try {
		let payload = req.body;

		let category = new Category(payload);

		await category.save();

		res.status(200).json({
			error: 0,
			message: 'Category created',
			data: category,
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

	if (!policy.can('update', 'Category')) {
		return res.json({
			error: 1,
			message: `Anda tidak memiliki akses untuk mengupdate kategori`,
		});
	}

	try {
		let payload = req.body;
		const _id = req.params.id;

		let category = await Category.findOneAndUpdate({ _id }, payload, {
			new: true,
			runValidators: true,
		});

		res.status(200).json({
			error: 0,
			message: 'Category updated',
			data: category,
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

	if (!policy.can('delete', 'Category')) {
		return res.json({
			error: 1,
			message: `Anda tidak memiliki akses untuk menghapus kategori`,
		});
	}

	try {
		const _id = req.params.id;

		let category = await Category.findById({ _id });

		if (!category) {
			return res.status(404).json({
				error: 1,
				message: 'Category not found',
			});
		} else {
			await Category.findByIdAndDelete(_id);

			res.status(200).json({
				error: 0,
				message: 'Category deleted',
				data: category,
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
