#! python3

import json, os

def json_to_js(input_file, output_file, variable_name):
	"""Takes the path of a JSON file, the path to the output JS file
	and the a name for a variable.
	Creates the output JS file and writes the content of the JSON
	file in it as the content of a variable with the passed name.
	"""

	print('Converting', input_file, 'into a JS file...')

	# Read the data from the JSON file
	with open(input_file, 'r', encoding='utf8') as infile:
		data = json.load(infile)

	# Create the JS file and store the data in varible in it
	os.makedirs(os.path.dirname(os.path.abspath(output_file)), exist_ok=True)
	with open(output_file, 'w', encoding='utf8') as outfile:
		output = variable_name + ' = ' + json.dumps(data, separators=(',',':'), indent=None, ensure_ascii=False) + ';\n'
		outfile.write(output)

	print('Converted', input_file, 'into a JS file')
	print()


if __name__ == '__main__':

	json_to_js(os.path.join('data', 'hanzi.json'), os.path.join('..', 'data', 'hanzi.js'), 'hanziDict')
	json_to_js(os.path.join('data', 'cedictDict.json'), os.path.join('..', 'data', 'cedict.js'), 'cedict')

	json_to_js(os.path.join('indices', 'hanziIndex.json'), os.path.join('..', 'indices', 'hanziIndex.js'), 'hanziIndex')
	json_to_js(os.path.join('indices', 'pinyinIndex.json'), os.path.join('..', 'indices', 'pinyinIndex.js'), 'pinyinIndex')
	json_to_js(os.path.join('indices', 'pinyinWODIndex.json'), os.path.join('..', 'indices', 'pinyinWODIndex.js'), 'pinyinWODIndex')
	json_to_js(os.path.join('indices', 'HSKLevelIndex.json'), os.path.join('..', 'indices', 'HSKLevelIndex.js'), 'HSKLevelIndex')
	json_to_js(os.path.join('indices', 'radicalIndex.json'), os.path.join('..', 'indices', 'radicalIndex.js'), 'radicalIndex')
	json_to_js(os.path.join('indices', 'hanziEnglishIndex.json'), os.path.join('..', 'indices', 'hanziEnglishIndex.js'), 'hanziEnglishIndex')

	json_to_js(os.path.join('indices', 'cedictWordIndex.json'), os.path.join('..', 'indices', 'cedictWordIndex.js'), 'cedictWordIndex')
	json_to_js(os.path.join('indices', 'cedictPinyinIndex.json'), os.path.join('..', 'indices', 'cedictPinyinIndex.js'), 'cedictPinyinIndex')
	json_to_js(os.path.join('indices', 'cedictPinyinWODIndex.json'), os.path.join('..', 'indices', 'cedictPinyinWODIndex.js'), 'cedictPinyinWODIndex')
	json_to_js(os.path.join('indices', 'cedictEnglishIndex.json'), os.path.join('..', 'indices', 'cedictEnglishIndex.js'), 'cedictEnglishIndex')

	json_to_js(os.path.join('data', 'lists', 'hskList.json'), os.path.join('..', 'lists', 'hskList.js'), 'hskList')
