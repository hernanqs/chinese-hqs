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


class Link {
    constructor(baseURL, newTab=false) {
        this.baseURL = baseURL;
        this.newTab = newTab;
    }
    get(path, text='') {
        return `<a href="${ this.baseURL + path }"${ (this.newTab? ' target="_blank"' : '') }>${ text || path }</a>`;
    }
}

var wiktionaryLink = new Link('https://en.wiktionary.org/wiki/', true);
var hanziLink = new Link('#type=hanzi&value=');
var radicalLink = new Link('#type=radical&value=');
var searchLink = new Link('#type=search&value=');
var hskLevelLink = new Link('#type=hsk&value=');
var listLink = new Link('#type=list&value=');
var cedictEntryLink = new Link('#type=cedict-entry&value=');

// Takes a character in a string.
// Returns true if the character is a hanzi, else returns false.
function isHanzi(char) {
	return !/[a-zA-Z0-9\s,，.:·]/.test(char);
}

// Takes a string with a chinese word (or phrase)
// Returns a string with all hanzi characters converted in links (anchor HTML elements) to
// the search results page for that hanzi
function getHanziLinksFromWord(word) {
	let result = '';
	for (let char of word) {
		// If character is a hanzi add link to search results page for that
		// hanzi, else add character
		if (isHanzi(char)) {
			result += hanziLink.get(char);
		} else {
			result += char;
		}
	}
	return result;
}
