'use strict';
function loadListPage(listId) {

	let mainSection = document.getElementById('main-section');

	// Clear main section content
	mainSection.innerHTML = '';

	let list = lists.hskList.content[
		lists.hskList.content.findIndex(sublist => sublist.metadata.id === listId)
	];
	list = new ListDataAPI(list);

	mainSection.innerHTML += cedictGui.getEntriesDisplay(
		cedictData.getEntries(list.getAllKeys()),
		list.metadata.name
	);

}