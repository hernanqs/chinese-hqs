'use strict';
// Search results function factory
function getSearchResultsFunctionFactory(data, hanziIdx, pinyinIdx, pinyinWODIdx, sortFunction) {
	return function (searchText) {
		let diacriticsRegExp = /[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/i;

		let searchTextLower = searchText.toLowerCase().replace(/\s/g, '');

		let searchResults = []

		// Check if search word is hanzi
		if (hanziIdx[searchText]) {
			searchResults = hanziIdx[searchText];
		}
		// Check if search word is hanzi and had a redundant entry in the index (an entry whose
		// only listed word was the entry key itself), in this case the entry was removed from
		// the index (to reduce index size) and we have to check directly in the data
		else if (data[searchText]) {
			searchResults = [ data[searchText]['simplified'] || data[searchText]['s'] ];
		}
		// Check if search word is pinyin with tone marks
		else if (diacriticsRegExp.test(searchText) && pinyinIdx[searchTextLower]) {
			searchResults = pinyinIdx[searchTextLower];
		}
		// Check if search word is pinyin without tone marks
		else if (pinyinWODIdx[searchTextLower]) {
			// Join results from every pinyin with tones (in pinyinIdx) for the
			// pinyin without tone marks
			searchResults = pinyinWODIdx[searchTextLower].reduce(
				(acc, curr) => {
					return acc.concat(pinyinIdx[curr])
				}, []);
			// Avoid duplicate results when a hanzi in most common hanzi has more
			// than one pinyin or when a cedict word has two syllables with the
			// same pinyin
			searchResults = [... new Set(searchResults)];

			// Sort results
			searchResults.sort(sortFunction);
		}

		return searchResults;
	}

}

// Functions to sort search results, hanzi results will be sort from most common to least
// common hanzi, cedict entries will be sort from shorter words to longer words (or phrases)
function sortByMostCommon(a, b) {
	return hanziDict[a]['mostCommonRanking'] - hanziDict[b]['mostCommonRanking'];
}
function sortByLength(a, b) {
	return a.length - b.length;
}

// Search results functions
// Take a search word in pinyin or hanzi
// Return the results of the search as a list of string that are keys in hanziDict
// or cedict
var getHanziSearchResults = getSearchResultsFunctionFactory(hanziDict, {}, pinyinIndex,
	pinyinWODIndex, sortByMostCommon);  // Hanzi index is an empty object because it would
										// have only redundant entries (entries where every
										// hanzi points only to itself)
var getCedictSearchResults = getSearchResultsFunctionFactory(cedict, cedictWordIndex,
	cedictPinyinIndex, cedictPinyinWODIndex, sortByLength);


// Function factory to make the english search results functions
function getEnglishSearchResultsFunctionFactory(data, idx, sortFunction) {
	return function (searchText) {
		let searchTextLower = searchText.toLowerCase();

		let searchResults = []

		// If there is more than one word in the text to search
		if (/\s/.test(searchText)) {
			// Split text into the different words
			let searchWords = searchText.split(' ');
			let resultsPerWord = [];
			// Get search results for every individual word
			for (word of searchWords) {
				// Check if search word is in index
				if (idx[word]) {
					resultsPerWord.push(idx[word]);
				} else {
					resultsPerWord.push([]);
				}
			}
			// The search results will be the intersection of the results of the 
			// individual words (the entries were all words appear)
			searchResults = resultsPerWord.reduce((acc, cur) => {
				return acc.filter(el => cur.includes(el));
			});
		}
		// Else if search text is a single word, check if search word is in index
		else {
			if (idx[searchTextLower]) {
				searchResults = idx[searchTextLower];
			}
		}

		// Sort results
		searchResults.sort(sortFunction);

		return searchResults;
	}
}

// English search results functions
var getHanziEnglishSearchResults = getEnglishSearchResultsFunctionFactory(cedict, hanziEnglishIndex, sortByMostCommon);
var getCedictEnglishSearchResults = getEnglishSearchResultsFunctionFactory(cedict, cedictEnglishIndex, sortByLength);


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