const passport = require('passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require('../user/model');
const config = require('../config');
const { getToken } = require('../utils/get-token');

async function localStrategy(email, password, done) {
	try {
		let user = await User.findOne({ email }).select(
			'-__v -createdAt -updatedAt -cart_items -token'
		);

		if (!user) return done();

		if (bcrypt.compareSync(password, user.password)) {
			({ password, ...userWithoutPassword } = user.toJSON());

			return done(null, userWithoutPassword);
		}
	} catch (err) {
		done(err, null);
	}

	done();
}

async function register(req, res, next) {
	try {
		const payload = req.body;

		const user = await User(payload);

		await user.save();

		return res.status(201).json({
			error: 0,
			message: 'User berhasil dibuat',
			data: user,
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

async function login(req, res, next) {
	passport.authenticate('local', async function (err, user) {
		if (err) return next(err);

		if (!user)
			return res
				.status(401)
				.json({ error: 1, message: 'Email atau password salah' });

		let signed = jwt.sign(user, config.secretKey);

		await User.findOneAndUpdate(
			{ _id: user._id },
			{ $push: { token: signed } },
			{ new: true }
		);

		return res.status(200).json({
			error: 0,
			message: 'Login berhasil',
			data: {
				user: user,
				token: signed,
			},
		});
	})(req, res, next);
}

function me(req, res, _next) {
	if (!req.user)
		return res.status(401).json({
			error: 1,
			message: `You're not logged in or your session has expired`,
		});

	return res.status(200).json({
		error: 0,
		message: 'User berhasil diambil',
		data: req.user,
	});
}

async function logout(req, res, next) {
	try {
		let token = getToken(req);

		let user = await User.findOneAndUpdate(
			{ token: { $in: [token] } },
			{ $pull: { token } },
			{ userFindAndModify: false }
		);

		if (!user || !token) {
			return res.status(401).json({
				error: 1,
				message: 'User tidak ditemukan',
			});
		}

		return res.status(200).json({
			error: 0,
			message: 'Logout berhasil',
		});
	} catch (err) {
		next(err);
	}
}

module.exports = {
	register,
	localStrategy,
	login,
	me,
	logout,
};
