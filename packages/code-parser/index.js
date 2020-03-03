const babel = require('@babel/parser');
const textract = require('textract');
const fileName = './App.js';
const Class = require('./parse.class');
const File = require('./parse.file');
const Program = require('./parse.program');
module.exports = {
	Class,
	File,
	Program
};
