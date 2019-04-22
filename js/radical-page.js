function loadRadicalPage(radical) {

	let mainSection = document.getElementById('main-section');

	// Clear main section content
	mainSection.innerHTML = '';

	// Display table with hanzi where the radical appears
	mainSection.innerHTML += makeHanziTable(
		getHanziTableContent(radicalIndex[radical]),
		'Hanzi in which this radical appears'
		);

}