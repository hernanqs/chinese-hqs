function loadHSKPage(hskLevel) {

	let mainSection = document.getElementById('main-section');

	// Clear main section content
	mainSection.innerHTML = '';

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

	console.log(hskLevel);

	// Display table with hanzi where the radical appears
	mainSection.innerHTML += makeHanziTable(
		getHanziTableContent(HSKLevelIndex[hskLevel]),
		typeof hskLevel == 'number' ?
			`Hanzi in HSK level ${ hskLevel }`
			: 'Hanzi that are not in HSK'
		);

}

