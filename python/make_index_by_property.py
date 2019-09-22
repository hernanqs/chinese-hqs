#! python3

import json, os


def make_index_by_property(hanzi_dict, property_name, default, filename, dir_path):
	"""Takes a dictionary containing the hanzi data, the name of the
	property used to created the index, a default value name under 
	wich will be grouped the entries that has no value in the property,
	a name for the file and the path to the directory where the file
	will be written.
	Writes a JSON file with the index based in the property.
	"""

	print('Creating ' + filename + '...')

	index_dict = {}

	# Iterate over all hanzi to be included in the index
	for hanzi in hanzi_dict.values():
		# If hanzi has a value in the property used to build the index
		# add hanzi to that value's entry in the index
		if (hanzi.get(property_name)):
			index_dict.setdefault(hanzi[property_name], [])
			index_dict[hanzi[property_name]].append(hanzi['simplified'])
		# Else add hanzi to default entry
		else:
			index_dict.setdefault(default, [])
			index_dict[default].append(hanzi['simplified'])

	# Create index file
	os.makedirs(os.path.abspath(dir_path), exist_ok=True)
	with open(os.path.join(dir_path, filename + '.json'), 'w', encoding='utf8') as outfile:
		json.dump(index_dict, outfile, indent=4, ensure_ascii=False)

	# Print index summary
	print('Created', filename + '.json', 'with', str(len(index_dict)), 'entries of length:')
	for property_value, hanzi_list in index_dict.items():
		print(property_value, ': ', len(hanzi_list), sep='')
	print()


if __name__ == '__main__':

	# Get hanzi data
	with open(os.path.join('data', 'hanzi.json'), 'r', encoding='utf8') as hanzi_file:
		hanzi_dict = json.load(hanzi_file)

	# Create index by hanzi's HSK level
	make_index_by_property(hanzi_dict, 'HSKLevel', 'Not in HSK', 'HSKLevelIndex', 'indices')

	# Create index by hanzi's radical
	make_index_by_property(hanzi_dict, 'radical', 'No radical', 'radicalIndex', 'indices')
