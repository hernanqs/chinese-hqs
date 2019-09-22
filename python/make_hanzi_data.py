#! python3

import json, openpyxl, os, pprint


def make_hanzi_data(infile_path, outfile_path, summary=False):
	"""Takes the path to the XLMX file containing the hanzi data and
	a path for the output file.
	Writes a JSON file containing the hanzi data in an object
	(dictionary).
	"""

	print('Loading hanzi data from xlsx file...')

	# Load workbook
	wb = openpyxl.load_workbook(infile_path, data_only=True)
	sheet = wb.active

	print('Loaded hanzi data from xlsx file')

	print('Creating hanzi data json file...')

	# Get rows
	rows = tuple(sheet.rows)

	# Create dictionary to store hanzi data
	hanzi_dict = {}

	# Iterate over each hanzi
	for row in rows:
		try:
			# Store data for the individual hanzi
			hanzi = row[0].value
			hanzi_dict[hanzi] = {
				'simplified' : hanzi,
				'mostCommonRanking': int(row[4].value),
				'strokeNumber': int(row[5].value[:-1]),
				'radical': row[6].value[1],
				'radicalAndExtraStrokes': row[6].value[1:],
				'pinyin': row[7].value if type(row[7].value) is str else '',
				'meaning': row[9].value or '',
			}
			# Add traditional form of the hanzi (if any)
			if type(row[1].value) is str:
				hanzi_dict[hanzi]['traditional'] = row[1].value.strip().split(' ')
			# Add HSK level of the hanzi (if any)
			if type(row[3].value) is float:
				hanzi_dict[hanzi]['HSKLevel'] = int(row[3].value)
			# Add other pinyin (readings) of the hanzi (if any)
			if type(row[8].value) is str:
				hanzi_dict[hanzi]['otherPinyin'] = row[8].value.replace(' ', '').split(',')

		except Exception as e:
			print(row[4].value, e)
			

	del hanzi_dict['齐']['meaning']  # Its value seems to be an error, and since is a very long sequence of
									# numbers it affects the display of the page

	# Create hanzi data file
	os.makedirs(os.path.dirname(os.path.abspath(outfile_path)), exist_ok=True)
	with open(outfile_path, 'w', encoding='utf8') as outfile:
		json.dump(hanzi_dict, outfile, indent=4, ensure_ascii=False)

	print('Created hanzi data json file with', len(hanzi_dict), 'hanzi')
	if summary:
		pprint.pprint(hanzi_dict)
		print('Hanzi:', list(hanzi_dict.keys()))
	print()


if __name__ == '__main__':

	make_hanzi_data(os.path.join('data', 'src', 'Most Common 3000 Chinese.xlsx'),
		os.path.join('data', 'hanzi.json'),
		summary=True
		)