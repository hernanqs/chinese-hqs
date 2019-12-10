'use strict';
function loadCedictEntryPage(cedictKey) {

	let mainSection = document.getElementById('main-section');

	// Clear main section content
	mainSection.innerHTML = '';

	// Add Cedict word card
	if (cedictData.has(cedictKey)) {
		mainSection.innerHTML += cedictGui.getCard(cedictData.getEntries(cedictKey));
	}

	// Get the hanzi that appear in the Cedict entry
	let hanziInKey = cedictKey.split('').filter(isHanzi);
	// Get the words that appear in the Cedict entry
	let wordsInKey = [];
	// Search the entries of the hanzi in the cedict index, in order to get all words (Cedict
	// entries) that appear inside the Cedict entry
	for (let hanzi of hanziInKey) {
		if (cedictData.has(hanzi)) {
			for (let entryInIndex of cedictData.getKeysFromSearchChinese(hanzi)) {
				if (cedictKey.includes(entryInIndex)) {
					if (!wordsInKey.includes(entryInIndex) && entryInIndex !== cedictKey) {
						wordsInKey.push(entryInIndex);
					}
				}
			}
		}
	}

	// Add table whith the hanzi that appear in the Cedict entry
	if (hanziInKey.length > 0) {
		mainSection.innerHTML += hanziGui.getEntriesDisplay(
			hanziData.getEntries(hanziInKey),
			'Hanzi in the Cedict entry'
			);
	}

	// Add table whith the words that appear in the Cedict entry
	if (wordsInKey.length > 0) {
		mainSection.innerHTML += cedictGui.getEntriesDisplay(
			cedictData.getEntries(wordsInKey),
			'Words in the Cedict entry'
		);
	}
	
}
