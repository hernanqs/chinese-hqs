'use strict';

var { expect } = require('chai');

var { hanziDict } = require('../data/hanzi.js');
var { pinyinIndex } = require('../indices/pinyinIndex.js');
var { pinyinWODIndex } = require('../indices/pinyinWODIndex.js');
var { hanziEnglishIndex } = require('../indices/hanziEnglishIndex.js');

var { cedict } = require('../data/cedict.js');
var { cedictEnglishIndex } = require('../indices/cedictEnglishIndex.js');
var { cedictPinyinIndex } = require('../indices/cedictPinyinIndex.js');
var { cedictPinyinWODIndex } = require('../indices/cedictPinyinWODIndex.js');
var { cedictWordIndex } = require('../indices/cedictWordIndex.js');

var { hskList } = require('../lists/hskList.js');

var { HanziDataAPI, CedictDataAPI, ListDataAPI, SuperlistDataAPI } = require('../js/data-api.js');


describe('#Data API', function () {
	
	describe('#Hanzi API', function () {

		before(function () {
			this.hanziData = new HanziDataAPI();
		});

		describe('#has()', function () {
			it('Returns true if the passed hanzi exists in the data', function () {
				expect(this.hanziData.has('你')).to.be.true;
			});
			it('Returns false if the passed hanzi does not exist in the data', function () {
				expect(this.hanziData.has('42')).to.be.false;
			});
		});

		describe('#getEntriesFromOneKey()', function () {
			it('Returns the entries for the requested key', function () {
				expect(this.hanziData.getEntriesFromOneKey('的')[0]).to.deep.equal({
					simplified: '的',
					mostCommonRanking: 1,
					strokeNumber: 8,
					radical: '白',
					radicalAndExtraStrokes: '白 + 3',
					pinyin: 'de',
					meaning: 'possessive, adjectival suffix',
					HSKLevel: 1,
					otherPinyin: [ 'dí', 'dì' ]
				});
			});
			it('Returns array with entry filled with default values if the requested key is not in the data', function () {
				let result = this.hanziData.getEntriesFromOneKey('㝵');
				expect(result).to.have.lengthOf(1);
				expect(result[0]).to.deep.equal({
					simplified: '㝵',
					traditional: '--',
					pinyin: '--',
					otherPinyin: '--',
					mostCommonRanking: '--',
					HSKLevel: '--',
					radical: '--',
					radicalAndExtraStrokes: '--',
					strokeNumber: '--',
					meaning: '--'
				});
			});
		});

		describe('#searchChinese()', function () {
			it('Returns an array', function () {
				expect(this.hanziData.searchChinese('的')).to.be.an('array');
			});
			it('Returns an empty array if there is no search results', function () {
				expect(this.hanziData.searchChinese('㝵')).to.be.an('array').with.lengthOf(0);
			});
			it('Returns the rigth entry when a hanzi is passed', function () {
				expect(this.hanziData.searchChinese('的')[0]).to.deep.equal({
					simplified: '的',
					mostCommonRanking: 1,
					strokeNumber: 8,
					radical: '白',
					radicalAndExtraStrokes: '白 + 3',
					pinyin: 'de',
					meaning: 'possessive, adjectival suffix',
					HSKLevel: 1,
					otherPinyin: [ 'dí', 'dì' ]
				});
			});
			it('Returns the rigth entries when a pinyin is passed', function () {
				expect(this.hanziData.searchChinese('ta')[0]).to.deep.equal({
					simplified: '他',
					mostCommonRanking: 10,
					strokeNumber: 5,
					radical: '人',
					radicalAndExtraStrokes: '人亻 + 3',
					pinyin: 'tā',
					meaning: 'other, another; he, she, it',
					HSKLevel: 1
				});
			});
			it('Returns the entries ordered from most to least common', function () {
				let results = this.hanziData.searchChinese('po');
				expect(results).to.have.lengthOf.at.least(2);
				let isOrdered = true;
				for (let i = 1; i < results.length; i++) {
					if (results[i]['mostCommonRanking'] < results[i-1]['mostCommonRanking']) {
						isOrdered = false;
					}
				}
				expect(isOrdered).to.be.true;

			});
		});

		describe('#searchEnglish()', function () {
			it('Returns an array', function () {
				expect(this.hanziData.searchEnglish('I')).to.be.an('array');
			});
			it('Returns an empty array if there is no search results', function () {
				expect(this.hanziData.searchEnglish('42')).to.be.an('array').with.lengthOf(0);
			});
			it('Returns the rigth entries when an english word is passed', function () {
				expect(this.hanziData.searchEnglish('I')[0]).to.deep.equal({
					simplified: '我',
					mostCommonRanking: 9,
					strokeNumber: 7,
					radical: '戈',
					radicalAndExtraStrokes: '戈 + 3',
					pinyin: 'wǒ',
					meaning: 'our, us, i, me, my, we',
					HSKLevel: 1
				});
			});
			it('Returns the intersection of the entries for all words when more than one english word is passed', function () {
				expect(this.hanziData.searchEnglish('I brother')).to.deep.include({
					simplified: '弟',
					mostCommonRanking: 816,
					strokeNumber: 7,
					radical: '弓',
					radicalAndExtraStrokes: '弓 + 4',
					pinyin: 'dì',
					meaning: 'young brother; junior; i, me',
					HSKLevel: 2,
					otherPinyin: [ 'tì' ]
				}).and.to.not.deep.include({
					simplified: '我',
					mostCommonRanking: 9,
					strokeNumber: 7,
					radical: '戈',
					radicalAndExtraStrokes: '戈 + 3',
					pinyin: 'wǒ',
					meaning: 'our, us, i, me, my, we',
					HSKLevel: 1
				});
			});
			it('Returns the entries ordered from most to least common', function () {
				let results = this.hanziData.searchEnglish('I');
				expect(results).to.have.lengthOf.at.least(2);
				let isOrdered = true;
				for (let i = 1; i < results.length; i++) {
					if (results[i]['mostCommonRanking'] < results[i-1]['mostCommonRanking']) {
						isOrdered = false;
					}
				}
				expect(isOrdered).to.be.true;
			});
		});

	});


	describe('#Cedict API', function () {

		before(function () {
			this.cedictData = new CedictDataAPI();
		});

		describe('#has()', function () {
			it('Returns true if the passed word exists in the data', function () {
				expect(this.cedictData.has('木兰')).to.be.true;
			});
			it('Returns false if the passed word does not exist in the data', function () {
				expect(this.cedictData.has('42')).to.be.false;
			});
		});

		describe('#getEntriesFromOneKey()', function () {
			it('Returns the entries for the requested key', function () {
				expect(this.cedictData.getEntriesFromOneKey('汉语')[0]).to.deep.equal(
					{ s:'汉语', t:'漢語', e:'Chinese language/CL:門|门[mén]', p:'Hàn yǔ' }
				);
			});
			it('Returns array with entry filled with default values if the requested key is not in the data', function () {
				let result = this.cedictData.getEntriesFromOneKey('系领带');
				expect(result).to.have.lengthOf(1);
				expect(result[0]).to.deep.equal(
					{ s: '系领带', t: '--', p: '--', e: '--' }
				);
			});
		});

		describe('#searchChinese()', function () {
			it('Returns an array', function () {
				expect(this.cedictData.searchChinese('的')).to.be.an('array');
			});
			it('Returns an empty array if there is no search results', function () {
				expect(this.cedictData.searchChinese('系领带')).to.be.an('array').with.lengthOf(0);
			});
			it('Returns the rigth entries when a word in hanzi is passed', function () {
				expect(this.cedictData.searchChinese('音乐')[0]).to.deep.equal({
						s: '音乐',
						t: '音樂',
						e: 'music/CL:張|张[zhāng],曲[qǔ],段[duàn]',
						p: 'yīn yuè'
				});
			});
			it('Returns the rigth entries when a pinyin without diacritics is passed', function () {
				expect(this.cedictData.searchChinese('xue xi')[0]).to.deep.equal(
					{ s:'学习', t:'學習', e:'to learn/to study', p:'xué xí' }
				);
			});
			it('Returns the rigth entries when a pinyin with diacritics is passed', function () {
				expect(this.cedictData.searchChinese('Hán yǔ')[0]).to.deep.equal({
					s: '韩语',
					t: '韓語',
					e: 'Korean language (esp. in context of South Korea)',
					p: 'Hán yǔ'
				});
			});
			it('Returns the entries ordered from shortest to longest word', function () {
				let results = this.cedictData.searchChinese('wu');
				expect(results).to.have.lengthOf.at.least(2);
				let isOrdered = true;
				for (let i = 1; i < results.length; i++) {
					if (results[i]['s'].length < results[i-1]['s'].length) {
						isOrdered = false;
					}
				}
				expect(isOrdered).to.be.true;
			});
		});

		describe('#searchEnglish()', function () {
			it('Returns an array', function () {
				expect(this.cedictData.searchEnglish('I')).to.be.an('array');
			});
			it('Returns an empty array if there is no search results', function () {
				expect(this.cedictData.searchEnglish('42')).to.be.an('array').with.lengthOf(0);
			});
			it('Returns the rigth entries when an english word is passed', function () {
				expect(this.cedictData.searchEnglish('China')[0]).to.deep.equal(
					{ s:'中', t:'中', e:'China/Chinese/surname Zhong', p:'Zhōng' }
				);
			});
			it('Returns the intersection of the entries for all words when more than one english word is passed', function () {
				expect(this.cedictData.searchEnglish('China capital')).to.deep.include({
					s: '北京',
					t: '北京',
					e: "Beijing, capital of People's Republic of China/Peking/PRC government",
					p: 'Běi jīng'
				}).and.to.not.deep.include(
					{ s:'中', t:'中', e:'China/Chinese/surname Zhong', p:'Zhōng' }
				);
			});
			it('Returns the entries ordered from shortest to longest word', function () {
				let results = this.cedictData.searchEnglish('who');
				expect(results).to.have.lengthOf.at.least(2);
				let isOrdered = true;
				for (let i = 1; i < results.length; i++) {
					if (results[i]['s'].length < results[i-1]['s'].length) {
						isOrdered = false;
					}
				}
				expect(isOrdered).to.be.true;
			});

		});

	});


	describe('#List API', function () {

		before(function () {
			this.listData = new ListDataAPI(hskList.content[0]);

		});

		describe('#getFieldKeyFromType()', function () {
			it('Returns the right field key for the passed field type', function () {
				expect(this.listData.getFieldKeyFromType('simpHanzi')).to.equal('s');
				expect(this.listData.getFieldKeyFromType('english')).to.equal('e');
			});
		});

		describe('#has()', function () {
			it('Returns true if the passed word exists in the data', function () {
				expect(this.listData.has('的')).to.be.true;
			});
			it('Returns false if the passed word does not exist in the data', function () {
				expect(this.listData.has('42')).to.be.false;
			});
		});

		describe('#getEntriesFromOneKey()', function () {
			it('Returns the entries for the requested key', function () {
				expect(this.listData.getEntriesFromOneKey('是')[0]).to.deep.equal(
					{ s: '是', t: '是', p: 'shì', e: 'be; is; are; am' }
				);
			});
			it('Returns array with entry filled with default values if the requested key is not in the data', function () {
				let result = this.listData.getEntriesFromOneKey('系领带');
				expect(result).to.have.lengthOf(1);
				expect(result[0]).to.deep.equal(
					{ s: '系领带', t: '--', p: '--', e: '--' }
				);
			});
		});

		describe('#removePinyinDiacritics()', function () {
			it('Returns the passed pinyin with its diacritic marks removed', function () {
				expect(this.listData.removePinyinDiacritics('Hàn yǔ')).to.equal('han yu');
			});
		});

		describe('#searchChinese()', function () {
			it('Returns an array', function () {
				expect(this.listData.searchChinese('的')).to.be.an('array');
			});
			it('Returns an empty array if there is no search results', function () {
				expect(this.listData.searchChinese('系领带')).to.be.an('array').with.lengthOf(0);
			});
			it('Returns the exact entry when a word in hanzi is passed', function () {
				expect(this.listData.searchChinese('是')[0]).to.deep.equal(
					{ s: '是', t: '是', p: 'shì', e: 'be; is; are; am' }
				);
			});
			it('Returns the entries that contain the passed hanzi', function () {
				expect(this.listData.searchChinese('么')).to.deep.include(
					{ s: '怎么', t: '怎麼', p: 'zěnme', e: 'how?' }
				);
			});
			it('Returns the exact entry when a pinyin without diacritics is passed', function () {
				expect(this.listData.searchChinese('wo men')[0]).to.deep.equal(
					{ s: '我们', t: '我們', p: 'wǒmen', e: 'we; us' }
				);
			});
			it('Returns the exact entry when a pinyin with diacritics is passed', function () {
				let results = this.listData.searchChinese('zěn me');
				expect(this.listData.searchChinese('zěn me')[0]).to.deep.equal(
					{ s: '怎么', t: '怎麼', p: 'zěnme', e: 'how?' }
				);
			});
			it('Does not return entries without diacritics when a pinyin with diacritics is passed', function () {
				expect(this.listData.searchChinese('dé')).to.not.deep.include(
						{
							s: '的',
							t: '的',
							p: 'de',
							e: "indicates possession, like adding 's to a noun"
						}
				);
			});
			it('Returns the entries that contain the passed pinyin', function () {
				expect(this.listData.searchChinese('wo')).to.deep.include(
					{ s: '我们', t: '我們', p: 'wǒmen', e: 'we; us' }
				);
			});
			it('Returns the entries ordered according to their original order in the list', function () {
				let results = this.listData.searchChinese('wo');
				expect(results).to.have.lengthOf.at.least(2);
				let isOrdered = true;
				for (let i = 1; i < results.length; i++) {
					expect(this.listData.getEntryPosition(results[i])).to.be.at.least(0);
					if (this.listData.getEntryPosition(results[i]) < this.listData.getEntryPosition(results[i-1])) {
						isOrdered = false;
					}
				}
				expect(isOrdered).to.be.true;
			});
		});

		describe('#searchEnglish()', function () {
			it('Returns an array', function () {
				expect(this.listData.searchEnglish('I')).to.be.an('array');
			});
			it('Returns an empty array if there is no search results', function () {
				expect(this.listData.searchEnglish('42')).to.be.an('array').with.lengthOf(0);
			});
			it('Returns the rigth entries when an english word is passed', function () {
				let results = this.listData.searchEnglish('Chinese');
				expect(results).to.deep.include(
					{ s: '里', t: '裡', p: 'lǐ', e: 'inside; Chinese mile (~.5 km)' }
				).and.to.deep.include(
					{ s: '汉语', t: '漢語', p: 'Hànyǔ', e: 'Chinese language' }
				);
			});
			it('Returns the intersection of the entries for all words when more than one english word is passed', function () {
				expect(this.listData.searchEnglish('not have')).to.deep.include(
					{ s: '没有', t: '沒有', p: 'méiyǒu', e: 'not have; there is not' }
				).and.to.not.deep.include(
					{ s: '有', t: '有', p: 'yǒu', e: 'have' }
				);
			});
			it('Returns the entries ordered according to their original order in the list', function () {
				let results = this.listData.searchEnglish('you');
				expect(results).to.have.lengthOf.at.least(2);
				let isOrdered = true;
				for (let i = 1; i < results.length; i++) {
					if (this.listData.getEntryPosition(results[i]) < this.listData.getEntryPosition(results[i-1])) {
						isOrdered = false;
					}
				}
				expect(isOrdered).to.be.true;
			});
		});

		describe('#getAllKeys()', function () {
			it('Returns an array of keys (simplified hanzi)', function () {
				expect(this.listData.getAllKeys()).to.include(
					'有'
				).and.to.not.deep.include(
					{ s: '有', t: '有', p: 'yǒu', e: 'have' }
				);
			});
			it('Returns an array with all keys', function () {
				expect(this.listData.getAllKeys()).to.have.lengthOf(this.listData.content.length);
			});
		});

		describe('#getEntryPosition()', function () {
			it('Returns the position in the list of the passed entry', function () {
				expect(this.listData.getEntryPosition(
					{ s: '我', t: '我', p: 'wǒ', e: 'I; me' }
				)).to.equal(1);
				expect(this.listData.getEntryPosition(
					{ s: '是', t: '是', p: 'shì', e: 'be; is; are; am' }
				)).to.equal(3);
			});
		});

		describe('#getLength()', function () {
			it('Returns the length of the list', function () {
				expect(this.listData.getLength()).to.equal(150);
			});
		});

	});


	describe('#Superlist API', function () {

		before(function () {
			this.superlistData = new SuperlistDataAPI(hskList);
		});
	
		describe('#constructor()', function () {
			it('Makes every sublist an instance of the List Data API', function () {
				this.superlistData.content.forEach(
					el => expect(el).to.be.an.instanceOf(ListDataAPI)
				)
			});
		});
	
		describe('#getFieldKeyFromType()', function () {
			it('Returns the right field key for the passed field type', function () {
				expect(this.superlistData.getFieldKeyFromType('simpHanzi')).to.equal('s');
				expect(this.superlistData.getFieldKeyFromType('english')).to.equal('e');
			});
		});
	
		describe('#has()', function () {
			it('Returns true if the passed word exists in the data', function () {
				expect(this.superlistData.has('的')).to.be.true;
			});
			it('Returns false if the passed word does not exist in the data', function () {
				expect(this.superlistData.has('42')).to.be.false;
			});
		});
	
		describe('#getEntriesFromOneKey()', function () {
			it('Returns the entries for the requested key', function () {
				expect(this.superlistData.getEntriesFromOneKey('是')[0]).to.deep.equal(
					{ s: '是', t: '是', p: 'shì', e: 'be; is; are; am' }
				);
			});
			it('Returns array with entry filled with default values if the requested key is not in the data', function () {
				let result = this.superlistData.getEntriesFromOneKey('42');
				expect(result).to.have.lengthOf(1);
				expect(result[0]).to.deep.equal(
					{ s: '42', t: '--', p: '--', e: '--' }
				);
			});
		});
	
		describe('#searchChinese()', function () {
			it('Returns an array', function () {
				expect(this.superlistData.searchChinese('的')).to.be.an('array');
			});
			it('Returns an empty array if there is no search results', function () {
				expect(this.superlistData.searchChinese('42')).to.be.an('array').with.lengthOf(0);
			});
			it('Returns entries from all sublists when a word in hanzi is passed', function () {
				let results = this.superlistData.searchChinese('是');
				expect(results).to.deep.include(
					{ s: '是', t: '是', p: 'shì', e: 'be; is; are; am' }
				).and.to.deep.include(
					{ s: '可是', t: '可是', p: 'kěshì', e: 'but; however' }
				);
			});
			it('Returns entries from all sublists when a pinyin without diacritics is passed', function () {
				let results = this.superlistData.searchChinese('wo');
				expect(results).to.deep.include(
					{ s: '我们', t: '我們', p: 'wǒmen', e: 'we; us' }
				).and.to.deep.include(
					{ s: '卧室', t: '臥室', p: 'wòshì', e: 'bedroom' }
				);
			});
			it('Returns entries from all sublists when a pinyin with diacritics is passed', function () {
				expect(this.superlistData.searchChinese('dé')).to.deep.include(
					{
						s: '得',
						t: '得',
						p: 'dé, děi, de',
						e: 'obtain | must | (complement particle)'
					}
				).and.to.deep.include(
					{
						s: '得天独厚',
						t: '得天獨厚',
						p: 'détiāndúhòu',
						e: 'enjoy exceptional advantages; richly endowed by nature'
					}
				);
			});
			it('Does not return entries without diacritics when a pinyin with diacritics is passed', function () {
				expect(this.superlistData.searchChinese('lè')).to.deep.include(
					{ s: '快乐', t: '快樂', p: 'kuàilè', e: 'happy' }
				).and.to.not.deep.include(
					{
						s: '了',
						t: '了',
						p: 'le',
						e: 'indicates a completed or finished action'
					}
				);
			});
			it('Returns the entries ordered by the list they belong to', function () {
				let results = this.superlistData.searchChinese('de');
				let simpKey = this.superlistData.getFieldKeyFromType('simpHanzi');
	
				expect(
					results.findIndex((entry) => entry[simpKey] === '的')
				).to.be.below(
					results.findIndex((entry) => entry[simpKey] === '地')
				);
	
				expect(
					results.findIndex((entry) => entry[simpKey] === '地')
				).to.be.below(
					results.findIndex((entry) => entry[simpKey] === '值得')
				);
				
				expect(
					results.findIndex((entry) => entry[simpKey] === '值得')
				).to.be.below(
					results.findIndex((entry) => entry[simpKey] === '似的')
				);
			});
		});
	
		describe('#searchEnglish()', function () {
			it('Returns an array', function () {
				expect(this.superlistData.searchEnglish('Hi')).to.be.an('array');
			});
			it('Returns an empty array if there is no search results', function () {
				expect(this.superlistData.searchEnglish('42')).to.be.an('array').with.lengthOf(0);
			});
			it('Returns entries from all sublists when an English word is searched', function () {
				let results = this.superlistData.searchEnglish('be');
				expect(results).to.deep.include(
					{ s: '是', t: '是', p: 'shì', e: 'be; is; are; am' }
				).and.to.deep.include(
					{ s: '知道', t: '知道', p: 'zhīdao', e: 'know; be aware of' }
				);
			});
			it('Returns the entries ordered by the list they belong to', function () {
				let results = this.superlistData.searchEnglish('be');
				let simpKey = this.superlistData.getFieldKeyFromType('simpHanzi');
	
				expect(
					results.findIndex((entry) => entry[simpKey] === '是')
				).to.be.below(
					results.findIndex((entry) => entry[simpKey] === '知道')
				);
	
				expect(
					results.findIndex((entry) => entry[simpKey] === '知道')
				).to.be.below(
					results.findIndex((entry) => entry[simpKey] === '像')
				);
				
				expect(
					results.findIndex((entry) => entry[simpKey] === '像')
				).to.be.below(
					results.findIndex((entry) => entry[simpKey] === '行')
				);
			});
	
		});
	
		describe('#getAllKeys()', function () {
			it('Returns an array of keys (simplified hanzi)', function () {
				expect(this.superlistData.getAllKeys()).to.include(
					'有'
				).and.to.not.deep.include(
					{ s: '有', t: '有', p: 'yǒu', e: 'have' }
				);
			});
			it('Returns an array with all keys', function () {
				expect(this.superlistData.getAllKeys()).to.have.lengthOf(5001);
			});
		});
	
		describe('#getSublistsNames()', function () {
			it('Returns an array with the names of the sublists', function () {
				expect(this.superlistData.getSublistsNames())
					.to.have.lengthOf(6)
					.and.to.include('HSK 1')
					.and.to.include('HSK 6');
			});
		});
	
		describe('#getSublistsIds()', function () {
			it('Returns an array with the ids of the sublists', function () {
				expect(this.superlistData.getSublistsIds())
					.to.have.lengthOf(6)
					.and.to.include('hsk-1')
					.and.to.include('hsk-6');
			});
		});
	
		describe('#getLength()', function () {
			it('Returns the length of the list', function () {
				expect(this.superlistData.getLength()).to.equal(5001);
			});
		});
	
		describe('#getSublistsLength()', function () {
			it('Returns an array with the lengths of the sublists', function () {
				expect(this.superlistData.getSublistsLengths())
					.to.have.lengthOf(6)
					.and.to.include(150)
					.and.to.include(2500);
			});
		});
	});

});
