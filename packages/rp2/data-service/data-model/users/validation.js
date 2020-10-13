const validator = require('validator');
const { validate } = require('graphql');
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
const validateUsername = inputUsername => {
	if (typeof inputUsername !== 'string') {
		return { error: invalidTypes };
	}
	let username = inputUsername.toLowerCase();
	const isAlpha = validator.isAlphanumeric(username);
	if (!isAlpha) return { error: alpheNumericError };
	const isLength = validator.isLength(username, characterRequirements.username);
	if (!isLength) return { error: lengthError('username') };
	return username;
};
const validatePassword = inputPassword => {
	let password;

	if (
		inputPassword == '' ||
		inputPassword == null ||
		inputPassword == false ||
		typeof inputPassword == 'undefined'
	) {
		password = false;
		return password;
	}
	password = inputPassword;
	if (typeof password !== 'string') {
		return { error: invalidTypes };
	}
	const isPasswordLength = validator.isLength(
		password,
		characterRequirements.password
	);
	if (!isPasswordLength) return { error: lengthError('password') };
	return password;
};
const validateUsernamePassword = (inputUsername, inputPassword) => {
	return {
		username: inputUsername ? validateUsername(inputUsername) : false,
		password: validatePassword(inputPassword)
	};
};

exports.validateUsernamePassword = validateUsernamePassword;
