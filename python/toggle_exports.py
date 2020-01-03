#! python3

import re

__export_format_1__ = re.compile(r'^(module.)?exports\..+ = .+;$')
__export_format_2__ = re.compile('^(module.)?exports = {.+};$')

def has_exports(input_address):
	"""	Takes the path to a JavaScript file.
	Returns True if the file contains exports, False if not.
	"""
	with open(input_address, 'r', encoding='utf-8') as input:
		for line in input.readlines():
			if ( __export_format_1__.search(line) or
			__export_format_2__.search(line) ):
				return True
		return False

def add_exports(input_address, export_name, format=2):
	"""	Takes the path to a JavaScript file and the name of the
	variable to be exported.
	Appends a line of code that exports the variable in the end
	of the file.
	"""
	with open(input_address, 'a', encoding='utf-8') as input:
		if format == 1:
			input.write(f'\nexports.{export_name} = {export_name};\n')
		else:
			input.write(f'\nmodule.exports = {{ {export_name} }};\n')

def remove_exports(input_address, extra_bytes=3):
	r"""Takes the path to a JavaScript file and a number of
	extra bytes.
	If any line of code contains an export, removes that line
	and all lines after it (assumes that all exports are at 
	the end of the file).
	The argument extra_bytes is the number of bytes you have
	to add to the result of len() (that counts characters) for
	seek() (that uses bytes) to move to the desired position.
	The default value (3) comes from 1 extra byte for the
	ending newline in Windows (that uses \r\n instead of \n)
	and 2 from the newline before the line.
	"""
	with open(input_address, 'r+', encoding='utf-8') as input:

		line = input.readline()
		while line:
			if (__export_format_1__.search(line)
				or __export_format_2__.search(line)):
				input.seek(input.tell() - (len(line) + extra_bytes))
				input.truncate()

			line = input.readline()
