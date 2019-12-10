'use strict';
function loadHanziPage(hanzi) {

	let mainSection = document.getElementById('main-section');

	// Clear main section content
	mainSection.innerHTML = '';


	// Add hanzi card
	if (hanziData.has(hanzi)) {
		mainSection.innerHTML += hanziGui.getCard(hanziData.getEntries(hanzi));
	}
	// If hanzi is not in 3000 most common hanzi use cedict data instead
	else if (cedictData.has(hanzi)) {
		mainSection.innerHTML += cedictGui.getCard(cedictData.getEntries(hanzi));
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


	let cedictEntries = cedictData.searchChinese(hanzi);

	// Add table whith Cedict entries where the hanzi appears
	if (cedictEntries.length > 0) {
		mainSection.innerHTML += cedictGui.getEntriesDisplay(
			cedictEntries,
			'Cedict entries where the hanzi appears'
		);
	}

	// If there is no entry in Cedict for the requested hanzi
	else {
		mainSection.innerHTML += `<div><p>This hanzi does not appears in Cedict</p></div>`
	}
	
}
