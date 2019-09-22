#! python3

# Make tone maps from toneless vowels to vowels with tone diacritic
# for lower case vowels
__tone_maps__ = {
	'1': [
		('a', 'ā'), ('e', 'ē'),
		('iu', 'iū'),
		('ui', 'uī'),
		('o', 'ō'), ('ü', 'ǖ'),
		('i', 'ī'), ('u', 'ū')
	],
	'2': [
		('a', 'á'), ('e', 'é'),
		('iu', 'iú'),
		('ui', 'uí'),
		('o', 'ó'), ('ü', 'ǘ'),
		('i', 'í'), ('u', 'ú')
	],
	'3': [
		('a', 'ǎ'), ('e', 'ě'),
		('iu', 'iǔ'),
		('ui', 'uǐ'),
		('o', 'ǒ'), ('ü', 'ǚ'),
		('i', 'ǐ'), ('u', 'ǔ')
	],
	'4': [
		('a', 'à'), ('e', 'è'),
		('iu', 'iù'),
		('ui', 'uì'),
		('o', 'ò'), ('ü', 'ǜ'),
		('i', 'ì'), ('u', 'ù')
	],
}

# Make tone maps for lower and upper case vowels
__tone_maps_with_upper__ = {}

for tone_map in __tone_maps__.keys():
	__tone_maps_with_upper__[tone_map] = []

	for tone in __tone_maps__[tone_map]:
		__tone_maps_with_upper__[tone_map].append(tone)
		__tone_maps_with_upper__[tone_map].append((tone[0].upper(), tone[1].upper()))


def number_to_tone_mark(s, tone_maps=__tone_maps_with_upper__, umlauted_u='u:'):
	"""Takes a string with one or more pinyin syllables, if there
	are more than one syllables assumes that they are separeted
	by spaces.
	Returns a copy of the string that uses diacritics (e.g. "mā")
	instead of number notation (e.g. "ma1") to indicate tones.
	tone_maps is a dictionary containing lists of tuples that map
	from the number notation to the diacritics notation.
	If a string is passed to umlauted_u, replaces all matches of
	that strings with an 'ü'.
	"""

	# Split the words from the string
	words = s.split(' ')
	result = ''

	# Iterate over every word and add the tone mark to it
	for word in words:

		# If there is a value for umlauted_u, replace it with 'ü'
		if umlauted_u:
			word = word.replace(umlauted_u, 'ü')

		# If word does not have neutral tone, place tone diacritic
		# in the correct vowel
		if word[-1].isdecimal() and word[-1] != '5':

			tone = word[-1]
			toneless_pinyin = word[:-1]

			tmp = toneless_pinyin

			# Put the tone mark in the correct vowel
			for tone_map in tone_maps[tone]:

				if tone_map[0] in toneless_pinyin:
					tmp = toneless_pinyin.replace(tone_map[0], tone_map[1])
					break
				else:
					continue

			# In rare cases where the tone is in a consonant alone, leave the consonant 
			# followed by the tone number, so no information is lost
			if tmp == toneless_pinyin:
				result += word + ' '
				print('Unable to convert tone number to tone mark for \'' + word +'\'')

			else:
				result += tmp + ' '

		# If word has neutral tone, remove tone number
		elif word[-1] == '5':
			result += word[:-1] + ' '

		else:
			result += word + ' '

	return result.strip()


def remove_pinyin_diacritics(pinyin):
	"""Takes a string with pinyin text using diacritics to indicate
	tones (e.g. "mā") and umlauted u (e. g. lǜ).
	Return a copy of the string that doesn´t have any tone mark or 
	umlaut mark.
	"""

	pinyin_input = 'āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ'
	pinyin_without_diacritic_output = 'aaaaeeeeiiiioooouuuuuuuu'
	pinyin_translate_table = str.maketrans(pinyin_input, pinyin_without_diacritic_output)

	return pinyin.translate(pinyin_translate_table)

