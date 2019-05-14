var path = require("path");

module.exports = {
	entry: './demo.js',
	output: {
		path: path.resolve(__dirname, './'),
		filename: 'quill.js'
	},
	devtool:'cheap-module-eval-source-map '
};