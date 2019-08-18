'use strict';
// Handle hash redirection, by loading the requested page
function hashRedirected() {
	try {
		// Map from type of page requested to the function to load the page
		let pageTypeToLoadFunctionMap = {
			'search': loadResultsPage,
			'hanzi': loadHanziPage,
			'radical': loadRadicalPage,
			'hsk': loadHSKPage,
			'list': loadListPage,
			'cedict-entry': loadCedictEntryPage,
		};
		
		// Scroll to top of the page
		window.scrollTo(0, 0);

		if (location.hash) {
				// Get requested type and value from location
			let hashParams = getHashParams();
			let type = hashParams['type'];
			let value = hashParams['value'];
			
			// Go to the requested page
			let loadPage = pageTypeToLoadFunctionMap[type];
			loadPage(value);
		}
	} catch (error) {
		console.log(error);
		displayErrorMessage();
	}
}

// Load the current page in case the user has reloaded the page
hashRedirected();

// Load the requested page each time the user redirects
window.onhashchange = hashRedirected;


// Fill navbar dropdowns
var radicalsDropdownDiv = document.getElementById('radicals-dropdown-container');
radicalsDropdownDiv.innerHTML += getRadicalsDropdown();

var HSKLevelsDropdownDiv = document.getElementById('hsk-levels-dropdown-container');
HSKLevelsDropdownDiv.innerHTML += getHSKLevelsDropdown();


// Search function

// Get HTML search form elements
var searchForm = document.getElementById('search-form');
var searchTextInput = document.getElementById('search-text');
var searchEnglishInput = document.getElementById('search-english');

searchForm.addEventListener('submit', handleSearchSubmit);


function handleSearchSubmit (e) {
	try {
		// Prevent reloading the page
		e.preventDefault();
		
		// Get requested search word from form
		let searchText = searchTextInput.value.trim().replace(/[,/#?=.]/, ' ').replace(/ +/, ' ');
		
		// Get search language (chinese is the default)
		let searchLanguage = searchEnglishInput.checked? 'En' : 'Ch';
		
		// Redirect to the search results page for the searched terms
		// window.location.href = '#search/' + searchText + '?search-lang=' + searchLanguage;
		window.location.href = '#type=search&value=' + searchText + '&search-lang=' + searchLanguage;
	} catch (error) {
		console.log(error);
		displayErrorMessage();
	}
}

// Register service worker
if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('sw.js')
		.then((reg) => console.log('Registration succeeded'))
		.catch((err) => console.log('Registration failed', err));
} else {
	console.log('serviceWorker not in navigator');
}