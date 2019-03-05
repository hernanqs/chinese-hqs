function loadResultsPage(hanziResults, cedictResults) {
	// console.log(hanziResults, cedictResults);

	mainSection = document.getElementById('main-section');

	// Clear main section content
	mainSection.innerHTML = ''

	if (hanziResults.length > 0) {
		hanziTable = `
			<table class="hanzi-table" id="hanzi-table">
				<caption class="hanzi-table-caption" id="hanzi-table-caption">
					Results from 3000 most common hanzi				
				</caption>
				<thead class="hanzi-table-head" id="hanzi-table-head">
					<tr class="hanzi-table-tr hanzi-table-thead-tr">
						<th class="hanzi-table-th">Simplified</th>
						<th class="hanzi-table-th">Traditional</th>
						<th class="hanzi-table-th">Pinyin</th>
						<th class="hanzi-table-th">Other Pinyin</th>
						<th class="hanzi-table-th">Ranking</th>
						<th class="hanzi-table-th">HSK Level</th>
						<th class="hanzi-table-th">Radical</th>
						<th class="hanzi-table-th">Strokes</th>
						<th class="hanzi-table-th">Meaning</th>
					</tr>
				</thead>
				<tbody class="hanzi-table-body" id="hanzi-table-body">
				</tbody>
			</table>
			`;

		mainSection.innerHTML += hanziTable;

		resultsTableBody = document.getElementById('hanzi-table-body');
		fillHanziTable(resultsTableBody, searchResults);

	} else {
		mainSection.innerHTML += `
			<p class="results-not-found">
				Results not found in 3000 most common hanzi
			</p>
		`;

	}


	if (cedictResults.length > 0) {
		cedictTable = `
			<table class="cedict-table" id="cedict-table">
				<caption class="cedict-table-caption" id="cedict-table-caption">
					Results from Cedict
				</caption>
				<thead class="cedict-table-head" id="cedict-table-head">
					<tr class="cedict-table-tr cedict-table-thead-tr">
						<th class="cedict-table-th">Simplified</th>
						<th class="cedict-table-th">Traditional</th>
						<th class="cedict-table-th">Pinyin</th>
						<th class="cedict-table-th">Meaning</th>
					</tr>
				</thead>
				<tbody class="cedict-table-body" id="cedict-table-body">
				</tbody>
			</table>
		`;

		mainSection.innerHTML += cedictTable;

		cedictTableBody = document.getElementById('cedict-table-body');
		fillCedictTable(cedictTableBody, cedictSearchResults)

	} else {
		mainSection.innerHTML += `
			<p class="results-not-found">
				Results not found in Cedict
			</p>
		`;
	}

}

