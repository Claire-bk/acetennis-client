const cacheName = 'AceTennis';

// files that could be served from the cache
const staticFiles = [
    '/',
    '/public/src/index.html',
    '/public/component/login.html',
    '/public/component/signup.html',
    '/public/src/service/app.js',
    '/public/src/service/login.js',
    '/public/src/service/signup.js'
];

const dataFiles = [
    '/public/img/main.jpg',
    '/public/icons/icon-192x192.png',
    '/public/icons/icon-256x256.png',
    '/public/icons/icon-384x384.png',
    '/public/icons/icon-512x512.png'
];

// Define a series of resources that will be cached on the installation of the service worker
self.addEventListener('install', function(e) {
    // add the selected files to the cache
    const cacheFiles = caches.open(cacheName).then((cache) => {
        console.log('caching static files');
        cache.addAll(staticFiles);
        console.log('caching data files');
        cache.addAll(dataFiles);
    });
    // wait until the files have been added before continuing the event
    e.waitUntil(cacheFiles);
});

self.addEventListener('activate', (e) => {

});

self.addEventListener('fetch', async (event) => {
    // extract the url from the request, converted into a URL object
    const targetAddress = new URL(event.request.url);

    // if our staticfiles list includes an entry that matches the pathname
    if(staticFiles.includes(targetAddress.pathname)) {
        // Loading a set of files that rarely change
        event.respondWith(
            caches.match(event.request).then((response) => {
                    return response || fetch(event.request)
                        .then(fetchedResponse => {
                        console.log('Serving ' + event.request.url + ' from the network');
                        caches.open(cacheName).then((cache) => {
                            cache.put(event.request, fetchedResponse.clone());
                            return fetchedResponse;
                        });
                    });
            })
        );
    } else {
        // Network falling back to cache
        event.respondWith(
            // opem the specified cache
            caches.open(cacheName).then((cache) => {
                // fetch the resouce (via the network)
                return fetch(event.request.url)
                    .then((fetchedResponse) => {
                        // update the existing value in the cache
                        cache.put(event.request, fetchedResponse.clone());
                        // return the feched resources
                        return fetchedResponse;
                    })
                    .catch(() => {
                        // if the network request fails
                        // retrieve the value from the cache
                        return cache.match(event.request.url)
                                    .then((cachedResponse) => {
                                        return cachedResponse;
                                    });
                    });
            })
        );
    }
});

self.addEventListener('activate', function(event) {
    const cacheWhitelist = [cacheName];

    event.waitUntil(
        caches.keys().then(function(keyList) {
            return Promise.all(keyList.map(function(key) {
                if(cacheWhitelist.indexOf(key) === -1) {
                    return caches.delete(key);
                }
            }))
        })
    );
})