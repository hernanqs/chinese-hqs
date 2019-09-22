#! python3

import os, json

from make_hanzi_data import make_hanzi_data
from cedict_parser import parse_cedict
from cedict_list_to_dict import cedict_list_to_dict
from download_wikimedia_stroke_orders import download_wikimedia_stroke_orders
from download_wikimedia_stroke_orders_list import download_wikimedia_stroke_orders_list
from make_hanzi_index import make_hanzi_index
from make_pinyin_indices import make_pinyin_and_pinyin_wod_index
from make_index_by_property import make_index_by_property
from make_english_indices import make_hanzi_english_index, make_cedict_english_index
from make_cedict_pinyin_indices import make_cedict_pinyin_and_pinyin_wod_indices
from make_cedict_word_index import make_cedict_word_index
from make_hsk_lists import make_hsk_list
from json_to_js import json_to_js


# Create hanzi data file from XLSX file
make_hanzi_data(os.path.join('data', 'src', 'Most Common 3000 Chinese.xlsx'), os.path.join('data', 'hanzi.json'))

# Get hanzi data
with open(os.path.join('data', 'hanzi.json'), 'r', encoding='utf8') as hanzi_file:
	hanzi_dict = json.load(hanzi_file)

# Load Cedict and store it as a dictionary
parse_cedict(os.path.join('data', 'src', 'cedict_ts.u8'), os.path.join('data', 'cedict.json'))

# Get cedict data
with open(os.path.join('data', 'cedict.json'), 'r', encoding='utf8') as cedict_file:
	cedict_list = json.load(cedict_file)

# Store Cedict as a dictionary
cedict_list_to_dict(cedict_list, os.path.join('data', 'cedictDict.json'))

# Download hanzi stroke order images from Wikimedia Commons Stroke Order Project
download_wikimedia_stroke_orders_list(os.path.join('data', 'stroke_orders_in_wikimedia.json'))
download_wikimedia_stroke_orders(
	os.path.join('data', 'stroke_orders_in_wikimedia.json'),
	os.path.join('..', 'data', 'stroke-orders')
	)

# Create indices for hanzi data
make_hanzi_index(hanzi_dict, os.path.join('indices', 'hanziIndex.json'))
make_pinyin_and_pinyin_wod_index(hanzi_dict, 'indices')
make_hanzi_english_index(hanzi_dict, os.path.join('indices', 'hanziEnglishIndex.json'))
make_index_by_property(hanzi_dict, 'HSKLevel', 'Not in HSK', 'HSKLevelIndex', 'indices')
make_index_by_property(hanzi_dict, 'radical', 'No radical', 'radicalIndex', 'indices')

# Create indices for Cedict data
make_cedict_word_index(cedict_list, os.path.join('indices', 'cedictWordIndex.json'))
make_cedict_pinyin_and_pinyin_wod_indices(cedict_list, 'indices')
make_cedict_english_index(cedict_list, os.path.join('indices', 'cedictEnglishIndex.json'))

# Create HSK levels lists
make_hsk_list(os.path.join('data', 'src', 'HSK 1 freq.txt'), os.path.join('data', 'lists', 'HSK1List.json'), 'HSK 1')
make_hsk_list(os.path.join('data', 'src', 'HSK 2 freq.txt'), os.path.join('data', 'lists', 'HSK2List.json'), 'HSK 2')
make_hsk_list(os.path.join('data', 'src', 'HSK 3 freq.txt'), os.path.join('data', 'lists', 'HSK3List.json'), 'HSK 3')
make_hsk_list(os.path.join('data', 'src', 'HSK 4 freq.txt'), os.path.join('data', 'lists', 'HSK4List.json'), 'HSK 4')
make_hsk_list(os.path.join('data', 'src', 'HSK 5 freq.txt'), os.path.join('data', 'lists', 'HSK5List.json'), 'HSK 5')
make_hsk_list(os.path.join('data', 'src', 'HSK 6 freq.txt'), os.path.join('data', 'lists', 'HSK6List.json'), 'HSK 6')


# Store data as a variable in a JS file (to avoid CORS issues in Chrome)

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

json_to_js(os.path.join('data', 'lists', 'HSK1List.json'), os.path.join('..', 'lists', 'HSK1List.js'), 'lists.HSK1List')
json_to_js(os.path.join('data', 'lists', 'HSK2List.json'), os.path.join('..', 'lists', 'HSK2List.js'), 'lists.HSK2List')
json_to_js(os.path.join('data', 'lists', 'HSK3List.json'), os.path.join('..', 'lists', 'HSK3List.js'), 'lists.HSK3List')
json_to_js(os.path.join('data', 'lists', 'HSK4List.json'), os.path.join('..', 'lists', 'HSK4List.js'), 'lists.HSK4List')
json_to_js(os.path.join('data', 'lists', 'HSK5List.json'), os.path.join('..', 'lists', 'HSK5List.js'), 'lists.HSK5List')
json_to_js(os.path.join('data', 'lists', 'HSK6List.json'), os.path.join('..', 'lists', 'HSK6List.js'), 'lists.HSK6List')
