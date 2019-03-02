searchWord = decodeURIComponent(getURLParams().search);

diacriticsRegExp = /[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/i;

searchResults = []

if (hanziIndex[searchWord]) {
	searchResults = hanziIndex[searchWord];
}
else if (diacriticsRegExp.test(searchWord) && pinyinIndex[searchWord]) {
	// console.log(pinyinIndex[searchWord]);
	searchResults = pinyinIndex[searchWord];
}
else if (pinyinWODIndex[searchWord]) {
	searchResults = pinyinWODIndex[searchWord];
}


cedictSearchResults = []

if (cedictWordIndex[searchWord]) {
	cedictSearchResults = cedictWordIndex[searchWord];
	console.log(cedictSearchResults);
}
else if (diacriticsRegExp.test(searchWord) && cedictPinyinIndex[searchWord]) {
	// console.log(pinyinIndex[searchWord]);
	cedictSearchResults = cedictPinyinIndex[searchWord];
	console.log(cedictSearchResults);
}
else if (cedictPinyinWODIndex[searchWord]) {
	cedictSearchResults = cedictPinyinWODIndex[searchWord];
	console.log(cedictSearchResults);
}


resultsUl = document.getElementById('results-ul');
resultsTableBody = document.getElementById('results-table-body');

cedictTableBody = document.getElementById('cedict-table-body');


if (resultsUl) {
	// for (let result of searchResults) {
	// 	var newLi = document.createElement('li');
	// 	newLi.innerHTML = '<a href="hanzi.html?hanzi=' + result + '">' + result + '</a>';
	// 	resultsUl.appendChild(newLi);
	// }

	fillHanziTable(resultsTableBody, searchResults);
	console.log(cedictSearchResults.length);
	if (cedictSearchResults.length > 0) {

		fillCedictTable(cedictTableBody, cedictSearchResults)
	}
}
