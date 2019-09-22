'use strict';
function loadHomepage() {

	let mainSection = document.getElementById('main-section');

	// Clear main section content
	mainSection.innerHTML = '';

	// Display homepage content
	mainSection.innerHTML += `
		<section class="homepage-content">
			<h1 class="homepage-h1">Welcome to Chinese HQS</h1>
			<p>
				This is a personal project I started to learn Chinese. In this site
				you can search Chinese words or hanzi by their pinyin writing, hanzi
				writing or English translation, you can see their English translation
				and the stroke order of the hanzi. You can also search hanzi by their
				radical and search Chinese words or hanzi by their HSK level.
			</p>
			<h2>How to use this site</h2>
			<p>
				You can go to
				<a href="https://github.com/hernanqs/chinese-hqs">
					https://github.com/hernanqs/chinese-hqs</a
				>, click the green “Clone or download” button on the right and click
				“Download as ZIP”. Then go to your Downloads folder and unzip the
				file. Open the unzipped folder and click the file named index.html, it
				will open the site in your default browser and you can bookmark it as
				any normal webpage, but it will be in your computer, so it will be
				faster and you can use it offline.
			</p>
			<p>Two important notes:</p>
			<p>
				The site does not have mobile support and is quite heavy, so do not
				try to use it in your phone.
			</p>
			<p>
				The site is meant to be used in updated versions of Firefox or Chrome,
				it may not work completely well in other browsers. It will not work
				properly in outdated browser.
			</p>
			<h2>How to use the search box</h2>
			<h3>Search by hanzi or pinyin writing</h3>
			<p>
				Write the hanzi or pinyin word(s) in the search box, make sure the
				“Ch” option on the right of the search box is selected (it is the
				default option) and click search.
			</p>
			<p>
				Chinese does not use spaces between words, so spaces will be ignored.
				Do not use punctuation marks.
			</p>
			<p>
				You can either write pinyin using tone marks and the umlaut, when
				needed, or you can write it without any kind of special mark. However,
				you cannot mix text with diacritics and text without them, if you use
				at least one tone mark or umlaut all toneless syllables will be
				considered to have the fifth tone and all “u” will be considered to be
				regular “u” without umlaut. This means that you can either search “lu”
				or “lǜ”, but “lü” will not yield any results.
			</p>
			<h3>Search by the English translation</h3>
			<p>
				Write the English word(s) in the search box, check that the “En”
				option on the right of the search box is selected and click search.
			</p>
			<p>
				If you want to search more than one English word you can separate them
				with spaces. It will yield only the results that contain all the words
				you searched.
			</p>
			<p>Do not use auxiliary words such as “the” or “a”.</p>
			<p>
				You can use apostrophes (e. g. to search “o’clock”), but you cannot
				use other punctuation marks.
			</p>
			<h3>Search by radical or HSK level</h3>
			<p>
				You can use the Radicals dropdown menu to see the hanzi grouped by
				their Kangxi radical. Radicals are ordered by the stroke order of
				their traditional form, this means that both “言” and “讠” are among
				the 7 strokes radicals, because “讠” is the simplified for of “言”.
			</p>
			<p>
				You can use the HSK dropdown menu to see the hanzi or words grouped by
				their level in the HSK tests.
			</p>

			<h2>Update this site's data</h2>
			<p>
				If you have Python installed in your computer you can run the files
				used to extract and format the data in this site. You may want to do
				this to check if there is are new stroke order images in Wikimedia
				(this does not happen very often) or to update the version of Cedict
				used. To update Cedict you have to go to
				<a href="https://cc-cedict.org/editor/editor.php?handler=Download">
					https://cc-cedict.org/editor/editor.php?handler=Download</a
				>, dowload the Cedict ZIP file extract it in the folder
				<i>python/data/src</i> (make sure the extracted file is called
				<i>cedict_ts.u8</i>) and run the file
				<i>update_data_and_indices.py</i> in the <i>python</i> folder. To
				check for the new stroke order image you only have to run the file
				<i>download_wikimedia_stroke_orders.py</i> in the
				<i>python</i> folder.
			</p>

			<h2>Data sources and licenses</h2>
			<p>
				The list and data of the 3000 most common hanzi was taken from this
				spreadsheet
				<a
					href="https://docs.google.com/spreadsheets/d/1j5-67vdCUeAuIzmikeCgNmXaFZTuXtT4vesjnrqSOjI/edit#gid=512136205"
				>
					https://docs.google.com/spreadsheets/d/1j5-67vdCUeAuIzmikeCgNmXaFZTuXtT4vesjnrqSOjI/edit#gid=512136205</a
				>. The order was taken from Jun Da's Modern Chinese Character
				Frequency List. More information can be found in
				<a href="https://ankiweb.net/shared/info/39888802">
					https://ankiweb.net/shared/info/39888802</a
				>.
			</p>
			<p>
				The stroke order images were taken from the Wikimedia Commons Stroke
				Order Project published under a GNU-Creative Commons 3.0 License. More
				information can be found in
				<a
					href="https://commons.wikimedia.org/wiki/Commons:Stroke_Order_Project"
				>
					http://commons.wikimedia.org/wiki/Commons:Stroke_Order_Project</a
				>. Visit
				https://commons.wikimedia.org/wiki/File:<i>INSERTYOURHANZIHERE</i>-bw.png
				to see the author of an individual image, most were made by user
				<a href="https://commons.wikimedia.org/wiki/User:M4RC0">M4RC0</a>.
			</p>
			<p>
				The Cedict data was taken from the CC-CEDICT project published under a
				<a href="https://creativecommons.org/licenses/by-sa/4.0/">
					Creative Commons Attribution-ShareAlike 4.0 International License</a
				>. More information can be found in
				<a href="https://cc-cedict.org/editor/editor.php">
					https://cc-cedict.org/editor/editor.php</a
				>.
			</p>
			<p>
				The lists of words in each HSK level were taken from
				<a href="http://www.hskhsk.com/word-lists.html">
					http://www.hskhsk.com/word-lists.html</a
				>.
			</p>
		</section>
	`

}