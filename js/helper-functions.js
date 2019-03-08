function populateHTMLById(idContentMap) {
	for (let [id, content] of Object.entries(idContentMap)) {
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


// Functions for making tables

function makeTableFunctionFactory(name, colNames) {
	return function(content, caption) {
		let cols = '';
		for (let colName of colNames) {
			cols += `<th class="${name}-th">${colName}</th>`;
		}

		table = `
			<table class="${name}" id="${name}">
				<caption class="${name}-caption" id="${name}-caption">
					${caption}		
				</caption>
				<thead class="${name}-head" id="${name}-head">
					<tr class="${name}-tr ${name}-thead-tr">
						${cols}
					</tr>
				</thead>
				<tbody class="${name}-body" id="${name}-body">
					${content}
				</tbody>
			</table>
		`;

		return table;
	}
}

let makeHanziTable = makeTableFunctionFactory('hanzi-table', [
		'Simplified',
		'Traditional',
		'Pinyin',
		'Other Pinyin',
		'Ranking',
		'HSK Level',
		'Radical',
		'Strokes',
		'Meaning',
	]);

let makeCedictTable = makeTableFunctionFactory('cedict-table', [
		'Simplified',
		'Traditional',
		'Pinyin',
		'Meaning',
	]);


function getTableTr(tdContents, tableName) {
	let newTrInnerHTML = '<tr>';

	for (let tdContent of tdContents) {
		if (tdContent) {
			if (Array.isArray(tdContent)) {
				newTrInnerHTML += `<td class="${tableName}-td">${tdContent.join(', ')}</td>`;
			} else {
				newTrInnerHTML += `<td class="${tableName}-td">${tdContent}</td>`;
			}
		} else {
			newTrInnerHTML += `<td class="${tableName}-td"> -- </td>`
		}
	}

	newTrInnerHTML += '</tr>';
	return newTrInnerHTML;

}


// Get rows for hanzi Table function
function getHanziTableContent(hanziArray) {
	let tableContent = '';

	for (let hanzi of hanziArray) {
		hanzi = hanziDict[hanzi];

		let tdContents = [
			getWiktionaryLink(hanzi['simplified'], 'w', true) + ' ' + getHanziLink(hanzi['simplified']),
			hanzi['traditional']? hanzi['traditional'].map(h =>getWiktionaryLink(h) + ' ' + h) : '--',
			hanzi['pinyin'],
			hanzi['otherPinyin'],
			hanzi['mostCommonRanking'],
			hanzi['HKSLevel'],
			getHanziLink(hanzi['radical']) + ' ' + hanzi['radicalAndExtraStrokes'].slice(1),
			hanzi['strokeNumber'],
			hanzi['meaning']
		]

		tableContent += getTableTr(tdContents, 'hanzi-table');

	}
	return tableContent;
}


// Functions for making the cedict table

function getCedictTdContents(hanzi) {
	return tdContents = [
		hanzi['simplified'],
		hanzi['traditional'],
		hanzi['pinyin'],
		hanzi['english']
	];
}

function getCedictTableContent(hanziArray) {
	let tableContent = '';

	for (let hanzi of hanziArray) {
		hanzi = cedict[hanzi];

		if (Array.isArray(hanzi)) {

			for (let hanziItem of hanzi) {
				let newTr = getTableTr(getCedictTdContents(hanziItem), 'cedict-table');
				tableContent += newTr;
			}

		} else {
			let newTr = getTableTr(getCedictTdContents(hanzi), 'cedict-table');
			tableContent += newTr;
		}
	}
	return tableContent;
}

// Link functions
function externalLinkFunctionFactory(baseURL, newTab=false, defaultText='') {
	return function(URLParams, text='', id='', classes='') {
		if (!text) {
			text = URLParams;
		}
		return '<a href="' + baseURL + URLParams + '" ' + (newTab? 'target="_blank"' : '') + ' id="' +
			id + '" class="' + classes + '">' + (defaultText? defaultText : text) + '</a>'
	}
}

let getWiktionaryLink = externalLinkFunctionFactory('https://en.wiktionary.org/wiki/', true, 'w');
// getHanziLink = externalLinkFunctionFactory('hanzi.html?hanzi=', false)

function internalLinkFunctionFactory(baseURL, handler, defaultText='') {
	return function(path, text='', id='', classes='') {
		if (!text) {
			text = path;
		}
		return '<button href="' + baseURL + path + '" onclick="' + handler + '(this);" id="' + 
			id + '" class="' + classes + '">' + (defaultText? defaultText : text) + '</button>'
	}
}

let getHanziLink = internalLinkFunctionFactory('hanzi/', 'handleHanziLink');


// Search results functions
function getSearchResultsFunctionFactory(hanziIdx, pinyinIdx, pinyinWODIdx) {
	return function (searchWord) {
		let diacriticsRegExp = /[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/i;

		let searchWordLower = searchWord.toLowerCase().replace(/\s/g, '');

		let searchResults = []

		if (hanziIdx[searchWord]) {
			searchResults = hanziIdx[searchWord];
		}
		else if (diacriticsRegExp.test(searchWord) && pinyinIdx[searchWordLower]) {
			searchResults = pinyinIdx[searchWordLower];
		}
		else if (pinyinWODIdx[searchWordLower]) {
			searchResults = pinyinWODIdx[searchWordLower];
		}

		return searchResults;
	}

}

let getHanziSearchResults = getSearchResultsFunctionFactory(hanziIndex, pinyinIndex, pinyinWODIndex);
let getCedictSearchResults = getSearchResultsFunctionFactory(cedictWordIndex, cedictPinyinIndex, cedictPinyinWODIndex);