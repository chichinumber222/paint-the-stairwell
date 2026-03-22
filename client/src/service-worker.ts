import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching";
import {} from "workbox-routing";
import { registerRoute } from "workbox-routing";
import { NetworkFirst } from "workbox-strategies";
import { CacheableResponsePlugin } from "workbox-cacheable-response";

declare let self: ServiceWorkerGlobalScope;

precacheAndRoute(self.__WB_MANIFEST);

cleanupOutdatedCaches();

registerRoute(
  ({ request }) => request.mode === "navigate",
  new NetworkFirst({
    cacheName: "pages-cache",
    networkTimeoutSeconds: 2,
    plugins: [new CacheableResponsePlugin({ statuses: [0, 200] })],
  }),
);
