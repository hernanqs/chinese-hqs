function populateHTMLById(idContentMap) {
	for (let entry of Object.entries(idContentMap)) {
		let [id, content] = entry;
		if (content) {
			document.getElementById(id).innerHTML = content;
		} else {
			document.getElementById(id).innerHTML = '--';
		}
	}
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
	};
	if (hanziDict[hanzi].taditional) {
		map.trad = hanziDict[hanzi].taditional.join(', ');
	}
	if (hanziDict[hanzi].otherPinyin) {
		map['other-pinyin'] = hanziDict[hanzi].otherPinyin.join(', ');
	}
	return map;
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
					newTrInnerHTML += '<td class="hanzi-table-td">' + tdContent.join(', ') + '</td>';
				} else {
					newTrInnerHTML += '<td class="hanzi-table-td">' + tdContent + '</td>';
				}
			} else {
				newTrInnerHTML += '<td class="hanzi-table-td">' + '--' + '</td>'
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
				newTrInnerHTML += '<td class="cedict-table-td">' + tdContent.join(', ') + '</td>';
			} else {
				newTrInnerHTML += '<td class="cedict-table-td">' + tdContent + '</td>';
			}
		} else {
			newTrInnerHTML += '<td class="cedict-table-td">' + '--' + '</td>'
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
function outerLinkFunctionFactory(baseURL, newTab=false, defaultText='') {
	return function(URLParams, text='', id='', classes='') {
		if (!text) {
			text = URLParams;
		}
		return '<a href="' + baseURL + URLParams + '" ' + (newTab? 'target="_blank"' : '') + ' id="' +
			id + '" class="' + classes + '">' + (defaultText? defaultText : text) + '</a>'
	}
}

getWiktionaryLink = outerLinkFunctionFactory('https://en.wiktionary.org/wiki/', true, 'w');
// getHanziLink = outerLinkFunctionFactory('hanzi.html?hanzi=', false)

function innerLinkFunctionFactory(baseURL, handler, defaultText='') {
	return function(path, text='', id='', classes='') {
		if (!text) {
			text = path;
		}
		return '<button href="' + baseURL + path + '" onclick="' + handler + '(this);" id="' + 
			id + '" class="' + classes + '">' + (defaultText? defaultText : text) + '</button>'
	}
}

getHanziLink = innerLinkFunctionFactory('hanzi/', 'handleHanziLink');



function getHanziSearchResults(searchWord) {
	diacriticsRegExp = /[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/i;

	searchResults = []

	if (hanziIndex[searchWord]) {
		searchResults = hanziIndex[searchWord];
	}
	else if (diacriticsRegExp.test(searchWord) && pinyinIndex[searchWord]) {
		searchResults = pinyinIndex[searchWord];
	}
	else if (pinyinWODIndex[searchWord]) {
		searchResults = pinyinWODIndex[searchWord];
	}

	return searchResults;
}

function getCedictSearchResults(searchWord) {
	diacriticsRegExp = /[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/i;

	cedictSearchResults = []

	if (cedictWordIndex[searchWord]) {
		cedictSearchResults = cedictWordIndex[searchWord];
	}
	else if (diacriticsRegExp.test(searchWord) && cedictPinyinIndex[searchWord]) {
		cedictSearchResults = cedictPinyinIndex[searchWord];
	}
	else if (cedictPinyinWODIndex[searchWord]) {
		cedictSearchResults = cedictPinyinWODIndex[searchWord];
	}

	return cedictSearchResults;
}
