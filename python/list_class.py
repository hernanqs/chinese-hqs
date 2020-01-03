#! python3

import json, os, pprint

class List():
	def __init__(self, metadata, content):
		self.data = {}
		self.data['metadata'] = {}

		try:
			self.data['metadata']['id'] = metadata['id']
			self.data['metadata']['name'] = metadata['name']
		except KeyError:
			raise Exception("Missing list's id or name in metadata")

		self.data['metadata']['hasOwnData'] = metadata.get('hasOwnData', False)
		self.data['metadata']['hasSublists'] = metadata.get('hasSublists', False)

		field_names = metadata.get('fieldNames', None)
		if type(field_names) == list:
			self.data['metadata']['fieldNames'] = field_names

		field_keys = metadata.get('fieldKeys', None)
		if type(field_keys) == list:
			if len(field_names) == len(field_keys):
				self.data['metadata']['fieldKeys'] = field_keys
			else:
				raise Exception('fieldKeys and fieldNames must have the same length')

		field_types = metadata.get('fieldTypes', None)
		if type(field_types) == list:
			if len(field_names) == len(field_types):
				self.data['metadata']['fieldTypes'] = field_types
			else:
				raise Exception('fieldTypes and fieldNames must have the same length')

		if not self.data['metadata']['hasSublists']:
			if (not type(field_names) == list or
					not type(field_keys) == list or
					not type(field_types) == list):
				raise Exception('Missing fieldNames, fieldKeys or fieldTypes in metadata')

		self.data['content'] = content

	def get_data(self):
		return self.data

	def write(self, outfile_path):
		# Write the list in the output file
		os.makedirs(os.path.dirname(os.path.abspath(outfile_path)), exist_ok=True)
		with open(outfile_path, 'w', encoding='utf8') as outfile:
			outfile.write(json.dumps(self.data, separators=(',',':'), indent=None, ensure_ascii=False))

	def __str__(self):
		return pprint.pformat(self.data)
