#! python3

import unittest, sys, os
from os import path
sys.path.append( path.dirname( path.dirname( path.abspath(__file__) ) ) )
import toggle_exports

class Test_toggle_exports(unittest.TestCase):

	def test_has_exports(self):
		# Export format 1: '^exports\..+ = .+;$'
		input_address = '__test_file_for_toggle_exports_unit_test.py'
		with open(input_address, 'w', encoding='utf-8') as file:
			file.write('First line.\nSecond line.\n')

		self.assertFalse(toggle_exports.has_exports(input_address))

		with open(input_address, 'a', encoding='utf-8') as file:
			file.write('\nexports.pinyinWODIndex = pinyinWODIndex;\n')

		self.assertTrue(toggle_exports.has_exports(input_address))

		os.remove(input_address)

		# Export format 2: '^exports = {.+};$'
		input_address = '__test_file_for_toggle_exports_unit_test.py'
		with open(input_address, 'w', encoding='utf-8') as file:
			file.write('First line.\nSecond line.\n')

		self.assertFalse(toggle_exports.has_exports(input_address))

		with open(input_address, 'a', encoding='utf-8') as file:
			file.write('\nexports = { pinyinWODIndex };\n')

		self.assertTrue(toggle_exports.has_exports(input_address))

		os.remove(input_address)


	def test_add_exports(self):
		# Export format 1:
		input_address = '__test_file_for_toggle_exports_unit_test.py'
		with open(input_address, 'w', encoding='utf-8') as file:
			file.write('First line.\nSecond line.\n')

		toggle_exports.add_exports(input_address, 'pinyinWODIndex', format=1)

		with open(input_address, 'r', encoding='utf-8') as file:
			file_content = file.read()

		self.assertIn('First line.\nSecond line.\n', file_content)
		self.assertIn('exports.pinyinWODIndex = pinyinWODIndex;', file_content)

		os.remove(input_address)

		# Export format 2:
		input_address = '__test_file_for_toggle_exports_unit_test.py'
		with open(input_address, 'w', encoding='utf-8') as file:
			file.write('First line.\nSecond line.\n')

		toggle_exports.add_exports(input_address, 'pinyinWODIndex')

		with open(input_address, 'r', encoding='utf-8') as file:
			file_content = file.read()

		self.assertIn('First line.\nSecond line.\n', file_content)
		self.assertIn('module.exports = { pinyinWODIndex };', file_content)

		os.remove(input_address)


	def test_remove_exports(self):
		# Export format 1: '^exports\..+ = .+$;'
		input_address = '__test_file_for_toggle_exports_unit_test.py'
		with open(input_address, 'w', encoding='utf-8') as file:
			file.write('First line.\nSecond line.\n\nexports.pinyinWODIndex = pinyinWODIndex;\n')

		toggle_exports.remove_exports(input_address)

		with open(input_address, 'r', encoding='utf-8') as file:
			file_content = file.read()

		self.assertIn('First line.\nSecond line.\n', file_content)
		self.assertNotIn('pinyinWODIndex', file_content)

		os.remove(input_address)

		# Export format 2: '^exports = {.+};$'
		input_address = '__test_file_for_toggle_exports_unit_test.py'
		with open(input_address, 'w', encoding='utf-8') as file:
			file.write('First line.\nSecond line.\n\nexports = { pinyinWODIndex };\n')

		toggle_exports.remove_exports(input_address)

		with open(input_address, 'r', encoding='utf-8') as file:
			file_content = file.read()

		self.assertIn('First line.\nSecond line.\n', file_content)
		self.assertNotIn('pinyinWODIndex', file_content)

		os.remove(input_address)


	def test_add_and_then_remove_returns_to_original_state(self):
		input_address = '__test_file_for_toggle_exports_unit_test.py'
		with open(input_address, 'w+', encoding='utf-8') as file:
			file.write('First line.\nSecond line.\n')
			file.seek(0)
			original_state = file.read()

		toggle_exports.add_exports(input_address, 'pinyinWODIndex')
		toggle_exports.remove_exports(input_address)
		toggle_exports.add_exports(input_address, 'pinyinWODIndex')
		toggle_exports.remove_exports(input_address)
		toggle_exports.add_exports(input_address, 'pinyinWODIndex')
		toggle_exports.remove_exports(input_address)
			
		with open(input_address, 'r', encoding='utf-8') as file:
			self.assertEqual(file.read(), original_state)
		
		os.remove(input_address)


if __name__ == '__main__':
	unittest.main()
