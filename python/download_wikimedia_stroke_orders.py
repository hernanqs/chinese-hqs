#! python3

import requests, os, bs4, time, json


def download_wikimedia_stroke_orders(file_path, dir_path):
	"""Takes a path to a JSON file containing a list of hanzi stroke
	order images and the path to the directory where the images
	will be downloaded.
	Downloads the stroke order images from the Wikimedia Commons
	Stroke Order Project and stores them in the directory
	"""

	print('Downloading new stroke order images...')

	# Get list of stroke order images to be downloaded
	with open(file_path, 'r', encoding='utf8') as file:
		stroke_orders_list = json.load(file)

	os.makedirs(dir_path, exist_ok=True)

	so_downloaded = 0

	for hanzi in stroke_orders_list:
		# Avoid downloading an image that already exists 
		if not os.path.exists(os.path.join(dir_path, hanzi)):

			url = 'https://commons.wikimedia.org/wiki/File:' + hanzi

			print('Getting hanzi stroke order from ', url, '...')

			# Wait 1 second between requests to avoid an abuse of
			# the terms of use of Wikimedia
			time.sleep(1)

			# Get HTML
			res = requests.get(url)
			res.raise_for_status()

			soup = bs4.BeautifulSoup(res.text)

			# Get link to the image
			imgUrl = soup.select('.internal')[0].get('href')

			# Get image
			imgRes = requests.get(imgUrl)
			imgRes.raise_for_status()

			# Write image file
			os.makedirs(os.path.abspath(dir_path), exist_ok=True)
			with open(os.path.join(dir_path, hanzi), 'wb') as imgFile:
				for chunk in imgRes.iter_content(100000):
					imgFile.write(chunk)

			so_downloaded += 1

	print(so_downloaded, 'new stroke order images downloaded from Wikimedia')
	print()


if __name__ == '__main__':

	download_wikimedia_stroke_orders(
		os.path.join('data', 'stroke_orders_in_wikimedia.json'),
		os.path.join('..', 'data', 'stroke-orders')
		)
