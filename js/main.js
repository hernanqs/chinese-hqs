function hashRedirected() {
	// Map from type of page requested to the function to load the page
	let pageTypeToLoadFunctionMap = {
		'search': loadResultsPage,
		'hanzi': loadHanziPage,
		'radical': loadRadicalPage
	};

	// Scroll to top of the page
	window.scrollTo(0, 0);

	if (location.hash) {
		// Get requested type and value from location
		let type = location.hash.slice(1).split('/')[0];
		let value = decodeURIComponent(location.hash.slice(1).split('/')[1]);

		// Go to the requested page
		let loadPage = pageTypeToLoadFunctionMap[type];
		loadPage(value);
	}
}

// Load the current page in case the user has reloaded the page
hashRedirected();

// Load the requested page each time the user redirects
window.onhashchange = hashRedirected;


// Navbar dropdowns
let radicalsDropdownDiv = document.getElementById('radicals-dropdown-div');
radicalsDropdownDiv.innerHTML += getRadicalsUl();


// Search function

// Get HTML search form elements
let searchForm = document.getElementById('search-form');
let searchText = document.getElementById('search-text');

searchForm.addEventListener('submit', handleSearchSubmit);


function handleSearchSubmit (e) {
	// Prevent reloading the page
	e.preventDefault();

	// Get requested search word from form
	let searchWord = searchText.value.trim();

	// Go to the requested page
	window.location.href = '#search/' + searchWord;
}
