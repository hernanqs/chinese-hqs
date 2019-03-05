// Search function

// Get HTML search form elements
var searchForm = document.getElementById('search-form');
var searchText = document.getElementById('search-text');

searchForm.addEventListener('submit', handleSearch);

function handleSearch (e) {
	// Prevent reloading the page
	e.preventDefault();

	searchWord = searchText.value.trim();

	hanziResults = getHanziSearchResults(searchWord);
	cedictResults = getCedictSearchResults(searchWord);

	loadResultsPage(hanziResults, cedictResults);
}

function handleHanziLink(e) {
	hanzi = e.getAttribute('href').split('/')[1];
	console.log(hanzi);
	loadHanziPage(hanzi);
}

