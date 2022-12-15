const { subject } = require('@casl/ability');

const Invoice = require('./model');
const { policyFor } = require('../policy');

async function show(req, res, _next) {
	try {
		let { order_id } = req.params;

		let invoice = await Invoice.findOne({ order: order_id })
			.populate('order')
			.populate('user');

		let policy = policyFor(req.user);

		let subjectInvoice = subject('Invoice', {
			...invoice,
			user_id: invoice.user._id,
		});

		if (!policy.can('read', subjectInvoice)) {
			return res.status(403).json({
				error: 1,
				message: `Anda tidak memiliki akses untuk melihat invoice ini.`,
			});
		}

		return res.status(200).json({
			error: 0,
			message: 'Berhasil mengambil invoice.',
			data: invoice,
		});
	} catch (err) {
		return res.status(500).json({
			error: 1,
			message: `Error when getting invoice.`,
		});
	}
}

module.exports = {
	show,
};
