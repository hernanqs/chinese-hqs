function loadResultsPage(searchText) {
	// let searchLanguage = getURLParams()['search-lang'];
	let searchLanguage = getHashParams()['search-lang'];

	let hanziResults = [], cedictResults = [];

	if (searchLanguage == 'Ch') {
		hanziResults = getHanziSearchResults(searchText);
		cedictResults = getCedictSearchResults(searchText);
	} else if (searchLanguage == 'En') {
		hanziResults = getHanziEnglishSearchResults(searchText);
		cedictResults = getCedictEnglishSearchResults(searchText);
	}

	let mainSection = document.getElementById('main-section');

	// Clear main section content
	mainSection.innerHTML = '';

	mainSection.innerHTML += `<h1 class="search-results-h1">Results for "${ searchText }"</h1>`;

	// Add results from hanzi search
	if (hanziResults.length > 0) {
		mainSection.innerHTML += makeHanziTable(
			getHanziTableContent(hanziResults),
			hanziResults.length + ' result(s) from 3000 most common hanzi'
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
			cedictResults.length + ' result(s) from Cedict'
			);

	} else {
		mainSection.innerHTML += `
			<p class="results-not-found">
				Results not found in Cedict
			</p>
		`;
	}

}

