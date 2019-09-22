#! python3

import json, os


def make_hanzi_index(hanzi_dict, file_path):
	"""Takes a dictionary containing the hanzi data and a path for
	the output file.
	Writes a JSON file with the hanzi index.
	"""

	print('Creating hanzi index JSON file...')

	# Create dictionary to store hanzi index
	hanzi_index = {}

	# Iterate over every hanzi in hanzi data and add it to index
	for hanzi in hanzi_dict.values():
		hanzi_index.setdefault(hanzi['simplified'], [])
		hanzi_index[hanzi['simplified']].append(hanzi['simplified'])

		# If hanzi has traditional forms add them to the index
		if 'traditional' in hanzi:
			for trad_hanzi in hanzi['traditional']:
				hanzi_index.setdefault(trad_hanzi, [])
				if hanzi['simplified'] not in hanzi_index[trad_hanzi]:
					hanzi_index[trad_hanzi].append(hanzi['simplified'])

	# Create index file
	os.makedirs(os.path.dirname(os.path.abspath(file_path)), exist_ok=True)
	with open(file_path, 'w', encoding='utf8') as outfile:
		json.dump(hanzi_index, outfile, indent=4, ensure_ascii=False)

	print('Created hanzi index JSON file with', len(hanzi_index), 'entries')
	print()


if __name__ == '__main__':

	# Get hanzi data
	with open(os.path.join('data', 'hanzi.json'), 'r', encoding='utf8') as hanziFile:
		hanzi_dict = json.load(hanziFile)

	make_hanzi_index(hanzi_dict, os.path.join('indices', 'hanziIndex.json'))