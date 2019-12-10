'use strict';
function loadRadicalPage(radical) {

	let mainSection = document.getElementById('main-section');

	// Clear main section content
	mainSection.innerHTML = '';

	// Display table with hanzi where the radical appears
	mainSection.innerHTML += hanziGui.getEntriesDisplay(
		hanziData.getEntries(radicalIndex[radical]),
		radicalIndex[radical].length + ' hanzi have this radical'
		);

}