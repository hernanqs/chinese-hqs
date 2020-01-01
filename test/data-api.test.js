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

var { HanziDataAPI, CedictDataAPI } = require('../js/data-api.js');


describe('#Data API', function () {
	
	describe('#Hanzi API', function () {

		before(function () {
			this.hanziData = new HanziDataAPI();
		});

		describe('#has()', function () {
			it('Returns true if the passed hanzi exist in the data', function () {
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
				let result = this.hanziData.searchChinese('ta');
				expect(result[0]['mostCommonRanking']).to.be.below(result[1]['mostCommonRanking']);
				expect(result[1]['mostCommonRanking']).to.be.below(result[2]['mostCommonRanking']);
				expect(result[2]['mostCommonRanking']).to.be.below(result[3]['mostCommonRanking']);
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
				let result = this.hanziData.searchEnglish('I');
				expect(result[0]['mostCommonRanking']).to.be.below(result[1]['mostCommonRanking']);
				expect(result[1]['mostCommonRanking']).to.be.below(result[2]['mostCommonRanking']);
				expect(result[2]['mostCommonRanking']).to.be.below(result[3]['mostCommonRanking']);
			});
		});

	});


	describe('#Cedict API', function () {

		before(function () {
			this.cedictData = new CedictDataAPI();
		});

		describe('#has()', function () {
			it('Returns true if the passed word exist in the data', function () {
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
				let result = this.cedictData.searchChinese('舞');
				expect(result[0]['s'].length).to.be.below(result[2]['s'].length);
				expect(result[2]['s'].length).to.be.below(result[50]['s'].length);
				expect(result[50]['s'].length).to.be.below(result[90]['s'].length);
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
				let result = this.cedictData.searchEnglish('who');
				expect(result[0]['s'].length).to.be.below(result[2]['s'].length);
				expect(result[2]['s'].length).to.be.below(result[6]['s'].length);
			});
		});

	});
});
