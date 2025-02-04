/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

const sw = /** @type {ServiceWorkerGlobalScope} */ (/** @type {unknown} */ (self));

self.addEventListener("install", (event) => {
    console.log("Service Worker installing...");

    event.waitUntil(
        caches.open("app-cache").then((cache) => {
            return cache.addAll([
                "/",
                "/golfflag.png",
                "/manifest.json"
            ]);
        })
    );
});

self.addEventListener("activate", (event) => {
    console.log("Service Worker activated.");
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
