import Quill from "./quill/quill.js"

var quill = new Quill('#editor', {
	modules: {
		syntax: true,
		toolbar: '#toolbar'
	},
//        modules: {toolbar: [ [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
//          [{ 'header': [1, 2, 3, 4, 5, 6, false] }]]},

	formula: true,
	formats: {
		'code': true
	},
	// debug:'log',


	placeholder: 'Compose an epic...',
	theme: 'snow'
});

document.querySelector('#get').addEventListener('click', function () {
	var delta = quill.getSemanticHTML();
	console.log(delta)
}, false);