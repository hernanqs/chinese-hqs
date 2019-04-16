function loadHanziPage(hanzi) {

	let mainSection = document.getElementById('main-section');

	// Clear main section content
	mainSection.innerHTML = '';


	// Fill hanzi section

	let hanziSection = `
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
			</div>
		</section>
	`;

	mainSection.innerHTML += hanziSection;


	if (hanziDict[hanzi]) {
		let hanziMap = getHanziIdContentMap(hanzi, hanziDict);

		populateHTMLById(hanziMap);
	}

	// Add stroke order image
	let img = new Image();
	img.src = 'data/stroke-orders/' + hanzi + '-bw.png';
	// If the image exists add image to the page
	img.onload = function() {
		let strokeOrderDiv = document.getElementById('stroke-order-div');
		strokeOrderDiv.innerHTML = `<img
			src="data/stroke-orders/${hanzi}-bw.png"
			alt="Stroke order for ${hanzi}"
			class="stroke-order-img"
			id="stroke-order-img">
		`;

	}
	// If the image does not exist, add link for searching the image in Google Images
	img.onerror = function() {
		let strokeOrderDiv = document.getElementById('stroke-order-div');
		strokeOrderDiv.innerHTML = `<a
			href="http://www.google.com/search?q=${hanzi} stroke order&tbm=isch"
			target="_blank"
			id="search-stroke-order-link">
				Search the stroke order on Google Images
			</a>
		`;
	}

	// Add link to Wiktionary entry on the hanzi
	let simpWiktionaryLink = document.getElementById('simp-w-link');
	simpWiktionaryLink.setAttribute('href', 'https://en.wiktionary.org/wiki/' + hanzi);


	// Add table whith Cedict entries where the hanzi appears
	mainSection.innerHTML += makeCedictTable(
		getCedictTableContent(cedictWordIndex[hanzi]),
		'Cedict entries where the hanzi appears'
	);
	
}
