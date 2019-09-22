#! python3

import json, os


def make_cedict_word_index(cedict_list, file_path):
	"""Takes a list of Cedict entries an the path for the output file.
	Creates an index for the entries based in their simplified hanzi
	and writes it in a JSON file.
	"""

	print('Creating Cedict word index...')

	cedict_word_index = {}

	# Iterate over all cedict entries to add them to index.
	for entry in cedict_list:

		simp = entry['s']

		# Add entry to index
		cedict_word_index.setdefault(simp, [])
		if simp not in cedict_word_index[simp]:
			cedict_word_index[simp].append(simp)

		# Add words with multiple hanzi to each of its individual hanzi's entries
		for hanzi in simp:
			cedict_word_index.setdefault(hanzi, [])
			if simp not in cedict_word_index[hanzi]:
				cedict_word_index[hanzi].append(simp)


	# Iterate through entries of individual hanzi in order to add words/phrases to
	# the entries of each of the shorter words present in them
	# (It actually iterates over all entries, but only the ones of individual hanzi are useful)
	for index_entry in cedict_word_index.values():
		# Compare every pair of words in the pinyin index entry to look for shorter words
		# present in longer words
		for word1 in index_entry:
			for word2 in index_entry:
				if word1 in word2 and word1 != word2:
					# Add the longest word to the shortest word's index entry 
					word1_index_entry = cedict_word_index[word1]
					if word2 not in word1_index_entry:
						word1_index_entry.append(word2)


	# remove redundant entries in the index (an entry whose only listed word is the entry key itself)
	cedict_word_index = {key: value for key, value in cedict_word_index.items() if len(value) > 1}

	# Sort index entries so shorter words appear first
	for index_entry in cedict_word_index.values():
		index_entry.sort(key = len)

	os.makedirs(os.path.dirname(os.path.abspath(file_path)), exist_ok=True)
	with open(file_path, 'w', encoding='utf8') as outfile:
		json.dump(cedict_word_index, outfile, indent=4, ensure_ascii=False)

	print('Created Cedict word index')
	print()


if __name__ == '__main__':

	# Get cedict data
	with open(os.path.join('data', 'cedict.json'), 'r', encoding='utf8') as cedict_file:
		cedict_list = json.load(cedict_file)

	make_cedict_word_index(cedict_list, os.path.join('indices', 'cedictWordIndex.json'))
