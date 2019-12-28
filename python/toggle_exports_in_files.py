from toggle_exports import *
__exports_list__ = [

	('../data/hanzi.js', 'hanziDict'),
	('../indices/hanziEnglishIndex.js', 'hanziEnglishIndex'),
	('../indices/hanziIndex.js', 'hanziIndex'),
	('../indices/pinyinIndex.js', 'pinyinIndex'),
	('../indices/pinyinWODIndex.js', 'pinyinWODIndex'),

	('../js/data-api.js', ['HanziDataAPI', 'CedictDataAPI']),

	('../data/cedict.js', 'cedict'),
	('../indices/cedictEnglishIndex.js', 'cedictEnglishIndex'),
	('../indices/cedictPinyinIndex.js', 'cedictPinyinIndex'),
	('../indices/cedictPinyinWODIndex.js', 'cedictPinyinWODIndex'),
	('../indices/cedictWordIndex.js', 'cedictWordIndex'),

]

def toggle_exports_in_files(exports_list, operation=None):
	"""Takes a lists of tuples. The first element of each
	tuples is a string with the path to a .js file. The
	second element is a string with the name of a variable
	to be exported or a list of names of variables to be
	exported.
	If 'add' is passed to operation, adds the lines of code
	to export the variables in the files. If 'remove' is
	passed removes removes any export and the lines after it
	from the files. Else it detects if the first file has an
	export or not and adds or removes the export of all files
	accordingly.
	"""

	# Make sure it either adds the exports to all files or
	# removes them from all files
	if operation == 'add':
		add = True
	elif operation == 'remove':
		add = False
	else:
		add = False if has_exports(exports_list[0][0]) else True

	# Add/remove the export for each file
	for file_path, export_name in exports_list:
		if add:
			# If there is more than one export for the file
			# add them all
			if type(export_name) == list:
				toggle_exports_in_files(
					[(file_path, name) for name in export_name],
					'add'
				)
			else:
				add_exports(file_path, export_name)
		else:
				remove_exports(file_path)

if __name__ == '__main__':
		toggle_exports_in_files(__exports_list__)
