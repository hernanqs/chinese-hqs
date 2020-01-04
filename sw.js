const staticCacheName = 'static-cache-v2.1.1';
const dynamicCacheName = 'dynamic-cache';
const dynamicCacheLimit = 20;

const staticCacheAssests = [
	'index.html',
	'css/styles.css',
	'js/helper-functions.js',
	'js/data-api.js',
	'js/gui-api.js',
	'js/initialize-apis.js',
	'js/search-results-page.js',
	'js/hanzi-page.js',
	'js/radical-page.js',
	'js/hsk-page.js',
	'js/list-page.js',
	'js/cedict-entry-page.js',
	'js/homepage.js',
	'js/app.js',
	'data/hanzi.js',
	'data/cedict.js',
	'indices/pinyinIndex.js',
	'indices/pinyinWODIndex.js',
	'indices/cedictWordIndex.js',
	'indices/cedictPinyinIndex.js',
	'indices/cedictPinyinWODIndex.js',
	'indices/hanziEnglishIndex.js',
	'indices/cedictEnglishIndex.js',
	'indices/radicalIndex.js',
	'indices/HSKLevelIndex.js',
	'lists/hskList.js',
];

// Cache static cache
self.addEventListener('install', (event) => {
	event.waitUntil(
		caches.open(staticCacheName).then((cache) => {
			return cache.addAll(staticCacheAssests);
		})
	);
});

// Clean older versions of static cache
self.addEventListener('activate', event => {
	event.waitUntil(
		caches.keys().then(keys => {
			return Promise.all(keys
				.filter(key => key !== staticCacheName && key !== dynamicCacheName)
				.map(key => caches.delete(key))
			);
		})
	);
});

// Respond fetch request from cache, if cached. Else make request and cache
// response in dynamic cache
self.addEventListener('fetch', (event) => {
	event.respondWith(
		caches.match(event.request).then((response) => {
			return response || fetch(event.request).then(fetchRes => {
				return caches.open(dynamicCacheName).then(cache => {
					cache.put(event.request.url, fetchRes.clone());
					// Limit number of items in cache
					limitCacheSize(cache, dynamicCacheLimit);
					return fetchRes;
				})
			});
		})
		.catch(error => {
			console.log('Fetch request failed:', error);
		})
	);
});

// Function for limiting dynamic cache size
function limitCacheSize (cache, size) {
	cache.keys().then(keys => {
		if(keys.length > size){
			cache.delete(keys[0]).then(limitCacheSize(cache, size));
		}
	});
};