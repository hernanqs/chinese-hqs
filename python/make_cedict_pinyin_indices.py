#! python3

import json, os

from pinyin_parser import remove_pinyin_diacritics


def make_cedict_pinyin_and_pinyin_wod_indices(cedict_list, dir_path):
	"""Takes a list of Cedict entries and the path of a directory where
	the files will be written.
	Writes two JSON files with indeces for the Cedict entries, one for
	the pinyin with diacritics and the other for the pinyin without
	the tone marks.
	"""

	print('Creating Cedict pinyin index...')

	pinyin_index = {}

	# Map from words in hanzi to their pinyin
	hanzi_to_pinyin_map = {}

	# Add hanzi to the pinyin entry in the pinyin index.
	for entry in cedict_list:
		# Add full word in hanzi to the pinyin entry corresponding to the full word
		pinyin = entry['p'].lower().replace(' ', '')
		simp = entry['s']

		# Add pinyin to the hanzi entry in hanzi_to_pinyin_map
		hanzi_to_pinyin_map.setdefault(simp, [])
		hanzi_to_pinyin_map[simp].append(pinyin)

		# Add entry to pinyin index
		pinyin_index.setdefault(pinyin, [])
		if simp not in pinyin_index[pinyin]:
			pinyin_index[pinyin].append(simp)

		# Add full word in hanzi to each of its individual hanzi's pinyin entries 
		pinyin_syllables = entry['p'].lower().split(' ')
		for syllable in pinyin_syllables:
			# if syllable != pinyin:
			pinyin_index.setdefault(syllable, [])
			if simp not in pinyin_index[syllable]:
				pinyin_index[syllable].append(simp)


	# Iterate through entries of individual syllables in order to add full words/phrases 
	# to the pinyin entries of each of the shorter words present in them
	# (It actually iterates over all entries, but only the ones of individual syllables are useful)
	for index_entry in pinyin_index.values():
		
		# Compare every pair of words in the pinyin index entry to look for shorter words
		# present in longer words
		for word1 in index_entry:
			for word2 in index_entry:
				if word1 in word2 and word1 != word2:

					# Iterate over each word 1's pinyins
					for word1_pinyin in hanzi_to_pinyin_map[word1]:
						# Add the longest word to the shortest word's index entry 
						word1_index_entry = pinyin_index[word1_pinyin]
						if word2 not in word1_index_entry:
							word1_index_entry.append(word2)


	# Sort index so shorter words appear first
	for index_entry in pinyin_index.values():
		index_entry.sort(key = len)

	os.makedirs(os.path.abspath(dir_path), exist_ok=True)
	with open(os.path.join(dir_path, 'cedictPinyinIndex.json'), 'w', encoding='utf8') as outfile:
		json.dump(pinyin_index, outfile, indent=4, ensure_ascii=False)

	print('Created Cedict pinyin index with ', str(len(pinyin_index.keys())), ' entries')
	print()


	# Create index for pinyin without diacritics

	print('Creating Cedict pinyin without diacritics index...')

	pinyin_wod_index = {}

	# Iterate over pinyin entries in the index and create a version
	# without the diacritics
	for pinyin in pinyin_index.keys():
		pinyin_wod = remove_pinyin_diacritics(pinyin)

		# Add the version without diacritics to the pinyin WOD index
		pinyin_wod_index.setdefault(pinyin_wod, [])
		if pinyin not in pinyin_wod_index[pinyin_wod]:
			pinyin_wod_index[pinyin_wod].append(pinyin)

	# Create the pinyin WOD index JSON file
	os.makedirs(os.path.abspath(dir_path), exist_ok=True)
	with open(os.path.join(dir_path, 'cedictPinyinWODIndex.json'), 'w', encoding='utf8') as outfile:
		json.dump(pinyin_wod_index, outfile, indent=4, ensure_ascii=False)

	print('Created Cedict pinyin index with ', str(len(pinyin_wod_index.keys())), ' entries')
	print()


if __name__ == '__main__':

	with open(os.path.join('data', 'cedict.json'), 'r', encoding='utf8') as cedict_file:
		cedict_list = json.load(cedict_file)

	make_cedict_pinyin_and_pinyin_wod_indices(cedict_list, 'indices')
