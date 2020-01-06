const writeFile = txt => {
	const writefiledir = path.join(__dirname, 'history');
	const time = new moment().format('MMMM Do YYYY, h:mm:ss a');
	console.log(time);
	// console.log(time.toTimeString({ hour12: true }))
	const formattedText = `
        Started: ${time}
        ${txt}

    `;
	fs
		.appendFile(writefiledir, formattedText, 'utf8')
		.then(res => {
			console.log('done writing!');
		})
		.catch(e => {
			console.log('Error writing file', e);
		});
};

module.exports = writeFile;
