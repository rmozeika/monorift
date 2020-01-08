const moment = require('moment');
const util = require('util');
const fs = require('fs').promises;

const writeFile = (path, data) => {
	// const writefiledir = path.join(__dirname, 'history');
	const time = new moment().format('MMMM Do YYYY, h:mm:ss a');
	console.log(time);
	let writeData;
	if (typeof data == 'string') {
		writeData = data;
	} else {
		writeData = util.inspect(
			{ ...data },
			{ depth: null, showHidden: false, colors: true }
		);
	}
	// console.log(time.toTimeString({ hour12: true }))
	const formattedText = `
        Started: ${time}
        ${writeData}

    `;
	fs
		.appendFile(path, formattedText, 'utf8')
		.then(res => {
			console.log('done writing!');
		})
		.catch(e => {
			console.log('Error writing file', e);
		});
};

module.exports = writeFile;
