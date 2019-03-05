// hanzi = decodeURIComponent(getURLParams().hanzi);

// loadHanziPage(hanzi);

function loadHanziPage(hanzi) {

	mainSection = document.getElementById('main-section');

	// Clear main section content
	mainSection.innerHTML = ''


	// Fill hanzi section

	hanziSection = `
		<section class="hanzi-section">
			<div class="simp-div">
				<p class="simp" id="simp"></p>
				<a href="" target="_blank" id="simp-w-link">Wiktionary</a>
			</div>
			<div class="hanzi-data">
				<dl class="hanzi-data-dl">

					<dt class="hanzi-data-dt">
						Traditional
					</dt>
					<dd class="hanzi-data-dd" id="trad"></dd>

					<dt class="hanzi-data-dt">
						Pinyin
					</dt>
					<dd class="hanzi-data-dd" id="pinyin"></dd>

					<dt class="hanzi-data-dt">
						Other pinyin
					</dt>
					<dd class="hanzi-data-dd" id="other-pinyin"></dd>

					<dt class="hanzi-data-dt">
						Radical
					</dt>
					<dd class="hanzi-data-dd" id="radical"></dd>

					<dt class="hanzi-data-dt">
						Ranking in most common hanzi
					</dt>
					<dd class="hanzi-data-dd" id="most-common-ranking"></dd>

					<dt class="hanzi-data-dt">
						HKS level
					</dt>
					<dd class="hanzi-data-dd" id="hks-level"></dd>

					<dt class="hanzi-data-dt">
						Meaning
					</dt>
					<dd class="hanzi-data-dd" id="meaning"></dd>
				</dl>
			</div>
			<div class="stroke-order-div" id="stroke-order-div">
				<img src="" alt="" class="stroke-order-img" id="stroke-order-img">
			</div>
		</section>
	`;

	mainSection.innerHTML += hanziSection;


	if (hanziDict[hanzi]) {
		hanziMap = getHanziIdContentMap(hanzi, hanziDict);

		populateHTMLById(hanziMap);
	}

	strokeOrderImg = document.getElementById('stroke-order-img');
	strokeOrderImg.setAttribute('src', 'data/stroke-orders/' + hanzi + '-bw.png');
	strokeOrderImg.setAttribute('alt', 'Stroke order for ' + hanzi);

	strokeOrderDiv = document.getElementById('stroke-order-div');

	let img = new Image();
	img.src = 'data/stroke-orders/' + hanzi + '-bw.png';
	img.onerror = function() {
		// console.log(false);
		strokeOrderDiv.innerHTML = '<a href="' +
			'http://www.google.com/search?q=' + hanzi + ' stroke order&tbm=isch' +
			'" target="_blank" id="search-stroke-order-link">Search the stroke order on Google Images</a>';
		// console.log(strokeOrderDiv.innerhtml);
	}


	simpWiktionaryLink = document.getElementById('simp-w-link');
	simpWiktionaryLink.setAttribute('href', 'https://en.wiktionary.org/wiki/' + hanzi);


	// Fill Cedict table

	cedictTable = `
		<table class="cedict-table" id="cedict-table">
			<caption class="cedict-table-caption" id="cedict-table-caption">
				Cedict entries in which the hanzi appears
			</caption>
			<thead class="cedict-table-head" id="cedict-table-head">
				<tr class="cedict-table-tr cedict-table-thead-tr">
					<th class="cedict-table-th">Simplified</th>
					<th class="cedict-table-th">Traditional</th>
					<th class="cedict-table-th">Pinyin</th>
					<th class="cedict-table-th">Meaning</th>
				</tr>
			</thead>
			<tbody class="cedict-table-body" id="cedict-table-body">
			</tbody>
		</table>
		`;

	mainSection.innerHTML += cedictTable;


	cedictTableBody = document.getElementById('cedict-table-body');
	fillCedictTable(cedictTableBody, cedictWordIndex[hanzi])
	
}
