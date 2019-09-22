#! python3

import json, os
import pprint

from pinyin_parser import remove_pinyin_diacritics


def make_pinyin_and_pinyin_wod_index(hanzi_dict, dir_path, summary=False):
	"""Takes a dictionary with the hanzi data and the path of the
	directory where the output files will be written.
	Writes two filew with indices for the hanzi data, one based on
	the pinyin with diacritics and the other in the pinyin without
	the tone marks.
	If summary=True prints the indices.
	"""

	print('Creating hanzi pinyin indices...')

	pinyin_index = {}

	# Add hanzi to the pinyin entry in the pinyin index.
	# Notice that the hanzi are added in order of most common
	# to least common
	for hanzi in hanzi_dict.values():
		pinyin_index.setdefault(hanzi['pinyin'], [])
		pinyin_index[hanzi['pinyin']].append(hanzi['simplified'])
		# If hanzi has other pinyins add hanzi to other pinyins
		# entries too
		if not hanzi.get('otherPinyin') == None:
			for pinyin in hanzi['otherPinyin']:
				pinyin_index.setdefault(pinyin, [])
				pinyin_index[pinyin].append(hanzi['simplified'])

	# Create pinyin index file
	os.makedirs(os.path.abspath(dir_path), exist_ok=True)
	with open(os.path.join(dir_path, 'pinyinIndex.json'), 'w', encoding='utf8') as outfile:
		json.dump(pinyin_index, outfile, indent=4, ensure_ascii=False)


	# Create index for pinyin without diacritics

	pinyin_wod_index = {}

	# Add pinyin with diacritics to the entry of its version
	# without diacritics
	for pinyin in pinyin_index.keys():
		pinyin_wod = remove_pinyin_diacritics(pinyin)

		pinyin_wod_index.setdefault(pinyin_wod, [])
		if pinyin not in pinyin_wod_index[pinyin_wod]:
			pinyin_wod_index[pinyin_wod].append(pinyin)

	# Create pinyin without diacritics index file
	with open(os.path.join(dir_path, 'pinyinWODIndex.json'), 'w', encoding='utf8') as outfile:
		json.dump(pinyin_wod_index, outfile, indent=4, ensure_ascii=False)


	if summary == True:
		# Print pinyin index summary
		print('Created pinyinIndex.json with', str(len(pinyin_index)), 'entries:')
		pprint.pprint(pinyin_index)
		print()
		print()


		# Print pinyin without diacritics index summary
		print('Created pinyinWODIndex.json with', str(len(pinyin_wod_index)), 'entries:')
		pprint.pprint(pinyin_wod_index)
		print()


	# Print short summary of both indices
	print('Created pinyinIndex.json with', str(len(pinyin_index)), 'entries')
	print('Created pinyinWODIndex.json with', str(len(pinyin_wod_index)), 'entries')
	print()


if __name__ == '__main__':

	# Get hanzi data
	with open(os.path.join('data', 'hanzi.json'), 'r', encoding='utf8') as hanzi_file:
		hanzi_dict = json.load(hanzi_file)

	make_pinyin_and_pinyin_wod_index(hanzi_dict, 'indices', summary=True)

