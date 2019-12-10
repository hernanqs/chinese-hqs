'use strict';
function loadListPage(listName) {

	let mainSection = document.getElementById('main-section');

	// Clear main section content
	mainSection.innerHTML = '';

	mainSection.innerHTML += cedictGui.getEntriesDisplay(
		cedictData.getEntries(lists[listName].items),
		lists[listName].title
	);
}