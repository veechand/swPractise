console.log("in sw.js");

if ('serviceWorker' in navigator) {
  console.log("Service worker in navigator");
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('http://localhost:8080/sw.js',{ 
      scope: '/' 
    })
    .then(reg => { 
      console.log('service worker is', reg.waiting ? 'waiting' : 'registered'); 
    }) 
    .catch(ex => { 
      console.log('service worker failed while registering!', ex); 
    }); 
  });
}

var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
  '/hello/'
];
self.addEventListener('install', function(event) {
	  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  var cachedResponse;
  event.respondWith(  	
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          console.log("Storing Cached Response....");
          cachedResponse = response;
        }

        // IMPORTANT: Clone the request. A request is a stream and
        // can only be consumed once. Since we are consuming this
        // once by cache and once by the browser for fetch, we need
        // to clone the response.
        var fetchRequest = event.request.clone();

        return fetch(fetchRequest).catch(function(response) {
        	console.log("Returing Cached Response....");
        	return cachedResponse || response;
         }).then(
          function(response) {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              console.log("non-cachable Response....");
              return cachedResponse || response;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
              	console.log("Caching Response....")
                cache.put(event.request, responseToCache);
              });
            console.log("Returning network response...");
            return response;
          }
        )
      })
    );
});

/*
see whats cached
HTTPS
deleting cache ?? 
*/