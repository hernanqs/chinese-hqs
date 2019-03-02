// Helper functions

// Get URL Parameters and return them in an object
function getURLParams() {
	// Get a string containing the URL parameters 
	var paramsString = window.location.href.split('?')[1];

	// If there are not URL parameters, return an empty object
	if (!paramsString) {
		return {};
	}
	// Split the string containg the URL parameters into
	// key-value pairs
	var pairs = paramsString.split('&');

	// Create an object containing the URL parameters and return it
	var paramsObj = {};
	for (var i = 0; i < pairs.length; i++) {
		var pair = pairs[i].split('=');
		paramsObj[pair[0]] = pair[1];
	}
	return paramsObj;
}

function populateHTMLById(idContentMap) {
	for (let entry of Object.entries(idContentMap)) {
		let [id, content] = entry;
		if (content) {
			document.getElementById(id).innerHTML = content;
		} else {
			document.getElementById(id).innerHTML = '--';
		}
	}
	// console.log(idContentMap);
}

function getHanziIdContentMap(hanzi, hanziDict) {
	let map = {
		'simp': hanziDict[hanzi].simplified,
		'trad': undefined,
		'pinyin': hanziDict[hanzi].pinyin,
		'other-pinyin': undefined,
		'radical': hanziDict[hanzi].radicalAndExtraStrokes,
		'most-common-ranking': hanziDict[hanzi].mostCommonRanking,
		'hks-level': hanziDict[hanzi].HKSLevel,
		'meaning': hanziDict[hanzi].meaning,
	}
	if (hanziDict[hanzi].taditional) {
		map.trad = hanziDict[hanzi].taditional.join(', ');
	}
	if (hanziDict[hanzi].otherPinyin) {
		map['other-pinyin'] = hanziDict[hanzi].otherPinyin.join(', ');
	}
	return map;
}


// Search function

// Get HTML search form elements
var searchForm = document.getElementById('search-form');
var searchText = document.getElementById('search-text');

searchForm.addEventListener('submit', search);

function search (e) {
	// Prevent reloading the page
	e.preventDefault();

	console.log('searching');

	searchWord = searchText.value;

	// console.log(searchWord);
	// console.log(pinyinWODIndex[searchWord]);

	// if (pinyinWODIndex[searchWord]) {
	// 	console.log(pinyinWODIndex[searchWord]);
		// window.location.href = 'search-results.html?results=' + pinyinWODIndex[searchWord].join(',');
	// }
	window.location.href = 'search-results.html?search=' + searchWord;

}


// Fill hanzi Table function
function fillHanziTable(tableBody, hanziArray) {
	for (let hanzi of hanziArray) {
		hanzi = hanziDict[hanzi];
		var newTr = document.createElement('tr');
		tdContents = [
			getWiktionaryLink(hanzi['simplified'], 'w', true) + ' ' + getHanziLink(hanzi['simplified']),
			hanzi['traditional']? hanzi['traditional'].map(h =>getWiktionaryLink(h) + ' ' + h) : '--',
			hanzi['pinyin'],
			hanzi['otherPinyin'],
			hanzi['mostCommonRanking'],
			hanzi['HKSLevel'],
			// hanzi['radicalAndExtraStrokes'],
			getHanziLink(hanzi['radical']) + ' ' + hanzi['radicalAndExtraStrokes'].slice(1),
			hanzi['strokeNumber'],
			hanzi['meaning']
		]

		newTrInnerHTML = ''

		for (let tdContent of tdContents) {
			if (tdContent) {
				if (Array.isArray(tdContent)) {
					newTrInnerHTML += '<td class="results-table-td">' + tdContent.join(', ') + '</th>';
				} else {
					newTrInnerHTML += '<td class="results-table-td">' + tdContent + '</th>';
				}
			} else {
				newTrInnerHTML += '<td class="results-table-td">' + '--' + '</th>'
			}
		}

		newTr.innerHTML = newTrInnerHTML;
		tableBody.appendChild(newTr);
	}

}

function getCedictTableTr(hanzi) {
	var newTr = document.createElement('tr');
	tdContents = [
		hanzi['simplified'],
		hanzi['traditional'],
		hanzi['pinyin'],
		hanzi['english']
	]

	newTrInnerHTML = ''

	for (let tdContent of tdContents) {
		if (tdContent) {
			if (Array.isArray(tdContent)) {
				newTrInnerHTML += '<td class="results-table-td">' + tdContent.join(', ') + '</th>';
			} else {
				newTrInnerHTML += '<td class="results-table-td">' + tdContent + '</th>';
			}
		} else {
			newTrInnerHTML += '<td class="results-table-td">' + '--' + '</th>'
		}
	}

	newTr.innerHTML = newTrInnerHTML;
	return newTr;
}

// Fill hanzi Table function
function fillCedictTable(tableBody, hanziArray) {
	// console.log(hanziArray)
	for (let hanzi of hanziArray) {
		hanzi = cedict[hanzi];
		// console.log(hanzi)
		if (Array.isArray(hanzi)) {
			for (let hanziItem of hanzi) {
				newTr = getCedictTableTr(hanziItem);
				tableBody.appendChild(newTr);
			}
		} else {
			newTr = getCedictTableTr(hanzi);
			tableBody.appendChild(newTr);
		}
	}

}




// Link functions
function linkFunctionFactory(baseURL, newTab=false, defaultText='') {
	return function(URLParams, text='', id='', classes='') {
		if (!text) {
			text = URLParams;
		}
		return '<a href="' + baseURL + URLParams + '" ' + (newTab? 'target="_blank"' : '') + ' id="' +
			id + '" class="' + classes + '">' + (defaultText? defaultText : text) + '</a>'
	}
}

getWiktionaryLink = linkFunctionFactory('https://en.wiktionary.org/wiki/', true, 'w');
getHanziLink = linkFunctionFactory('hanzi.html?hanzi=', false)