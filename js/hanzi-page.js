function loadHanziPage(hanzi) {

	let mainSection = document.getElementById('main-section');

	// Clear main section content
	mainSection.innerHTML = '';


	// Add hanzi card
	if (hanziDict[hanzi]) {
		mainSection.innerHTML += getHanziCard(hanzi, hanziDict);
	}
	// If hanzi is not in 3000 most common hanzi use cedict data instead
	else if (cedict[hanzi]) {
		mainSection.innerHTML += getCedictWordCard(hanzi, cedict);
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


	// Add table whith Cedict entries where the hanzi appears
	mainSection.innerHTML += makeCedictTable(
		getCedictTableContent(cedictWordIndex[hanzi]),
		'Cedict entries where the hanzi appears'
	);
	
}
