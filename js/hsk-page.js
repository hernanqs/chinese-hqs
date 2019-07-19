function loadHSKPage(hskLevel) {

	let mainSection = document.getElementById('main-section');

	// Clear main section content
	mainSection.innerHTML = '';

	// Map the URL way of referring to the level with the key used in
	// the HSK level index
	let levelsMap = {
		'level-1': 1,
		'level-2': 2,
		'level-3': 3,
		'level-4': 4,
		'level-5': 5,
		'level-6': 6,
		'not-in-hsk': 'Not in HKS'
	}

	hskLevel = levelsMap[hskLevel];

	// Display table with hanzi where the radical appears
	mainSection.innerHTML += makeHanziTable(
		getHanziTableContent(HSKLevelIndex[hskLevel]),
		typeof hskLevel == 'number' ?
			`${ HSKLevelIndex[hskLevel].length } of 3000 most common hanzi are in HSK level ${ hskLevel }`
			: `${ HSKLevelIndex[hskLevel].length } of 3000 most common hanzi that are not in HSK`
		);

}

