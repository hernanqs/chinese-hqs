#! python3

import json, os


def cedict_list_to_dict(cedict_list, file_path):
	"""Takes a list containing Cedict definitions and a file path for
	the output file.
	Writes a JSON file with an object (dictionary) with the simplified
	forms of the hanzi as keys and the definitions as values.
	"""

	print('Converting Cedict from list to dictionary...')

	cedict_dict = {}

	# Iterate over every entry in the list and add it to the dictionary
	for entry in cedict_list:
		hanzi = entry['s']
		value = cedict_dict.get(hanzi, None)
		# If the entry for the hanzi does not exists in the dictionary,
		# create it
		if value == None:
			cedict_dict[hanzi] = entry
		# If the entry already exists, turn it into a list because
		# there is more than one entry for this hanzi
		elif type(value) == dict:
			cedict_dict[hanzi] = [value, entry]
		# If the entry already exists and is already a list, append
		# the new entry to it
		elif type(value) == list:
			cedict_dict[hanzi].append(entry)

	# Create the JSON file with the dictionary
	os.makedirs(os.path.dirname(os.path.abspath(file_path)), exist_ok=True)
	with open(file_path, 'w', encoding='utf8') as outfile:
		json.dump(cedict_dict, outfile, indent=4, ensure_ascii=False)

	print('Created Cedict dictionary JSON file')
	print()


if __name__ == '__main__':

	with open(os.path.join('data', 'cedict.json'), 'r', encoding='utf8') as cedict_file:
		cedict_list = json.load(cedict_file)

	cedict_list_to_dict(cedict_list, os.path.join('data', 'cedictDict.json'))
