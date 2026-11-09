const WORKER_ORIGIN = "https://swift-craft-launcher-download.suhang12332.workers.dev";
const PREFIX = "/api/download/";

const CORS = { "Access-Control-Allow-Origin": "*" };

function isValidDownloadPath(path) {
  const parts = path.split("/");
  if (parts.length !== 2) return false;

  const [versionId, filename] = parts;

  if (!/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(versionId)) return false;
  if (versionId.includes("..")) return false;

  if (!/^[A-Za-z0-9._-]+\.dmg$/.test(filename)) return false;
  if (filename.includes("..")) return false;

  return true;
}

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Max-Age": "86400",
      },
    });
  }

  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response("Method Not Allowed", {
      status: 405,
      headers: { Allow: "GET,HEAD,OPTIONS", ...CORS },
    });
  }

  if (url.search) {
    return new Response("Not Found", { status: 404, headers: CORS });
  }

  if (!url.pathname.startsWith(PREFIX)) {
    return new Response("Not Found", { status: 404, headers: CORS });
  }

  const path = url.pathname.slice(PREFIX.length);
  if (!isValidDownloadPath(path)) {
    return new Response("Not Found", { status: 404, headers: CORS });
  }

  const targetUrl = new URL(WORKER_ORIGIN + "/" + path);
  if (targetUrl.origin !== WORKER_ORIGIN) {
    return new Response("Not Found", { status: 404, headers: CORS });
  }

  const forward = new Headers();
  const range = request.headers.get("Range");
  if (range) forward.set("Range", range);
  const accept = request.headers.get("Accept");
  if (accept) forward.set("Accept", accept);
  forward.set("User-Agent", "SwiftCraftLauncher-Proxy/1.0");

  const upstream = await fetch(targetUrl.toString(), {
    method: request.method,
    headers: forward,
    redirect: "follow",
  });

  const respHeaders = new Headers(upstream.headers);
  respHeaders.set("Access-Control-Allow-Origin", "*");
  respHeaders.set(
    "Access-Control-Expose-Headers",
    "Content-Length,Content-Range,Accept-Ranges"
  );

  return new Response(upstream.body, {
    status: upstream.status,
    headers: respHeaders,
  });
}
