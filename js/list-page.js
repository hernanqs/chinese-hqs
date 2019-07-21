function loadListPage(listName) {

	let mainSection = document.getElementById('main-section');

	// Clear main section content
	mainSection.innerHTML = '';

	// Display table with the list
	mainSection.innerHTML += makeCedictTable(
		getCedictTableContent(lists[listName].items),
		lists[listName].title
	);
}

