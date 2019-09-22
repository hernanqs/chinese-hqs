#! python3

# This file is a modified version of Github user hermanschaaf's cedict parser
# Github repository: https://github.com/hermanschaaf/cedict-parser
# Original license:
# "THE BEER-WARE LICENSE" (Revision 42):
# <herman@ironzebra.com> wrote this package. As long as you retain this notice you
# can do whatever you want with this stuff. If we meet some day, and you think
# this stuff is worth it, you can buy me a beer in return Herman Schaaf

import codecs
import json
import re
import os

from pinyin_parser import number_to_tone_mark


def parse_cedict(infile_path, outfile_path):
	"""Takes a path to a Cedict U8 file and a path for the output file.
	Reads the U8 file and writes a JSON file with a list with
	all Cedict definitions in the U8 file.
	"""

	print('Parsing Cedict...')

	f = codecs.open(infile_path, 'r', 'utf8')

	c = 0

	new_words = []
	for line in f:
		if line.startswith('#'):
			continue
		trad, simp = line.split(' ')[:2]
		pinyin = line[line.find('[')+1:line.find(']')]
		eng = line[line.find('/') + 1:line.rfind('/')]
		
		# Convert pinyin in the english definitions from using
		# tone numbers to tone marks
		try:
			eng = re.sub(
					r'\[[1-5a-zA-Z\s,:·]+\]',
					lambda x:
						'[' + number_to_tone_mark(
							x.group()[1:-1], umlauted_u='u:'
						) + ']',
					eng
					)
		except:
			# print('Except:', simp,
			#     line[line.find('/') + 1:line.rfind('/')])
			pass

		word = {'s': simp,
				't': trad,
				'e': eng,
				'p': number_to_tone_mark(pinyin)
				}

		new_words.append(word)

	f.close()

	os.makedirs(os.path.dirname(os.path.abspath(outfile_path)), exist_ok=True)
	with open(outfile_path, 'w', encoding='utf8') as outfile:
		json.dump(new_words, outfile, indent=4, ensure_ascii=False)

	print('Created cedict.json file with %d words.' % len(new_words))
	print()


if __name__ == '__main__':

	parse_cedict(os.path.join('data', 'src', 'cedict_ts.u8'), os.path.join('data', 'cedict.json'))
