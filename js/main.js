let pageTypeToLoadFunctionMap = {
	'search': loadResultsPage,
	'hanzi': loadHanziPage,
	'radical': loadRadicalPage
};


function hashRedirected() {
	if (location.hash) {
		// Get requested type and value from location
		type = location.hash.slice(1).split('/')[0];
		value = decodeURIComponent(location.hash.slice(1).split('/')[1]);

		// Go to the requested page
		let loadPage = pageTypeToLoadFunctionMap[type];
		loadPage(value);
	}
}

hashRedirected();
window.onhashchange = hashRedirected;

// Search function

// Get HTML search form elements
var searchForm = document.getElementById('search-form');
var searchText = document.getElementById('search-text');

searchForm.addEventListener('submit', handleSearchSubmit);


function handleSearchSubmit (e) {
	// Prevent reloading the page
	e.preventDefault();

	// Get requested search word from form
	searchWord = searchText.value.trim();

	// Go to the requested page
	window.location.href = '#search/' + searchWord;
}
