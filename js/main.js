// Handle hash redirection, by loading the requested page
function hashRedirected() {
	// Map from type of page requested to the function to load the page
	let pageTypeToLoadFunctionMap = {
		'search': loadResultsPage,
		'hanzi': loadHanziPage,
		'radical': loadRadicalPage,
		'hsk': loadHSKPage
	};

	// Scroll to top of the page
	window.scrollTo(0, 0);

	if (location.hash) {
		// Get requested type and value from location
		let type = location.hash.slice(1).split('/')[0];
		let value = decodeURIComponent(location.hash.slice(1).split('/')[1].split('?')[0]);

		// Go to the requested page
		let loadPage = pageTypeToLoadFunctionMap[type];
		loadPage(value);
	}
}

// Load the current page in case the user has reloaded the page
hashRedirected();

// Load the requested page each time the user redirects
window.onhashchange = hashRedirected;


// Fill navbar dropdowns
let radicalsDropdownDiv = document.getElementById('radicals-dropdown-div');
radicalsDropdownDiv.innerHTML += getRadicalsUl();

let HSKLevelsDropdownDiv = document.getElementById('hsk-levels-dropdown-div');
HSKLevelsDropdownDiv.innerHTML += getHSKLevelsUl();


// Search function

// Get HTML search form elements
let searchForm = document.getElementById('search-form');
let searchTextInput = document.getElementById('search-text');
let searchEnglishInput = document.getElementById('search-english');

searchForm.addEventListener('submit', handleSearchSubmit);


function handleSearchSubmit (e) {
	// Prevent reloading the page
	e.preventDefault();

	// Get requested search word from form
	let searchText = searchTextInput.value.trim().replace(/[,/#?=]/, ' ').replace(/ +/, ' ');
	console.log(`searchtext:${searchText}`);

	// Get search language (chinese is the default)
	let searchLanguage = searchEnglishInput.checked? 'En' : 'Ch';
	console.log('main.js', searchLanguage);

	// Redirect to the search results page for the searched terms
	window.location.href = '#search/' + searchText + '?search-lang=' + searchLanguage;
}
