'use strict';

var { expect, use } = require('chai');
use(require('chai-html'))

var { hskList } = require('../lists/hskList.js');
var { ListDataAPI } = require('../js/data-api.js');
var { HanziGuiAPI, CedictGuiAPI, ListGuiAPI } = require('../js/gui-api.js');


describe('#GUI API', function () {
	
	describe('#Hanzi GUI API', function () {

		before(function () {
			this.hanziGui = new HanziGuiAPI();
		});

		describe('#getTdContents()', function () {
			it('Returns an array with the expected content for each column', function () {
				expect(this.hanziGui.getTdContents(
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
				)).to.deep.equal([
					'<a href="https://en.wiktionary.org/wiki/他" target="_blank">w</a>',
					'<a href="#type=hanzi&value=他">他</a>',
					'--',
					'tā',
					'--',
					10,
					1,
					'<a href="#type=radical&value=人">人</a>亻 + 3',
					5,
					'other, another; he, she, it'
				]);
			});
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

		describe('#getCard()', function () {
			it('Returns the expected display', function () {
				expect(
					this.hanziGui.getCard([
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
						}
					])
				).html.to.equal(`
			<section class="hanzi-card">
				<div class="hanzi-card-simp-div">
					<p class="hanzi-card-simp" id="hanzi-card-simp">的</p>
					<a href="https://en.wiktionary.org/wiki/的" target="_blank">Wiktionary</a>
				</div>
				<div class="hanzi-data">
					<dl class="hanzi-data-dl">
						
						<dt class="hanzi-data-dt">
							Pinyin
						</dt>
						<dd class="hanzi-data-dd" id="hanzi-data-pinyin">
							de
						</dd>
						<dt class="hanzi-data-dt">
									Other pinyin
								</dt>
								<dd class="hanzi-data-dd" id="hanzi-data-other-pinyin">
									dí, dì
								</dd>
						<dt class="hanzi-data-dt">
							Radical
						</dt>
						<dd class="hanzi-data-dd" id="hanzi-data-radical">
							<a href="#type=radical&value=白">白</a> + 3
						</dd>
						<dt class="hanzi-data-dt">
							Ranking in most common hanzi
						</dt>
						<dd class="hanzi-data-dd" id="hanzi-data-most-common-ranking">
							1
						</dd>
						<dt class="hanzi-data-dt">
							HSK level
						</dt>
						<dd class="hanzi-data-dd" id="hanzi-data-hsk-level">
							1
						</dd>
						<dt class="hanzi-data-dt">
							Meaning
						</dt>
						<dd class="hanzi-data-dd" id="hanzi-data-meaning">
							possessive, adjectival suffix
						</dd>
					</dl>
				</div>
				<div class="stroke-order-div" id="stroke-order-div">
				</div>
			</section>
		`
				);
			});
		});

	});


	describe('#Cedict GUI API', function () {

		before(function () {
			this.cedictGui = new CedictGuiAPI();
		});

		describe('#getTdContents()', function () {
			it('Returns an array with the expected content for each column', function () {
				expect(this.cedictGui.getTdContents(
					{ s:'学习', t:'學習', e:'to learn/to study', p:'xué xí' },
				)).to.deep.equal([
					'<a href="https://en.wiktionary.org/wiki/学习" target="_blank">w</a> <a href="#type=search&value=学习&search-lang=Ch">s</a> <a href="#type=cedict-entry&value=学习">→</a>',
					'<a href="#type=hanzi&value=学">学</a><a href="#type=hanzi&value=习">习</a>',
					'學習',
					'xué xí',
					'to learn/to study'
				]);
			});
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


		describe('#getCard()', function () {
			it('Returns the expected display', function () {
				expect(
					this.cedictGui.getCard([
						{
							s: '的',
							t: '的',
							e: "of/~'s (possessive particle)/(used after an attribute)/(used to form a nominal expression)/(used at the end of a declarative sentence for emphasis)",
							p: 'de'
						},
						{ s: '的', t: '的', e: 'see 的士[dī shì]', p: 'dī' },
						{ s: '的', t: '的', e: 'really and truly', p: 'dí' },
						{ s: '的', t: '的', e: 'aim/clear', p: 'dì' }
					])
				).html.to.equal(`
			<section class="cedict-word-card">
				<div class="cedict-word-card-simp-div">
					<p class="cedict-word-card-simp" id="cedict-word-card-simp">的</p>
					<a href="https://en.wiktionary.org/wiki/的" target="_blank">Wiktionary</a>
				</div>
				<div class="cedict-word-data">
					<div class="cedict-word-definition">
				<dl class="cedict-word-data-dl">

					<dt class="cedict-word-data-dt">
						Traditional
					</dt>
					<dd class="cedict-word-data-dd" id="cedict-word-data-trad">
						的
					</dd>
					<dt class="cedict-word-data-dt">
						Pinyin
					</dt>
					<dd class="cedict-word-data-dd" id="cedict-word-data-pinyin">
						de
					</dd>
					<dt class="cedict-word-data-dt">
						Meaning
					</dt>
					<dd class="cedict-word-data-dd" id="cedict-word-data-meaning">
						of/~'s (possessive particle)/(used after an attribute)/(used to form a nominal expression)/(used at the end of a declarative sentence for emphasis)
					</dd>
				</dl>
		</div><div class="cedict-word-definition">
				<dl class="cedict-word-data-dl">

					<dt class="cedict-word-data-dt">
						Traditional
					</dt>
					<dd class="cedict-word-data-dd" id="cedict-word-data-trad">
						的
					</dd>
					<dt class="cedict-word-data-dt">
						Pinyin
					</dt>
					<dd class="cedict-word-data-dd" id="cedict-word-data-pinyin">
						dī
					</dd>
					<dt class="cedict-word-data-dt">
						Meaning
					</dt>
					<dd class="cedict-word-data-dd" id="cedict-word-data-meaning">
						see 的士[dī shì]
					</dd>
				</dl>
		</div><div class="cedict-word-definition">
				<dl class="cedict-word-data-dl">

					<dt class="cedict-word-data-dt">
						Traditional
					</dt>
					<dd class="cedict-word-data-dd" id="cedict-word-data-trad">
						的
					</dd>
					<dt class="cedict-word-data-dt">
						Pinyin
					</dt>
					<dd class="cedict-word-data-dd" id="cedict-word-data-pinyin">
						dí
					</dd>
					<dt class="cedict-word-data-dt">
						Meaning
					</dt>
					<dd class="cedict-word-data-dd" id="cedict-word-data-meaning">
						really and truly
					</dd>
				</dl>
		</div><div class="cedict-word-definition">
				<dl class="cedict-word-data-dl">

					<dt class="cedict-word-data-dt">
						Traditional
					</dt>
					<dd class="cedict-word-data-dd" id="cedict-word-data-trad">
						的
					</dd>
					<dt class="cedict-word-data-dt">
						Pinyin
					</dt>
					<dd class="cedict-word-data-dd" id="cedict-word-data-pinyin">
						dì
					</dd>
					<dt class="cedict-word-data-dt">
						Meaning
					</dt>
					<dd class="cedict-word-data-dd" id="cedict-word-data-meaning">
						aim/clear
					</dd>
				</dl>
		</div>
				</div>
				<div class="stroke-order-div" id="stroke-order-div">
				</div>
			</section>
		`
				);
			});
		});

	});


	describe('#list GUI API', function () {

		before(function () {
			this.listGui = new ListGuiAPI(new ListDataAPI(hskList.content[0]));
		});

		describe('#getTdContents()', function () {
			it('Returns an array with the expected content for each column', function () {
				expect(this.listGui.getTdContents(
					{ s: '汉语', t: '漢語', p: 'Hànyǔ', e: 'Chinese language' }
				)).to.deep.equal([
					'<a href="https://en.wiktionary.org/wiki/汉语" target="_blank">w</a> <a href="#type=search&value=汉语&search-lang=Ch">s</a> <a href="#type=cedict-entry&value=汉语">→</a>',
					'<a href="#type=hanzi&value=汉">汉</a><a href="#type=hanzi&value=语">语</a>',
					'漢語',
					'Hànyǔ',
					'Chinese language'
				]);
			});
		});

		describe('#getEntriesDisplay()', function () {
			it('Returns the expected display', function () {
				expect(
					this.listGui.getEntriesDisplay(
						[
							{ s:'学习', t:'學習', e:'to learn/to study', p:'xué xí' },
							{ s:'中', t:'中', e:'China/Chinese/surname Zhong', p:'Zhōng' }
						],
						'List GUI test'
					)
				).html.to.equal(`
			<table class="hsk-1-table" id="hsk-1-table">
				<caption class="hsk-1-table-caption" id="hsk-1-table-caption">
					List GUI test
				</caption>
				<thead class="hsk-1-table-head" id="hsk-1-table-head">
					<tr class="hsk-1-table-thead-tr">
						<th class="hsk-1-table-th"></th><th class="hsk-1-table-th">Simplified</th><th class="hsk-1-table-th">Traditional</th><th class="hsk-1-table-th">Pinyin</th><th class="hsk-1-table-th">Meaning</th>
					</tr>
				</thead>
				<tbody class="hsk-1-table-body" id="hsk-1-table-body">
					<tr class="hsk-1-table-tr"><td class="hsk-1-table-td"><a href="https://en.wiktionary.org/wiki/学习" target="_blank">w</a> <a href="#type=search&value=学习&search-lang=Ch">s</a> <a href="#type=cedict-entry&value=学习">→</a></td><td class="hsk-1-table-td"><a href="#type=hanzi&value=学">学</a><a href="#type=hanzi&value=习">习</a></td><td class="hsk-1-table-td">學習</td><td class="hsk-1-table-td">xué xí</td><td class="hsk-1-table-td">to learn/to study</td></tr><tr class="hsk-1-table-tr"><td class="hsk-1-table-td"><a href="https://en.wiktionary.org/wiki/中" target="_blank">w</a> <a href="#type=search&value=中&search-lang=Ch">s</a> <a href="#type=cedict-entry&value=中">→</a></td><td class="hsk-1-table-td"><a href="#type=hanzi&value=中">中</a></td><td class="hsk-1-table-td">中</td><td class="hsk-1-table-td">Zhōng</td><td class="hsk-1-table-td">China/Chinese/surname Zhong</td></tr>
				</tbody>
			</table>
		`
				);
			});
		});

		describe('#iterEntry()', function () {
			it('Returns an array with the results of applying the passed function to each field of the entry', function () {
				expect(this.listGui.iterEntry(
					{ s: '汉语', t: '漢語', p: 'Hànyǔ', e: 'Chinese language' },
					(entry, fieldName, fieldKey, fieldType) =>
						[entry, fieldName, fieldKey, fieldType, entry[fieldKey]]
				)).to.deep.equal([
					[{ s: '汉语', t: '漢語', p: 'Hànyǔ', e: 'Chinese language' },  'Simplified', 's', 'simpHanzi', '汉语'],
					[{ s: '汉语', t: '漢語', p: 'Hànyǔ', e: 'Chinese language' },  'Traditional', 't', 'tradHanzi', '漢語'],
					[{ s: '汉语', t: '漢語', p: 'Hànyǔ', e: 'Chinese language' },  'Pinyin', 'p', 'pinyin', 'Hànyǔ'],
					[{ s: '汉语', t: '漢語', p: 'Hànyǔ', e: 'Chinese language' },  'Meaning', 'e', 'english', 'Chinese language'],
				]);
			});
		});

		describe('#getCard()', function () {
			it('Returns the expected display', function () {
				expect(
					this.listGui.getCard([
						{ s: '汉语', t: '漢語', p: 'Hànyǔ', e: 'Chinese language' }
					])
				).html.to.equal(`
			<section class="list-entry-card">
				<div class="list-entry-card-simp-div">
					<p class="list-entry-card-simp" id="list-entry-card-simp">汉语</p>
					<a href="https://en.wiktionary.org/wiki/汉语" target="_blank">Wiktionary</a>
				</div>
				<div class="list-entry-data">
					<div class="list-entry-definition"><dl class="list-entry-data-dl"><dt class="list-entry-data-dt">
					Traditional
				</dt>
				<dd class="list-entry-data-dd" id="list-entry-data-trad">
					漢語
				</dd><dt class="list-entry-data-dt">
					Pinyin
				</dt>
				<dd class="list-entry-data-dd" >
					Hànyǔ
				</dd><dt class="list-entry-data-dt">
					Meaning
				</dt>
				<dd class="list-entry-data-dd" >
					Chinese language
				</dd></dl></div>
				</div>
				<div class="stroke-order-div" id="stroke-order-div">
				</div>
			</section>
		`
				);
			});
		});

	});

});
