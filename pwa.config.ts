import type { OutputBundle } from "rollup";
import type { Plugin } from "vite";

interface CreatePwaPluginOptions {
  appName: string;
  base: string;
  publicAssets: string[];
  version: string;
}

const normalizeBase = (base: string) => (base.endsWith("/") ? base : `${base}/`);

const toAbsoluteAppUrl = (base: string, assetPath: string) => {
  const sanitizedBase = normalizeBase(base);
  return `${sanitizedBase}${assetPath.replace(/^\/+/, "")}`;
};

const createServiceWorkerSource = ({
  appName,
  base,
  precacheUrls,
  version,
}: {
  appName: string;
  base: string;
  precacheUrls: string[];
  version: string;
}) => {
  const scope = normalizeBase(base);
  const fallbackUrl = scope;
  const fallbackIndexUrl = `${scope}index.html`;
  const cachePrefix = `${appName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-`;

  return `const APP_SCOPE = ${JSON.stringify(scope)};
const CACHE_PREFIX = ${JSON.stringify(cachePrefix)};
const CACHE_NAME = ${JSON.stringify(`${cachePrefix}${version}`)};
const PRECACHE_URLS = ${JSON.stringify(precacheUrls)};
const NAVIGATION_FALLBACKS = [${JSON.stringify(fallbackUrl)}, ${JSON.stringify(fallbackIndexUrl)}];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key === CACHE_NAME || !key.startsWith(CACHE_PREFIX)) {
            return Promise.resolve(false);
          }

          return caches.delete(key);
        })
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

const isSameOrigin = (requestUrl) => new URL(requestUrl).origin === self.location.origin;
const isAppAsset = (requestUrl) => {
  const url = new URL(requestUrl);
  return url.origin === self.location.origin && url.pathname.startsWith(APP_SCOPE);
};

const putInCache = async (request, response) => {
  if (!response || !response.ok || !isSameOrigin(request.url)) {
    return response;
  }

  const cache = await caches.open(CACHE_NAME);
  cache.put(request, response.clone());
  return response;
};

const cacheFirst = async (request) => {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request, { ignoreSearch: true });

  if (cached) {
    return cached;
  }

  const response = await fetch(request);
  return putInCache(request, response);
};

const networkFirstNavigation = async (request) => {
  try {
    const response = await fetch(request);
    return putInCache(request, response);
  } catch {
    const cache = await caches.open(CACHE_NAME);

    for (const fallback of NAVIGATION_FALLBACKS) {
      const cached = await cache.match(fallback, { ignoreSearch: true });
      if (cached) {
        return cached;
      }
    }

    return Response.error();
  }
};

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET" || !isAppAsset(event.request.url)) {
    return;
  }

  if (event.request.mode === "navigate") {
    event.respondWith(networkFirstNavigation(event.request));
    return;
  }

  event.respondWith(cacheFirst(event.request));
});
`;
};

const collectBundleAssets = (base: string, bundle: OutputBundle) => {
  return Object.keys(bundle)
    .filter((fileName) => !fileName.endsWith(".map") && fileName !== "sw.js")
    .map((fileName) => toAbsoluteAppUrl(base, fileName));
};

export const createPwaPlugin = ({
  appName,
  base,
  publicAssets,
  version,
}: CreatePwaPluginOptions): Plugin => {
  return {
    apply: "build",
    name: "generate-pwa-service-worker",
    generateBundle(_, bundle) {
      const precacheUrls = Array.from(
        new Set([
          normalizeBase(base),
          toAbsoluteAppUrl(base, "index.html"),
          ...publicAssets.map((asset) => toAbsoluteAppUrl(base, asset)),
          ...collectBundleAssets(base, bundle),
        ])
      );

      this.emitFile({
        type: "asset",
        fileName: "sw.js",
        source: createServiceWorkerSource({
          appName,
          base,
          precacheUrls,
          version,
        }),
      });
    },
  };
};
