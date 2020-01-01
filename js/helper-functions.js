'use strict';

// Get hash Parameters and return them in an object
function getHashParams() {
	// Get a string containing the hash parameters 
	let paramsString = window.location.href.split('#')[1];

	// If there are not hash parameters, return an empty object
	if (!paramsString) {
		return {};
	}
	// Split the string containg the hash parameters into
	// key-value pairs
	let pairs = paramsString.split('&');

	// Create an object containing the hash parameters and return it
	let paramsObj = {};
	for (let i = 0; i < pairs.length; i++) {
		let pair = pairs[i].split('=');
		paramsObj[pair[0]] = decodeURIComponent(pair[1]);
	}
	return paramsObj;
}


// Function for displaying a message to the user when an error occurs, which
// may be because the browser does not support ES6+
function displayErrorMessage() {
	alert(
		`An error has ocurred.
It may be because your browser does not support some of the latest web technologies.
Please try using an updated version of Firefox or Chrome.`
	);
}
