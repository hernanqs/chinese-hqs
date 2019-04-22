function loadResultsPage(searchWord) {

	let hanziResults = getHanziSearchResults(searchWord);
	let cedictResults = getCedictSearchResults(searchWord);

	let mainSection = document.getElementById('main-section');

	// Clear main section content
	mainSection.innerHTML = '';

	// Add results from hanzi search
	if (hanziResults.length > 0) {
		mainSection.innerHTML += makeHanziTable(
			getHanziTableContent(hanziResults),
			'Results from 3000 most common hanzi'
			);

	} else {
		mainSection.innerHTML += `
			<p class="results-not-found">
				Results not found in 3000 most common hanzi
			</p>
		`;

	}

	// Add results from cedict search
	if (cedictResults.length > 0) {
		mainSection.innerHTML += makeCedictTable(
			getCedictTableContent(cedictResults),
			'Results from Cedict'
			);

	} else {
		mainSection.innerHTML += `
			<p class="results-not-found">
				Results not found in Cedict
			</p>
		`;
	}

}

