// Functions for making tables

// Function factory used to build makeHanziTable and makeCedictTable functions
function makeTableFunctionFactory(name, colNames) {
	return function(content, caption) {
		// Make table headers with the column names
		let cols = '';
		for (let colName of colNames) {
			cols += `<th class="${name}-th">${colName}</th>`;
		}
		// Add caption, table headers, and body content to the table
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
		// Return table HTML in a string
		return table;
	}
}

// Function for making a hanzi table, takes the body content of the table (as
// an HTML string with tr elements) and the table name to use as caption
// Returns the table as an HTML string
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

// Function for making a cedict definitions table, takes the body content of the
// table (as an HTML string with tr elements) and the table name to use as caption
// Returns the table as an HTML string
let makeCedictTable = makeTableFunctionFactory('cedict-table', [
		'',
		'Simplified',
		'Traditional',
		'Pinyin',
		'Meaning',
	]);

// Makes an individual tr element (row) to add to the content in the hanzi and cedict tables
// Takes an array of strings or arrays to use as content of the td (columns) of the 
// tr (row), and the table name to use in the HTML classes of the tr and td elements
// Returns an HTML string with the tr
function getTableTr(tdContents, tableName) {
	let newTrInnerHTML = `<tr class="${tableName}-tr">`;

	// Iterate over the array of contents
	for (let tdContent of tdContents) {
		if (tdContent) {
			// If the content of the td has multiple values (is an array), join the items
			// of the array in a comma separated string
			if (Array.isArray(tdContent)) {
				newTrInnerHTML += `<td class="${tableName}-td">${tdContent.join(', ')}</td>`;
			} else {
				newTrInnerHTML += `<td class="${tableName}-td">${tdContent}</td>`;
			}
		}
		// If the content if undefined fill the td with a default value
		else {
			newTrInnerHTML += `<td class="${tableName}-td"> -- </td>`
		}
	}

	newTrInnerHTML += '</tr>';

	// Return an HTML string with the tr
	return newTrInnerHTML;

}


// Functions for making the hanzi table

// Get table body content (the table rows) for hanzi table function
// Takes an array of hanzi strings
// Returns an HTML string with tr elements, each tr has the information of one of the hanzi,
// the information is taken from hanziDict
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
			hanzi['HSKLevel'],
			getRadicalLink(hanzi['radical']) + hanzi['radicalAndExtraStrokes'].slice(1),
			hanzi['strokeNumber'],
			hanzi['meaning']
		]

		tableContent += getTableTr(tdContents, 'hanzi-table');

	}
	return tableContent;
}


// Functions for making the cedict table

// Takes a definition of the cedict (an object)
// Returns an arrays of strings to be used as the contents of the td elements
// in the row (tr) corrsponding to the cedict definition passed as an argument
function getCedictTdContents(cedictDefinition) {
	let simp = cedictDefinition['s'];
	return [
		getWiktionaryLink(simp, 'w') + ' ' +
			getSearchLink(simp + '&search-lang=Ch', 's'),
		getHanziLinksFromWord(simp),
		cedictDefinition['t'],
		cedictDefinition['p'],
		cedictDefinition['e']
	];
}

// Get table body content (the table rows) for the cedict table function
// Takes an array of strings with chinese words
// Returns an HTML string with tr elements, each tr has the information of one cedict
// definition corresponding to one of the chinese words
function getCedictTableContent(wordArray) {
	let tableContent = '';

	for (let word of wordArray) {
		cedictEntry = cedict[word];

		// If word is not in Cedict use empty fallback values
		if (!cedictEntry) {
			tableContent += getTableTr([
					getWiktionaryLink(word, 'w') + ' ' +
						getSearchLink(word + '&search-lang=Ch', 's'),
					getHanziLinksFromWord(word),
					'--',
					'--',
					'--'
				],
				'cedict-table'
			);
		}
		// If the cedict entry for the word has more than one definition, make a row for
		// each definition
		else if (Array.isArray(cedictEntry)) {

			for (let cedictDefinition of cedictEntry) {
				let newTr = getTableTr(getCedictTdContents(cedictDefinition), 'cedict-table');
				tableContent += newTr;
			}

		} else {
			let newTr = getTableTr(getCedictTdContents(cedictEntry), 'cedict-table');
			tableContent += newTr;
		}
	}
	return tableContent;
}

// Link functions
function linkFunctionFactory(baseURL, newTab=false) {
	return function(path, text='') {
		return `<a href="${ baseURL + path }" ${ (newTab? 'target="_blank"' : '') }>${ text || path }</a>`;
	}
}

// Functions for making links
let getWiktionaryLink = linkFunctionFactory('https://en.wiktionary.org/wiki/', true);
let getHanziLink = linkFunctionFactory('#type=hanzi&value=');
let getRadicalLink = linkFunctionFactory('#type=radical&value=');
let getSearchLink = linkFunctionFactory('#type=search&value=');
let getHSKLevelLink = linkFunctionFactory('#type=hsk&value=');
let getListLink = linkFunctionFactory('#type=list&value=');


// Takes a string with a chinese word (or phrase)
// Returns a string with all hanzi characters converted in links (anchor HTML elements) to
// the search results page for that hanzi
function getHanziLinksFromWord(word) {
	let result = '';
	for (let char of word) {
		// If character is a hanzi add link to search results page for that
		// hanzi, else add character
		if (!/[a-zA-Z0-9\s,，.:·]/.test(char)) {
			result += getHanziLink(char);
		} else {
			result += char;
		}
	}
	return result;
}


// Hanzi card function

// Takes a hanzi in a string and the hanziDict object
// Returns an HTML string with the card component to display the information
// about the hanzi present in hanziDict
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
						${ hanzi.pinyin || '--'}
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
						${ hanzi.mostCommonRanking || '--' }
					</dd>
					<dt class="hanzi-data-dt">
						HSK level
					</dt>
					<dd class="hanzi-data-dd" id="hanzi-data-hsk-level">
						${ hanzi.HSKLevel || '--' }
					</dd>
					<dt class="hanzi-data-dt">
						Meaning
					</dt>
					<dd class="hanzi-data-dd" id="hanzi-data-meaning">
						${ hanzi.meaning || '--' }
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

// Takes a chinese word (or phrase) in a string and the cedict object
// Returns an HTML string with the card component to display the information
// about the word present in cedict
function getCedictWordCard(word, cedict) {
	let cedictEntry = cedict[word];
	let wordDataContent = '';

	// If there is more than one definition for the word display all of them
	if (Array.isArray(cedictEntry)) {
		for (let i = 0; i < cedictEntry.length; i++) {
			wordDataContent += `<div class="cedict-word-definition">${
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

// Takes an object with the cedict definition
// Returns an HTML string with the information of the cedict definition
function getCedictWordDefinition(cedictDefinition) {
	let definition = `
			<dl class="cedict-word-data-dl">

				<dt class="cedict-word-data-dt">
					Traditional
				</dt>
				<dd class="cedict-word-data-dd" id="cedict-word-data-trad">
					${
						cedictDefinition['t'] || '--'
					}
				</dd>
				<dt class="cedict-word-data-dt">
					Pinyin
				</dt>
				<dd class="cedict-word-data-dd" id="cedict-word-data-pinyin">
					${ cedictDefinition['p'] || '--'}
				</dd>
				<dt class="cedict-word-data-dt">
					Meaning
				</dt>
				<dd class="cedict-word-data-dd" id="cedict-word-data-meaning">
					${ cedictDefinition['e'] || '--' }
				</dd>
			</dl>
	`;

	return definition;
}


// Radical page functions

// Get HTML string with the ul element to be used in the navbar dropdown menu with
// the links to the radical page for the different radicals, grouped by
// number of strokes in the traditional form of the radical (radicals that have
// a different number of strokes in simplified chinese are placed where its
// traditional form would be or next to its traditional form, if it has both forms)
function getRadicalsDropdown() {
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

	// radicalsUl += '<ul class="navbar-dropdown">';
	radicalsUl += '<div class="navbar-dropdown"><ul class="navbar-ul">';

	// Iterate over every group of radicals (grouped by number of strokes in its
	// traditional form)
	for (let [numOfStrokes, radicals] of Object.entries(radicalsByStrokeCount)) {

		let radLinkList = '';
		// Make links for the radicals with this number of strokes
		for (let rad of radicals) {
			radLinkList += getRadicalLink(rad) + ' ';	
		}

		// Add and number of strokes and the radicals with that number of strokes
		// to radicals ul 
		radicalsUl += `<li>${numOfStrokes}: ${radLinkList}</li>`;	
	}

	// radicalsUl += '</ul>';
	radicalsUl += '</ul></div>';

	return radicalsUl;

}


// HSK Levels page functions

// Get HTML string with the ul element to use in the navbar dropdown menu with
// the links to the lists of HSK words by levels
function getCedictHSKLevelsUl() {
	let HSKLevelsUl = '';

	// // Map the URL way of referring to the level with the text that would be
	// // displayed to the user
	let levelsURLToTextMap = {
		'HSK1List': 'Level 1',
		'HSK2List': 'Level 2',
		'HSK3List': 'Level 3',
		'HSK4List': 'Level 4',
		'HSK5List': 'Level 5',
		'HSK6List': 'Level 6',
	};

	HSKLevelsUl += '<ul class="navbar-ul">';

	for (let [url, text] of Object.entries(levelsURLToTextMap)) {
		HSKLevelsUl += `<li>${ getListLink(url, text) }</li>`;	
	}

	HSKLevelsUl += '</ul>';

	return HSKLevelsUl;

}

// Get HTML string with the ul element to use in the navbar dropdown menu with
// the links to the HSK level page with the hanzi grouped by level
function getHanziHSKLevelsUl() {
	let HSKLevelsUl = '';

	// Map the URL way of referring to the level with the text that would be
	// displayed to the user
	let levelsURLToTextMap = {
		'level-1': 'Level 1',
		'level-2': 'Level 2',
		'level-3': 'Level 3',
		'level-4': 'Level 4',
		'level-5': 'Level 5',
		'level-6': 'Level 6',
		'not-in-hsk': 'Not in HKS'
	};

	HSKLevelsUl += '<ul class="navbar-ul">';

	for (let [url, text] of Object.entries(levelsURLToTextMap)) {
		HSKLevelsUl += `<li>${ getHSKLevelLink(url, text) }</li>`;	
	}

	HSKLevelsUl += '</ul>';

	return HSKLevelsUl;

}

// Get HTML string with the navbar dropdown menu with for the HSK levels
function getHSKLevelsDropdown() {
	return `<div class="navbar-dropdown">
			<p class="dropdown-subtitle">Cedict</p>
			${ getCedictHSKLevelsUl() }
			<p class="dropdown-subtitle">Hanzi</p>
			${ getHanziHSKLevelsUl() }
		</div>
		`
}