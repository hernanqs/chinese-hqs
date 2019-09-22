#! python3

import os, nltk, re, json, string


__stop_words__ = nltk.corpus.stopwords.words("english")


def __is_meaningful_word__(word, definition_entry, def_sep):
	"""Takes an english word, the entry in which the word appears and the separator that is used
	between the different definitions of the entry
	Returns True if the word is a meaningful word in the entry, False if it is used as an
	auxiliary word
	"""

	# Check if the word is not in the list of english auxiliary word
	if word not in __stop_words__:
		return True
	# If it is, check if the word is used in its own or if it is a verb
	elif (re.search(re.compile(f'(?:^|{def_sep} *){word}(?:$|{def_sep})'), definition_entry)
			or word == 'be' or word == 'have' or word == 'do' 
			):
		return True
	# Else return False
	return False


def __get_definition_words__(definition_entry, def_sep):
	"""Takes an entry with one or more english definitions in it and the separator that is used
	between the different definitions of the entry
	Returns a list with the words that apear in the entry
	"""

	definition_entry = definition_entry.lower()
	# Get the meaningful words of the entry
	definition_words = list(set([word for word in re.split(' |' + def_sep, definition_entry) \
					if word and __is_meaningful_word__(word, definition_entry, def_sep)]))
	# If the list of words is empty after removing auxiliary words, get all words
	if len(definition_words) == 0:
		definition_words = list(set([word for word in re.split(' |' + def_sep, definition_entry)]))
	return definition_words


def make_hanzi_english_index(hanzi_dict, file_path):
	"""Takes a dictionary with the hanzi data and the path for the
	output file.
	Creates a JSON file with the hanzi english index (index used to
	search the chinese hanzi by the english words in their definition).
	"""

	print('Creating hanzi english index...')
	hanzi_def_separators = '[,;]'
	hanzi_english_index = {}
	# Iterate over the different hanzi entries
	for hanzi in hanzi_dict.values():
		# Get the english words in the definition of the hanzi
		definition_words = __get_definition_words__(hanzi.get('meaning', ''), hanzi_def_separators)
		# Iterate over the english words and add the hanzi to the index entry of each word
		for word in definition_words:
			hanzi_english_index.setdefault(word, [])
			hanzi_english_index[word].append(hanzi['simplified'])

	# Create hanzi english index file
	os.makedirs(os.path.dirname(os.path.abspath(file_path)), exist_ok=True)
	with open(file_path, 'w', encoding='utf8') as outfile:
		json.dump(hanzi_english_index, outfile, indent=4, ensure_ascii=False)

	print('Created hanzi english index with ' + str(len(hanzi_english_index)) + ' entries')
	print()


# Make map with punctuation signs to be removed from definitions
__punctuation__ = string.punctuation.translate({ord(char): None for char in '/-\''})
__punctuation_map__ = {ord(char): None for char in __punctuation__}


def __clean_cedict_definition__(definition):
	"""Takes an english definition from Cedict
	Returns the definition after removing the unnecessary punctuation signs
	"""

	definition = re.sub(re.compile(r'(see also |see |abbr. for )?\S+\[.+\]'), '', definition)
	definition = definition.translate(__punctuation_map__)
	return definition


def make_cedict_english_index(cedict_list, file_path):
	"""Takes a list of Cedict entries (in dictionaries) and the path
	for the output file.
	Creates a JSON file with the Cedict english index (index used to
	search the chinese words by the english words in their definition).
	"""

	print('Creating Cedict english index...')
	cedict_english_index = {}
	# Iterate the entries
	for entry in cedict_list:
		# Remove unnecesary punctuation from definition
		definition = __clean_cedict_definition__(entry['e'])
		# Get the words in the definition and check that the list of words
		# is not empty
		definition_words = __get_definition_words__(definition, '/')
		if len(definition_words) == 0:
			print('len(definition_words) == 0', definition_entry)
		# Iterate over the english words and add the chinese word to the
		# index entry of each word
		for word in definition_words:
			cedict_english_index.setdefault(word, [])
			cedict_english_index[word].append(entry['s'])

	# Create hanzi english index file
	os.makedirs(os.path.dirname(os.path.abspath(file_path)), exist_ok=True)
	with open(file_path, 'w', encoding='utf8') as outfile:
		json.dump(cedict_english_index, outfile, indent=4, ensure_ascii=False)

	print('Created Cedict english index with ' + str(len(cedict_english_index)) + ' entries')
	print()


if __name__ == '__main__':

	# Get hanzi data
	with open(os.path.join('data', 'hanzi.json'), 'r', encoding='utf8') as hanzi_file:
		hanzi_dict = json.load(hanzi_file)

	make_hanzi_english_index(hanzi_dict, os.path.join('indices', 'hanziEnglishIndex.json'))

	# Get cedict data
	with open(os.path.join('data', 'cedict.json'), 'r', encoding='utf8') as cedict_file:
		cedict_list = json.load(cedict_file)

	make_cedict_english_index(cedict_list, os.path.join('indices', 'cedictEnglishIndex.json'))
