// History
class History {
	constructor() {
		this.backward = []
		this.current =  []
		this.forward = []
	}
	getBackward() {
		return this.backward;
	}
	getForward() {
		return this.forward;
	}
	getCurrent() {
		return this.current;
	}
	getCurrentType() {
		return this.current[0];
	}
	getCurrentValue() {
		return this.current[1];
	}
	advance(page) {
		if (this.current.length > 0) {
			this.backward.push(this.current);
		}
		this.current = page;
		this.forward = [];
	}
	goBack() {
		this.forward.unshift(this.current);
		this.current = this.backward.pop();
	}
	goForward() {
		this.backward.push(this.current);
		this.current = this.forward.shift();
	}
}

// Create history object
let history = new History;

// Add event listeners to history buttons
backwardHistoryBtn = document.getElementById('backward-history-btn');
backwardHistoryBtn.addEventListener('click', handleHistoryButtons);

forwardHistoryBtn = document.getElementById('forward-history-btn');
forwardHistoryBtn.addEventListener('click', handleHistoryButtons);


function handleHistoryButtons(e) {
	// Go backwards or forwards in history
	if (e.target.id == "backward-history-btn") {
		if (history.getBackward().length === 0) {
			return;
		}
		history.goBack();
	}
	else if (e.target.id == "forward-history-btn") {
		if (history.getForward().length === 0) {
			return;
		}
		history.goForward();
	}
	else {
		console.log('Error at firing event')
		return;
	}

	// console.log('back', history.getBackward(), 'curr', history.getCurrent(), 'for', history.getForward());

	// Go to the requested page
	if (history.getCurrentType() == 'search') {
		loadResultsPage(history.getCurrentValue());
	}
	else if (history.getCurrentType() == 'hanzi') {
		loadHanziPage(history.getCurrentValue());
	}

}


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

	// Update history
	history.advance(['search', searchWord]);
	// console.log('back', history.getBackward(), 'curr', history.getCurrent(), 'for', history.getForward());

	// Go to the requested page
	loadResultsPage(searchWord);
}

function handleHanziLink(e) {
	// Get requested hanzi from button
	hanzi = e.getAttribute('href').split('/')[1];

	// Update history
	history.advance(['hanzi', hanzi]);
	// console.log('back', history.getBackward(), 'curr', history.getCurrent(), 'for', history.getForward());

	// Go to the requested page
	loadHanziPage(hanzi);
}

