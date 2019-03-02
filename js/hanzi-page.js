hanzi = decodeURIComponent(getURLParams().hanzi);

if (hanziDict[hanzi]) {
	hanziMap = getHanziIdContentMap(hanzi, hanziDict);

	populateHTMLById(hanziMap);
}


strokeOrderImg = document.getElementById('stroke-order-img');
strokeOrderImg.setAttribute('src', 'data/stroke-orders/' + hanzi + '-bw.png');
strokeOrderImg.setAttribute('alt', 'Stroke order for ' + hanzi);

strokeOrderDiv = document.getElementById('stroke-order-div');

let img = new Image();
img.src = 'data/stroke-orders/' + hanzi + '-bw.png';
img.onerror = function() {
	// console.log(false);
	strokeOrderDiv.innerHTML = '<a href="' +
		'http://www.google.com/search?q=' + hanzi + ' stroke order&tbm=isch' +
		'" target="_blank" id="search-stroke-order-link">Search the stroke order on Google Images</a>';
	// console.log(strokeOrderDiv.innerhtml);
}


simpWiktionaryLink = document.getElementById('simp-w-link');
simpWiktionaryLink.setAttribute('href', 'https://en.wiktionary.org/wiki/' + hanzi);




cedictTableBody = document.getElementById('cedict-table-body');
fillCedictTable(cedictTableBody, cedictWordIndex[hanzi])