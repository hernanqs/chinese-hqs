'use strict';

class Link {
    constructor(baseURL, newTab=false) {
        this.baseURL = baseURL;
        this.newTab = newTab;
    }
    get(path, text='') {
        return `<a href="${ this.baseURL + path }"${ (this.newTab? ' target="_blank"' : '') }>${ text || path }</a>`;
    }
}

var wiktionaryLink = new Link('https://en.wiktionary.org/wiki/', true);
var hanziLink = new Link('#type=hanzi&value=');
var radicalLink = new Link('#type=radical&value=');
var searchLink = new Link('#type=search&value=');
var hskLevelLink = new Link('#type=hsk&value=');
var listLink = new Link('#type=list&value=');
var cedictEntryLink = new Link('#type=cedict-entry&value=');

// Takes a character in a string.
// Returns true if the character is a hanzi, else returns false.
function isHanzi(char) {
	return !/[a-zA-Z0-9\s,，.:·]/.test(char);
}

// Takes a string with a chinese word (or phrase)
// Returns a string with all hanzi characters converted in links (anchor HTML elements) to
// the search results page for that hanzi
function getHanziLinksFromWord(word) {
	let result = '';
	for (let char of word) {
		// If character is a hanzi add link to search results page for that
		// hanzi, else add character
		if (isHanzi(char)) {
			result += hanziLink.get(char);
		} else {
			result += char;
		}
	}
	return result;
}

// Superclass for the API used to get the HTML strings used to display the data
// to the user.
class DataGuiAPI {

    // Takes an array of entries to be displayed and the heading for the display.
    // Returns a string with the HTML used to display the entries.
	getEntriesDisplay(entries, heading) {
		// Make table headers with the column names
		let cols = '';
		for (let colName of this.colNames) {
			cols += `<th class="${this.name}-th">${colName}</th>`;
		}
		// Add caption, table headers, and body content to the table
		let table = `
			<table class="${this.name}" id="${this.name}">
				<caption class="${this.name}-caption" id="${this.name}-caption">
					${heading}
				</caption>
				<thead class="${this.name}-head" id="${this.name}-head">
					<tr class="${this.name}-thead-tr">
						${cols}
					</tr>
				</thead>
				<tbody class="${this.name}-body" id="${this.name}-body">
					${this.getTableContent(entries)}
				</tbody>
			</table>
		`;
		// Return table HTML in a string
		return table;
	}

    // Takes an array of strings or arrays to use as content of the td (columns) of an 
    // tr (row), and the table name to use in the HTML classes of the tr and td elements
    // Returns an HTML string with an individual tr element (row) to be added to the
    // content in the hanzi and cedict tables.
    getTableTr(tdContents, tableName) {
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

    // Get table body content (the table rows) for the getEntriesDisplay function
    // Takes an array of data entries.
    // Returns an HTML string with tr elements, each tr has the information of one data entry.
    getTableContent(entries) {
        return entries.map(
                entry => {
                    try {
                        return this.getTableTr(this.getTdContents(entry), this.name);
                    } catch (error) {
                        console.log(error);
                        return '';
                    }
                }
            ).join('');
    }

}


// Class for the API used to get the HTML strings used to display the hanzi data
// to the user.
class HanziGuiAPI extends DataGuiAPI {
    constructor() {
        super();
        this.name = 'hanzi-table';
        this.colNames = [
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
        ];
    }

    // Takes a hanzi data entry (an object).
    // Returns an arrays of strings to be used as the contents of the td elements
    // in the row (tr) corresponding to the cedict definition passed as an argument.
    getTdContents(hanzi) {
        return [
            wiktionaryLink.get(hanzi['simplified'], 'w', true),
            hanziLink.get(hanzi['simplified']),
            Array.isArray(hanzi['traditional'])? hanzi['traditional'].map(h =>wiktionaryLink.get(h)) : '--',
            hanzi['pinyin'],
            hanzi['otherPinyin'],
            hanzi['mostCommonRanking'],
            hanzi['HSKLevel'],
            radicalLink.get(hanzi['radical']) + hanzi['radicalAndExtraStrokes'].slice(1),
            hanzi['strokeNumber'],
            hanzi['meaning']
        ];

    }


    // Takes a hanzi data entry in an array (this is for API consistency with the
    // Cedict getCard method, where a key (a chinese word) may have more than one entry).
    // Returns an HTML string with the card component to display the information
    // about the hanzi.
    getCard(entries) {
        let entry = entries[0];
        let card = `
            <section class="hanzi-card">
                <div class="hanzi-card-simp-div">
                    <p class="hanzi-card-simp" id="hanzi-card-simp">${ entry.simplified }</p>
                    ${ wiktionaryLink.get(entry.simplified, 'Wiktionary') }
                </div>
                <div class="hanzi-data">
                    <dl class="hanzi-data-dl">
                        ${
                            entry.traditional ?
                                `<dt class="hanzi-data-dt">
                                    Traditional
                                </dt>
                                <dd class="hanzi-data-dd" id="hanzi-data-trad">
                                    ${
                                        entry.traditional.join(', ')
                                    }
                                </dd>`
                                : ''
                        }
                        <dt class="hanzi-data-dt">
                            Pinyin
                        </dt>
                        <dd class="hanzi-data-dd" id="hanzi-data-pinyin">
                            ${ entry.pinyin || '--'}
                        </dd>
                        ${
                            entry.otherPinyin ?
                                `<dt class="hanzi-data-dt">
                                    Other pinyin
                                </dt>
                                <dd class="hanzi-data-dd" id="hanzi-data-other-pinyin">
                                    ${
                                        entry.otherPinyin.join(', ')
                                    }
                                </dd>`
                                : ''
                        }
                        <dt class="hanzi-data-dt">
                            Radical
                        </dt>
                        <dd class="hanzi-data-dd" id="hanzi-data-radical">
                            ${
                                entry.radical ?
                                radicalLink.get(entry.radical) + entry.radicalAndExtraStrokes.slice(1) 
                                : '--'
                            }
                        </dd>
                        <dt class="hanzi-data-dt">
                            Ranking in most common hanzi
                        </dt>
                        <dd class="hanzi-data-dd" id="hanzi-data-most-common-ranking">
                            ${ entry.mostCommonRanking || '--' }
                        </dd>
                        <dt class="hanzi-data-dt">
                            HSK level
                        </dt>
                        <dd class="hanzi-data-dd" id="hanzi-data-hsk-level">
                            ${ entry.HSKLevel || '--' }
                        </dd>
                        <dt class="hanzi-data-dt">
                            Meaning
                        </dt>
                        <dd class="hanzi-data-dd" id="hanzi-data-meaning">
                            ${ entry.meaning || '--' }
                        </dd>
                    </dl>
                </div>
                <div class="stroke-order-div" id="stroke-order-div">
                </div>
            </section>
        `;

        return card;
    }

}


// Class for the API used to get the HTML strings used to display the cedict data
// to the user.
class CedictGuiAPI extends DataGuiAPI {
    constructor() {
        super();
        this.name = 'cedict-table';
        this.colNames = [
            '',
            'Simplified',
            'Traditional',
            'Pinyin',
            'Meaning',
        ];
    }

    // Takes a definition of the cedict (an entry).
    // Returns an arrays of strings to be used as the contents of the td elements
    // in the row (tr) corresponding to the cedict definition passed as an argument.
    getTdContents(cedictDefinition) {
        let simp = cedictDefinition['s'];
        return [
            wiktionaryLink.get(simp, 'w') + ' ' +
            searchLink.get(simp + '&search-lang=Ch', 's') + ' ' +
            cedictEntryLink.get(simp, '→'),
            getHanziLinksFromWord(simp),
            cedictDefinition['t'],
            cedictDefinition['p'],
            cedictDefinition['e']
        ];
    }


    // Takes an object with the cedict definition.
    // Returns an HTML string with the information of the cedict definition.
    getCedictWordDefinition(cedictDefinition) {
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

    // Takes an array with one or more cedict data entries for one chinese word
    // (or phrase).
    // Returns an HTML string with the card component to display the information
    // about the word (or phrase) present in Cedict.
    getCard(entries) {
        let wordDataContent = '';

        for (let entry of entries) {
            wordDataContent += `<div class="cedict-word-definition">${
                this.getCedictWordDefinition(entry)
            }</div>`;
        }

        let simplified = entries[0]['s'];

        let cedictWordCard = `
            <section class="cedict-word-card">
                <div class="cedict-word-card-simp-div">
                    <p class="cedict-word-card-simp" id="cedict-word-card-simp">${ simplified }</p>
                    ${ wiktionaryLink.get(simplified, 'Wiktionary') }
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


}


// Class for the API used to get the HTML strings used to create the navbar menus.
class NavbarGuiAPI {

    // Get HTML string with the ul element to be used in the navbar dropdown menu with
    // the links to the radical page for the different radicals, grouped by
    // number of strokes in the traditional form of the radical (radicals that have
    // a different number of strokes in simplified chinese are placed where its
    // traditional form would be or next to its traditional form, if it has both forms).
    getRadicalsDropdown() {
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

        radicalsUl += '<div class="navbar-dropdown"><ul class="navbar-ul">';

        // Iterate over every group of radicals (grouped by number of strokes in its
        // traditional form)
        for (let [numOfStrokes, radicals] of Object.entries(radicalsByStrokeCount)) {

            let radLinkList = '';
            // Make links for the radicals with this number of strokes
            for (let rad of radicals) {
                radLinkList += radicalLink.get(rad) + ' ';	
            }

            // Add and number of strokes and the radicals with that number of strokes
            // to radicals ul 
            radicalsUl += `<li>${numOfStrokes}: ${radLinkList}</li>`;	
        }

        radicalsUl += '</ul></div>';

        return radicalsUl;

    }

    // Get HTML string with the ul element to use in the navbar dropdown menu with
    // the links to the lists of HSK words by levels.
    getCedictHSKLevelsUl() {
        let HSKLevelsUl = '';

        // // Map the URL way of referring to the level with the text that would be
        // // displayed to the user
        let levelsURLToTextMap = {
            'hsk-1': 'Level 1',
            'hsk-2': 'Level 2',
            'hsk-3': 'Level 3',
            'hsk-4': 'Level 4',
            'hsk-5': 'Level 5',
            'hsk-6': 'Level 6',
        };

        HSKLevelsUl += '<ul class="navbar-ul">';

        for (let [url, text] of Object.entries(levelsURLToTextMap)) {
            HSKLevelsUl += `<li>${ listLink.get(url, text) }</li>`;	
        }

        HSKLevelsUl += '</ul>';

        return HSKLevelsUl;

    }

    // Get HTML string with the ul element to use in the navbar dropdown menu with
    // the links to the HSK level page with the hanzi grouped by level.
    getHanziHSKLevelsUl() {
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
            HSKLevelsUl += `<li>${ hskLevelLink.get(url, text) }</li>`;	
        }

        HSKLevelsUl += '</ul>';

        return HSKLevelsUl;

    }

    // Get HTML string with the navbar dropdown menu with for the HSK levels.
    getHSKLevelsDropdown() {
        return `<div class="navbar-dropdown">
                <p class="dropdown-subtitle">Cedict</p>
                ${ this.getCedictHSKLevelsUl() }
                <p class="dropdown-subtitle">Hanzi</p>
                ${ this.getHanziHSKLevelsUl() }
            </div>
            `
    }
}
