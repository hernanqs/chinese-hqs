'use strict';

class DataAPI {

    // Takes a pinyin or hanzi word(s) in a string and searches if it matches
    // one or more entries in the data.
    // Returns the results of the search as an array of strings that are keys to
    // access the matched data entries.
    getKeysFromSearchChinese(searchText) {
        let diacriticsRegExp = /[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/i;

        let searchTextLower = searchText.toLowerCase().replace(/\s/g, '');

        let searchResults = []

        // Check if search word is hanzi
        if (this.hanziIdx[searchText]) {
            searchResults = this.hanziIdx[searchText];
        }
        // Check if search word is hanzi and had a redundant entry in the index (an entry whose
        // only listed word was the entry key itself), in this case the entry was removed from
        // the index (to reduce index size) and we have to check directly in the data
        else if (this.data[searchText]) {
            searchResults = [
                this.data[searchText]['simplified'] // if it's an entry from hanziData
                || this.data[searchText]['s'] // if it's from Cedict an has one entry for that key
                || this.data[searchText][0]['s'] // if it's from Cedict an has more than one entry for that key
            ];
        }
        // Check if search word is pinyin with tone marks
        else if (diacriticsRegExp.test(searchText) && this.pinyinIdx[searchTextLower]) {
            searchResults = this.pinyinIdx[searchTextLower];
        }
        // Check if search word is pinyin without tone marks
        else if (this.pinyinWODIdx[searchTextLower]) {
            // Join results from every pinyin with tones (in pinyinIdx) for the
            // pinyin without tone marks
            searchResults = this.pinyinWODIdx[searchTextLower].reduce(
                (acc, curr) => {
                    return acc.concat(this.pinyinIdx[curr])
                }, []);
            // Avoid duplicate results when a hanzi in most common hanzi has more
            // than one pinyin or when a cedict word has two syllables with the
            // same pinyin
            searchResults = [... new Set(searchResults)];
            // Sort results
            searchResults.sort(
                    (a, b) => this.sortFunction(a, b)
                );
        }

        return searchResults;
    }

    // Takes an English word (or words) in a string and searches if it matches
    // one or more entries in the data.
    // Returns the results of the search as an array of strings that are keys to
    // access the matched data entries.
    getKeysFromSearchEnglish(searchText) {
		searchText = searchText.toLowerCase();

		let searchResults = []

		// If there is more than one word in the text to search
		if (/\s/.test(searchText)) {
			// Split text into the different words
			let searchWords = searchText.split(' ');
			let resultsPerWord = [];
			// Get search results for every individual word
			for (let word of searchWords) {
				// Check if search word is in index
				if (this.englishIdx[word]) {
					resultsPerWord.push(this.englishIdx[word]);
				} else {
					resultsPerWord.push([]);
				}
			}
			// The search results will be the intersection of the results of the 
			// individual words (the entries were all words appear)
			searchResults = resultsPerWord.reduce((acc, cur) => {
				return acc.filter(el => cur.includes(el));
			});
		}
		// Else if search text is a single word, check if search word is in index
		else {
			if (this.englishIdx[searchText]) {
				searchResults = this.englishIdx[searchText];
			}
		}

		// Sort results
		searchResults.sort(
                (a, b) => this.sortFunction(a, b)
            );

		return searchResults;
	}

    // Takes a string representing a key in the data.
    // Returns true if the data has entries for the key,
    // false if not.
    has(key) {
        return this.data[key]? true : false;
    }

    // Takes a string to be used as a key to access one or more data entries.
	// Returns the matched data entries in an array. If no data entry matches
	// returs an array with an entry filled with default empty values.
    getEntriesFromOneKey(key) {
        let entries = [];
        if (!this.data[key]) {
            entries.push(this.getFilledEmptyEntry(key));
        } else
        if (Array.isArray(this.data[key])) {
            for (let subentry of this.data[key]) {
                entries.push(subentry);
            }
        } else {
            entries.push(this.data[key]);
        }
        return entries;
    }

    // Takes an array with one or more strings to be used as keys to access
    // one or more data entries.
    // Returns the matched data entries in an array.
    getEntries(keys) {
        let entries = [];
        if (Array.isArray(keys)){
            for (let key of keys) {
                entries = entries.concat(this.getEntriesFromOneKey(key));
            }
        }
        else {
            let key = keys;
            entries = entries.concat(this.getEntriesFromOneKey(key));
        }
        return entries;
    }

    // Takes a pinyin or hanzi word in a string and searches if it matches
    // one or more entries in the data.
    // Returns the matched data entries in an array.
    searchChinese(searchText) {
        return this.getEntries(this.getKeysFromSearchChinese(searchText))
    }

    // Takes an English word (or words) in a string and searches if it matches
    // one or more entries in the data.
    // Returns the matched data entries in an array.
    searchEnglish(searchText) {
        return this.getEntries(this.getKeysFromSearchEnglish(searchText))
    }


}

// API used to access the data from the 3000 most common hanzi list
class HanziDataAPI extends DataAPI {
    constructor() {
        super();
        this.data = hanziDict;
        this.hanziIdx = {};
        this.pinyinIdx = pinyinIndex;
        this.pinyinWODIdx = pinyinWODIndex;
        this.englishIdx = hanziEnglishIndex;
    }

    // Method used to sort hanzi results from most common to least common hanzi.
    sortFunction(a, b) {
        return this.data[a]['mostCommonRanking'] - this.data[b]['mostCommonRanking'];
    }

    // Takes the key of an entry that does not exists in the data.
    // Returns an entry with all fields filled by printable empty
    // value (is useful to avoid skipping the key when displaying
    // a list with values that are not in the data).
    getFilledEmptyEntry(key) {
        return {
            simplified: key,
            traditional: '--',
            pinyin: '--',
            otherPinyin: '--',
            mostCommonRanking: '--',
            HSKLevel: '--',
            radical: '--',
            radicalAndExtraStrokes: '--',
            strokeNumber: '--',
            meaning: '--'
        }
    }
}

// API used to access the data from Cedict
class CedictDataAPI extends DataAPI {
    constructor() {
        super();
        this.data = cedict;
        this.hanziIdx = cedictWordIndex;
        this.pinyinIdx = cedictPinyinIndex;
        this.pinyinWODIdx = cedictPinyinWODIndex;
        this.englishIdx = cedictEnglishIndex;
    }

    // Method used to sort cedict entries from shorter words to longer words (or phrases).
    sortFunction(a, b) {
        return a.length - b.length;
    }

    // Takes the key of an entry that does not exists in the data.
    // Returns an entry with all fields filled by printable empty
    // value (is useful to avoid skipping the key when displaying
    // a list with values that are not in the data).
    getFilledEmptyEntry(key) {
        return {
            s: key,
            t: '--',
            p: '--',
            e: '--',
        }
    }
}
