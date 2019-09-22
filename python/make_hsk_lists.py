#! python3

import csv, json, os

def make_hsk_list(infile_path, outfile_path, list_title, list_type = 'cedict'):

	print('Creating', list_title, 'list...')

	hsk_list = {}
	hsk_list['title'] = list_title
	hsk_list['type'] = list_type

	# Read list of HSK level words
	with open(infile_path, 'r', encoding='utf-8-sig') as file:
		csv_reader = csv.reader(file, delimiter='\t')
		hsk_list['items'] = []
		# Add only the simplified hanzi to the list
		for row in csv_reader:
			hsk_list['items'].append(row[0])

	# Write the list in the output file
	os.makedirs(os.path.dirname(os.path.abspath(outfile_path)), exist_ok=True)
	with open(outfile_path, 'w', encoding='utf8') as outfile:
	    outfile.write(json.dumps(hsk_list, separators=(',',':'), indent=None, ensure_ascii=False))

	print('Created', list_title, 'list', 'with', str(len(hsk_list['items'])), 'items')
	print()


if __name__ == '__main__':

	make_hsk_list(os.path.join('data', 'src', 'HSK 1 freq.txt'), os.path.join('data', 'lists', 'HSK1List.json'), 'HSK 1')
	make_hsk_list(os.path.join('data', 'src', 'HSK 2 freq.txt'), os.path.join('data', 'lists', 'HSK2List.json'), 'HSK 2')
	make_hsk_list(os.path.join('data', 'src', 'HSK 3 freq.txt'), os.path.join('data', 'lists', 'HSK3List.json'), 'HSK 3')
	make_hsk_list(os.path.join('data', 'src', 'HSK 4 freq.txt'), os.path.join('data', 'lists', 'HSK4List.json'), 'HSK 4')
	make_hsk_list(os.path.join('data', 'src', 'HSK 5 freq.txt'), os.path.join('data', 'lists', 'HSK5List.json'), 'HSK 5')
	make_hsk_list(os.path.join('data', 'src', 'HSK 6 freq.txt'), os.path.join('data', 'lists', 'HSK6List.json'), 'HSK 6')
