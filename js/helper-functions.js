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
	hanzi = hanziDict[hanzi];
	let map = {
		'simp': hanzi.simplified,
		'trad': undefined,
		'pinyin': hanzi.pinyin,
		'other-pinyin': undefined,
		'radical': getRadicalLink(hanzi.radical) + hanzi.radicalAndExtraStrokes.slice(1),
		'most-common-ranking': hanzi.mostCommonRanking,
		'hks-level': hanzi.HKSLevel,
		'meaning': hanzi.meaning,
	};
	if (hanzi.taditional) {
		map.trad = hanzi.taditional.join(', ');
	}
	if (hanzi.otherPinyin) {
		map['other-pinyin'] = hanzi.otherPinyin.join(', ');
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
			getRadicalLink(hanzi['radical']) + hanzi['radicalAndExtraStrokes'].slice(1),
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
function linkFunctionFactory(baseURL, newTab=false) {
	return function(path, text='', id='', classes='') {
		if (!text) {
			text = path;
		}
		return `<a href="${ baseURL + path }" ${ (newTab? 'target="_blank"' : '') } id="${
			id }" class="${ classes }">${ text }</a>`
	}
}

let getWiktionaryLink = linkFunctionFactory('https://en.wiktionary.org/wiki/', true);
let getHanziLink = linkFunctionFactory('#hanzi/');
let getRadicalLink = linkFunctionFactory('#radical/');


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