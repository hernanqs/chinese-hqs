// Search results functions
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

function sortByMostCommon(a, b) {
	return hanziDict[a]['mostCommonRanking'] - hanziDict[b]['mostCommonRanking'];
}

function sortBySimpLength(a, b) {
	return a.length - b.length;
}

let getHanziSearchResults = getSearchResultsFunctionFactory(hanziDict, {}, pinyinIndex,
	pinyinWODIndex, sortByMostCommon);
let getCedictSearchResults = getSearchResultsFunctionFactory(cedict, cedictWordIndex,
	cedictPinyinIndex, cedictPinyinWODIndex, sortBySimpLength);


