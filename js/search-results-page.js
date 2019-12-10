'use strict';
function loadResultsPage(searchText) {
	// let searchLanguage = getURLParams()['search-lang'];
	let searchLanguage = getHashParams()['search-lang'];

	let hanziResults = [], cedictResults = [];

	if (searchLanguage == 'Ch') {
		hanziResults = hanziData.searchChinese(searchText);
		cedictResults = cedictData.searchChinese(searchText);
	} else if (searchLanguage == 'En') {
		hanziResults = hanziData.searchEnglish(searchText);
		cedictResults = cedictData.searchEnglish(searchText);
	}

	let mainSection = document.getElementById('main-section');

	// Clear main section content
	mainSection.innerHTML = '';

	mainSection.innerHTML += `<h1 class="search-results-h1">Results for "${ searchText }"</h1>`;

	// Add results from hanzi search
	try {
		if (hanziResults.length > 0) {
			mainSection.innerHTML += hanziGui.getEntriesDisplay(
				hanziResults,
				hanziResults.length + ' result(s) from 3000 most common hanzi'
				);

		} else {
			mainSection.innerHTML += `
				<p class="results-not-found">
					Results not found in 3000 most common hanzi
				</p>
			`;

		}
	} catch (error) {
		console.log(error);
		displayErrorMessage();
	}

	// Add results from cedict search
	try {
		if (cedictResults.length > 0) {
			mainSection.innerHTML += cedictGui.getEntriesDisplay(
				cedictResults,
				cedictResults.length + ' result(s) from Cedict'
				);

		} else {
			mainSection.innerHTML += `
				<p class="results-not-found">
					Results not found in Cedict
				</p>
			`;
		}
	} catch (error) {
		console.log(error);
		displayErrorMessage();
	}

}

