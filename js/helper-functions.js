// Functions for making tables

function makeTableFunctionFactory(name, colNames) {
	return function(content, caption) {
		let cols = '';
		for (let colName of colNames) {
			cols += `<th class="${name}-th">${colName}</th>`;
		}

		let table = `
			<table class="${name}" id="${name}">
				<caption class="${name}-caption" id="${name}-caption">
					${caption}		
				</caption>
				<thead class="${name}-head" id="${name}-head">
					<tr class="${name}-thead-tr">
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
		'',
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
		'',
		'Simplified',
		'Traditional',
		'Pinyin',
		'Meaning',
	]);


function getTableTr(tdContents, tableName) {
	let newTrInnerHTML = `<tr class="${tableName}-tr">`;

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
			getWiktionaryLink(hanzi['simplified'], 'w', true),
			getHanziLink(hanzi['simplified']),
			hanzi['traditional']? hanzi['traditional'].map(h =>getWiktionaryLink(h)) : '--',
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
	return [
		getWiktionaryLink(hanzi['simplified'], 'w') + ' ' +
			getSearchLink(hanzi['simplified'], 's'),
		getHanziLinksFromWord(hanzi['simplified']),
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
		return `<a href="${ baseURL + path }" ${ (newTab? 'target="_blank"' : '') }
			${ (id ? 'id="' + id + '"' : '') } ${ (classes ? 'class="' + classes + '"' : '') }
			>${ text }</a>`;
	}
}

let getWiktionaryLink = linkFunctionFactory('https://en.wiktionary.org/wiki/', true);
let getHanziLink = linkFunctionFactory('#hanzi/');
let getRadicalLink = linkFunctionFactory('#radical/');
let getSearchLink = linkFunctionFactory('#search/');


// Get hanzi links from word function
function getHanziLinksFromWord(word) {
	let result = '';
	for (let char of word) {
		// If character is a hanzi add link to result, else add character
		if (!/[a-zA-Z0-9\s,，.:·]/.test(char)) {
			result += getHanziLink(char);
		} else {
			result += char;
		}
	}
	return result;
}


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


function getRadicalsUl() {
		let radicalsUl = '';

		let radicalsByStrokeCount = {
		1: ['一', '丨', '丶', '丿', '乙', '亅'],
		2: ['二', '亠', '人', '儿', '入', '八', '冂', '冖', '冫', '几', '凵', '刀', '力',
			'勹', '匕', '匚', '匸', '十', '卜', '卩', '厂', '厶', '又'],
		3: ['口', '囗', '土', '士', '夂', '夊', '夕', '大', '女', '子', '宀', '寸', '小',
			'尢', '尸', '屮', '山', '巛', '工', '己', '巾', '干', '幺', '广', '廴', '廾',
			'弋', '弓', '彐', '彡', '彳'],
		4: ['心', '戈', '戶', '手', '支', '攴', '文', '斗', '斤', '方', '无', '日', '曰',
			'月', '木', '欠', '止', '歹', '殳', '毋', '比', '毛', '氏', '气', '水', '火',
			'爪', '父', '爻', '片', '牙', '牛', '犬'],
		5: ['玄', '玉', '瓜', '瓦', '甘', '生', '用', '田', '疋', '疒', '癶', '白', '皮',
			'皿', '目', '矛', '矢', '石', '示', '禸', '禾', '穴', '立'],
		6: ['竹', '米', '糸', '纟', '缶', '网', '羊', '羽', '老', '而', '耒', '耳', '聿',
			'肉', '臣', '自', '至', '臼', '舌', '舛', '舟', '艮', '色', '艸', '虍', '虫',
			'血', '行', '衣', '襾'],
		7: ['见', '角', '言', '讠', '谷', '豆', '豕', '豸', '贝', '赤', '走', '足', '身',
			'车', '辛', '辰', '辵', '邑', '酉', '釆', '里'],
		8: ['金', '钅', '长', '门', '阜', '隶', '隹', '雨', '青', '非'],
		9: ['面', '革', '韦', '音', '页', '风', '飞', '食', '饣', '首', '香'],
		10: ['马', '骨', '高', '鬼'],
		11: ['鱼', '鸟', '鹿', '麦', '麻'],
		12: ['黃', '黍', '黑'],
		13: ['鼎', '鼓', '鼠'],
		14: ['鼻'],
		15: ['齿'],
		16: ['龙', '龟']
	}

	radicalsUl += '<ul class="navbar-ul">';

	for (let [key, value] of Object.entries(radicalsByStrokeCount)) {

		let radLinkList = '';
		for (let rad of value) {
			radLinkList += getRadicalLink(rad) + ' ';	
		}

		radicalsUl += `<li>${key}: ${radLinkList}</li>`;	
	}

	radicalsUl += '</ul>';

	return radicalsUl;

}


// Hanzi card function

function getHanziCard(hanzi, hanziDict) {
	hanzi = hanziDict[hanzi];

	let hanziCard = `
		<section class="hanzi-card">
			<div class="hanzi-card-simp-div">
				<p class="hanzi-card-simp" id="hanzi-card-simp">${ hanzi.simplified }</p>
				${ getWiktionaryLink(hanzi.simplified, 'Wiktionary') }
			</div>
			<div class="hanzi-data">
				<dl class="hanzi-data-dl">
					${
						hanzi.traditional ?
							`<dt class="hanzi-data-dt">
								Traditional
							</dt>
							<dd class="hanzi-data-dd" id="hanzi-data-trad">
								${
									hanzi.traditional.join(', ')
								}
							</dd>`
							: ''
					}
					<dt class="hanzi-data-dt">
						Pinyin
					</dt>
					<dd class="hanzi-data-dd" id="hanzi-data-pinyin">
						${ hanzi.pinyin ? hanzi.pinyin : '--'}
					</dd>
					${
						hanzi.otherPinyin ?
							`<dt class="hanzi-data-dt">
								Other pinyin
							</dt>
							<dd class="hanzi-data-dd" id="hanzi-data-other-pinyin">
								${
									hanzi.otherPinyin.join(', ')
								}
							</dd>`
							: ''
					}
					<dt class="hanzi-data-dt">
						Radical
					</dt>
					<dd class="hanzi-data-dd" id="hanzi-data-radical">
						${
							hanzi.radical ?
							getRadicalLink(hanzi.radical) + hanzi.radicalAndExtraStrokes.slice(1) 
							: '--'
						}
					</dd>
					<dt class="hanzi-data-dt">
						Ranking in most common hanzi
					</dt>
					<dd class="hanzi-data-dd" id="hanzi-data-most-common-ranking">
						${ hanzi.mostCommonRanking ? hanzi.mostCommonRanking : '--' }
					</dd>
					<dt class="hanzi-data-dt">
						HKS level
					</dt>
					<dd class="hanzi-data-dd" id="hanzi-data-hks-level">
						${ hanzi.HKSLevel ? hanzi.HKSLevel : '--' }
					</dd>
					<dt class="hanzi-data-dt">
						Meaning
					</dt>
					<dd class="hanzi-data-dd" id="hanzi-data-meaning">
						${ hanzi.meaning ? hanzi.meaning : '--' }
					</dd>
				</dl>
			</div>
			<div class="stroke-order-div" id="stroke-order-div">
			</div>
		</section>
	`;

	return hanziCard;

}


// Cedict word card functions

function getCedictWordCard(word, cedict) {
	let cedictEntry = cedict[word];
	let wordDataContent = '';

	// If there is more than one definition for the word display all of them
	if (Array.isArray(cedictEntry)) {
		for (let i = 0; i < cedictEntry.length; i++) {
			wordDataContent = `<div class="cedict-word-definition">${
				getCedictWordDefinition(cedictEntry[i])
			}</div>`;
		}
	} else {
		wordDataContent = getCedictWordDefinition(cedictEntry);
	}

	let simplified = word;

	let cedictWordCard = `
		<section class="cedict-word-card">
			<div class="cedict-word-card-simp-div">
				<p class="cedict-word-card-simp" id="cedict-word-card-simp">${ simplified }</p>
				${ getWiktionaryLink(simplified, 'Wiktionary') }
			</div>
			<div class="cedict-word-data">
				${ wordDataContent }
			</div>
			<div class="stroke-order-div" id="stroke-order-div">
			</div>
		</section>
	`;

	return cedictWordCard;

}

function getCedictWordDefinition(cedictEntry) {
	let definition = `
			<dl class="cedict-word-data-dl">

				<dt class="cedict-word-data-dt">
					Traditional
				</dt>
				<dd class="cedict-word-data-dd" id="cedict-word-data-trad">
					${
						cedictEntry.traditional ? cedictEntry.traditional : '--'
					}
				</dd>
				<dt class="cedict-word-data-dt">
					Pinyin
				</dt>
				<dd class="cedict-word-data-dd" id="cedict-word-data-pinyin">
					${ cedictEntry.pinyin ? cedictEntry.pinyin : '--'}
				</dd>
				<dt class="cedict-word-data-dt">
					Meaning
				</dt>
				<dd class="cedict-word-data-dd" id="cedict-word-data-meaning">
					${ cedictEntry.english ? cedictEntry.english : '--' }
				</dd>
			</dl>
	`;

	return definition;
}
