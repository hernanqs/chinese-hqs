#! python3

import requests, os, bs4, time, json


__url__ = 'https://commons.wikimedia.org/wiki/Category:Bw.png_stroke_order_images'

def __get_so_list_from_one_page__(url):
	"""Returns a list with the filenames for all hanzi stroke order
	images available in	Wikimedia Commons Stroke Order Project
	"""

	print('Getting hanzi stroke orders list from ', url, '...')

	# Wait 1 second between requests to avoid an abuse of the terms
	# of use of Wikimedia
	time.sleep(1)

	# Get HTML
	res = requests.get(url)
	res.raise_for_status()

	soup = bs4.BeautifulSoup(res.text)

	# Get the filenames of the stroke order images
	filenames = []
	for filename_el in soup.select('a.galleryfilename-truncate'):
		filenames.append(filename_el.getText())

	# If there is a next page with more stroke order images, get the
	# filenames of tha images too
	links = soup.select('a[title="Category:Bw.png stroke order images"]')
	for link in links:
		if link.getText() == 'next page':
			filenames += __get_so_list_from_one_page__(
				'https://commons.wikimedia.org' + link.get('href')
				)
			break

	return filenames


def download_wikimedia_stroke_orders_list(file_path, summary=False):
	"""Takes a path for the output file.
	Writes a JSON file containg the file names of the stroke order
	images in an array (list).
	If summary=True prints the list.
	"""

	# Get stroke order images file names
	filenames = __get_so_list_from_one_page__(__url__)
	# Filter out alternative stroke orders
	filenames = list(filter(lambda x: x.endswith('-bw.png'), filenames))

	# Write JSON file with the file names list
	os.makedirs(os.path.dirname(os.path.abspath(file_path)), exist_ok=True)
	with open(file_path, 'w', encoding='utf8') as outfile:
		json.dump(filenames, outfile, indent=4, ensure_ascii=False)

	print('Stroke orders in the list:', len(filenames))
	if summary == True:
		print(filenames)
	print()


if __name__ == '__main__':

	download_wikimedia_stroke_orders_list(
		os.path.join('data', 'stroke_orders_in_wikimedia.json'),
		summary=True
		)