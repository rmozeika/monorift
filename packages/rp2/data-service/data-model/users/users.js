const validator = require('validator');
const characterRequirements = {
	username: { min: 3, max: 20 },
	password: { min: 5, max: 20 }
};

const invalidTypes =
	'Username and password need to be sent in normal characters';
const alpheNumericError =
	'Only alphanumeric characters can be used in usernames';
const lengthError = (type = 'username') =>
	`${type} must be between 3 and 20 characters`;
const validateUsernamePassword = (inputUsername, password) => {
	if (typeof inputUsername !== 'string' || typeof password !== 'string') {
		return { error: invalidTypes };
	}
	let username = inputUsername.toLowerCase();
	const isAlpha = validator.isAlphanumeric(username);
	if (!isAlpha) return { error: alpheNumericError };
	const isLength = validator.isLength(username, characterRequirements.username);
	if (!isLength) return { error: lengthError('username') };
	const isPasswordLength = validator.isLength(
		password,
		characterRequirements.password
	);
	// REACTIVATE PRODUCTION
	// if (!isPasswordLength) return { error: lengthError('password') };
	return { username, password };
};

exports.validateUsernamePassword = validateUsernamePassword;
