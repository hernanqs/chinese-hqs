// Search results function factory
function getSearchResultsFunctionFactory(data, hanziIdx, pinyinIdx, pinyinWODIdx, sortFunction) {
	return function (searchWord) {
		let diacriticsRegExp = /[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/i;

		let searchWordLower = searchWord.toLowerCase().replace(/\s/g, '');

		let searchResults = []

		// Check if search word is hanzi
		if (hanziIdx[searchWord]) {
			searchResults = hanziIdx[searchWord];
		}
		// Check if search word is hanzi and had a redundant entry in the index (an entry whose
		// only listed word was the entry key itself), in this case the entry was removed from
		// the index (to reduce index size) and we have to check directly in the data
		else if (data[searchWord]) {
			searchResults = [ data[searchWord]['simplified'] || data[searchWord]['s'] ];
		}
		// Check if search word is pinyin with tone marks
		else if (diacriticsRegExp.test(searchWord) && pinyinIdx[searchWordLower]) {
			searchResults = pinyinIdx[searchWordLower];
		}
		// Check if search word is pinyin without tone marks
		else if (pinyinWODIdx[searchWordLower]) {
			// Join results from every pinyin with tones (in pinyinIdx) for the
			// pinyin without tone marks
			searchResults = pinyinWODIdx[searchWordLower].reduce(
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
function sortBySimpLength(a, b) {
	return a.length - b.length;
}

// Search results functions
// Take a search word in pinyin or hanzi
// Return the results of the search as a list of string that are keys in hanziDict
// or cedict
let getHanziSearchResults = getSearchResultsFunctionFactory(hanziDict, {}, pinyinIndex,
	pinyinWODIndex, sortByMostCommon);  // Hanzi index is an empty object because it would
										// have only redundant entries (entries where every
										// hanzi points only to itself)
let getCedictSearchResults = getSearchResultsFunctionFactory(cedict, cedictWordIndex,
	cedictPinyinIndex, cedictPinyinWODIndex, sortBySimpLength);


