'use strict';
function loadCedictEntryPage(cedictEntry) {

	let mainSection = document.getElementById('main-section');

	// Clear main section content
	mainSection.innerHTML = '';


	// Add Cedict word card
	if (cedict[cedictEntry]) {
		mainSection.innerHTML += getCedictWordCard(cedictEntry, cedict);
	}

	// Get the hanzi that appear in the Cedict entry
	let hanziInEntry = cedictEntry.split('');
	// Get the words that appear in the Cedict entry
	let wordsInEntry = [];
	// Search the entries of the hanzi in the cedict index, in order to get all words (Cedict
	// entries) that appear inside the Cedict entry
	for (let hanzi of hanziInEntry) {
		for (let entryInIndex of cedictWordIndex[hanzi]) {
			if (cedictEntry.includes(entryInIndex)) {
				if (!wordsInEntry.includes(entryInIndex) && entryInIndex !== cedictEntry) {
					wordsInEntry.push(entryInIndex);
				}
			}
		}
	}

	// Add table whith the hanzi that appear in the Cedict entry
	if (hanziInEntry.length > 0) {
		mainSection.innerHTML += makeHanziTable(
			getHanziTableContent(hanziInEntry),
			'Hanzi in the Cedict entry'
			);

	}

	// Add table whith the words that appear in the Cedict entry
	if (wordsInEntry.length > 0) {
		mainSection.innerHTML += makeCedictTable(
			getCedictTableContent(wordsInEntry),
			'Words in the Cedict entry'
		);
	}

	
}
