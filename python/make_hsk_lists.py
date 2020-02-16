#! python3

import csv, os
from list_class import List

fieldNames = [
	'Simplified',
	'Traditional',
	'Pinyin',
	'Meaning'
]
fieldKeys = ['s', 't', 'p', 'e']
fieldTypes = ['simpHanzi', 'tradHanzi', 'pinyin', 'english']

def get_sublist(infile_path, list_metadata, list_col_to_field_map):
	print('Creating', list_metadata['id'], 'list...')

	# Read list of HSK level words
	with open(infile_path, 'r', encoding='utf-8-sig') as file:
		csv_reader = csv.reader(file, delimiter='\t')
		list_content = []
		# Add only the simplified hanzi to the list
		for row in csv_reader:
			row_data = {}
			for idx, field in list_col_to_field_map:
				row_data[field] = row[idx]
			list_content.append(row_data)

	return List(list_metadata, list_content).get_data()


def get_hsk_sublist(hsk_level):
	list_col_to_field_map = [
			(0, 's'),
			(1, 't'),
			(3, 'p'),
			(4, 'e'),
		]

	return get_sublist(
			os.path.join('data', 'src', f'HSK {hsk_level} freq.txt'),
			{
				'id': f'hsk-{hsk_level}',
				'name': f'HSK {hsk_level}',
				'hasOwnData': True,
				'fieldNames': fieldNames,
				'fieldKeys': fieldKeys,
				'fieldTypes': fieldTypes

			},
			list_col_to_field_map
		)

def make_hsk_list():
	new_list = List({
		'id': 'hsk',
		'name': 'HSK',
		'hasOwnData': True,
		'hasSublists': True,
		'fieldNames': fieldNames,
		'fieldKeys': fieldKeys,
		'fieldTypes': fieldTypes
		},
		[
			get_hsk_sublist(1),
			get_hsk_sublist(2),
			get_hsk_sublist(3),
			get_hsk_sublist(4),
			get_hsk_sublist(5),
			get_hsk_sublist(6),
		])
	return new_list

if __name__ == '__main__':
	make_hsk_list().write(os.path.join('data', 'lists', 'hskList.json'))
