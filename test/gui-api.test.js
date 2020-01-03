'use strict';

var { expect, use } = require('chai');
use(require('chai-html'))

var { HanziGuiAPI, CedictGuiAPI } = require('../js/gui-api.js');


describe('#GUI API', function () {
	
	describe('#Hanzi GUI API', function () {

		before(function () {
			this.hanziGui = new HanziGuiAPI();
		});

		describe('#getEntriesDisplay()', function () {
			it('Returns the expected display', function () {
				expect(
					this.hanziGui.getEntriesDisplay(
						[
							{
								simplified: '的',
								mostCommonRanking: 1,
								strokeNumber: 8,
								radical: '白',
								radicalAndExtraStrokes: '白 + 3',
								pinyin: 'de',
								meaning: 'possessive, adjectival suffix',
								HSKLevel: 1,
								otherPinyin: [ 'dí', 'dì' ]
							},
							{                                        
								simplified: '他',                       
								mostCommonRanking: 10,                 
								strokeNumber: 5,                       
								radical: '人',                          
								radicalAndExtraStrokes: '人亻 + 3',      
								pinyin: 'tā',                          
								meaning: 'other, another; he, she, it',
								HSKLevel: 1                            
							}
						],
						'Hanzi GUI test'
					)
				).html.to.equal(
					`
					<table class="hanzi-table" id="hanzi-table">
						<caption class="hanzi-table-caption" id="hanzi-table-caption">
							Hanzi GUI test
						</caption>
						<thead class="hanzi-table-head" id="hanzi-table-head">
							<tr class="hanzi-table-thead-tr">
								<th class="hanzi-table-th"></th><th class="hanzi-table-th">Simplified</th><th class="hanzi-table-th">Traditional</th><th class="hanzi-table-th">Pinyin</th><th class="hanzi-table-th">Other Pinyin</th><th class="hanzi-table-th">Ranking</th><th class="hanzi-table-th">HSK Level</th><th class="hanzi-table-th">Radical</th><th class="hanzi-table-th">Strokes</th><th class="hanzi-table-th">Meaning</th>
							</tr>
						</thead>
						<tbody class="hanzi-table-body" id="hanzi-table-body">
							<tr class="hanzi-table-tr"><td class="hanzi-table-td"><a href="https://en.wiktionary.org/wiki/的" target="_blank">w</a></td><td class="hanzi-table-td"><a href="#type=hanzi&value=的">的</a></td><td class="hanzi-table-td">--</td><td class="hanzi-table-td">de</td><td class="hanzi-table-td">dí, dì</td><td class="hanzi-table-td">1</td><td class="hanzi-table-td">1</td><td class="hanzi-table-td"><a href="#type=radical&value=白">白</a> + 3</td><td class="hanzi-table-td">8</td><td class="hanzi-table-td">possessive, adjectival suffix</td></tr><tr class="hanzi-table-tr"><td class="hanzi-table-td"><a href="https://en.wiktionary.org/wiki/他" target="_blank">w</a></td><td class="hanzi-table-td"><a href="#type=hanzi&value=他">他</a></td><td class="hanzi-table-td">--</td><td class="hanzi-table-td">tā</td><td class="hanzi-table-td"> -- </td><td class="hanzi-table-td">10</td><td class="hanzi-table-td">1</td><td class="hanzi-table-td"><a href="#type=radical&value=人">人</a>亻 + 3</td><td class="hanzi-table-td">5</td><td class="hanzi-table-td">other, another; he, she, it</td></tr>
						</tbody>
					</table>
				`
				);
			});
		});

	});


	describe('#Cedict GUI API', function () {

		before(function () {
			this.cedictGui = new CedictGuiAPI();
		});

		describe('#getEntriesDisplay()', function () {
			it('Returns the expected display', function () {
				expect(
					this.cedictGui.getEntriesDisplay(
						[
							{ s:'学习', t:'學習', e:'to learn/to study', p:'xué xí' },
							{ s:'中', t:'中', e:'China/Chinese/surname Zhong', p:'Zhōng' }
						],
						'Cedict GUI test'
					)
				).html.to.equal(
					`
					<table class="cedict-table" id="cedict-table">
						<caption class="cedict-table-caption" id="cedict-table-caption">
							Cedict GUI test
						</caption>
						<thead class="cedict-table-head" id="cedict-table-head">
							<tr class="cedict-table-thead-tr">
								<th class="cedict-table-th"></th><th class="cedict-table-th">Simplified</th><th class="cedict-table-th">Traditional</th><th class="cedict-table-th">Pinyin</th><th class="cedict-table-th">Meaning</th>
							</tr>
						</thead>
						<tbody class="cedict-table-body" id="cedict-table-body">
							<tr class="cedict-table-tr"><td class="cedict-table-td"><a href="https://en.wiktionary.org/wiki/学习" target="_blank">w</a> <a href="#type=search&value=学习&search-lang=Ch">s</a> <a href="#type=cedict-entry&value=学习">→</a></td><td class="cedict-table-td"><a href="#type=hanzi&value=学">学</a><a href="#type=hanzi&value=习">习</a></td><td class="cedict-table-td">學習</td><td class="cedict-table-td">xué xí</td><td class="cedict-table-td">to learn/to study</td></tr><tr class="cedict-table-tr"><td class="cedict-table-td"><a href="https://en.wiktionary.org/wiki/中" target="_blank">w</a> <a href="#type=search&value=中&search-lang=Ch">s</a> <a href="#type=cedict-entry&value=中">→</a></td><td class="cedict-table-td"><a href="#type=hanzi&value=中">中</a></td><td class="cedict-table-td">中</td><td class="cedict-table-td">Zhōng</td><td class="cedict-table-td">China/Chinese/surname Zhong</td></tr>
						</tbody>
					</table>
				`
				);
			});
		});

	});

});