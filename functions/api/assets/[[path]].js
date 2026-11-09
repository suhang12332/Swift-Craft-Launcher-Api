// functions/api/assets/[[path]].js
const RAW_BASE =
  "https://raw.githubusercontent.com/suhang12332/Swift-Craft-Launcher/refs/heads/main/";

const PREFIX = "/api/assets/";

const ASSET_DIR =
  "/suhang12332/Swift-Craft-Launcher/refs/heads/main/SwiftCraftLauncher/Assets.xcassets/AppIcon.appiconset/";

const ALLOWED_FILES = new Set([
  "mac16pt1x.png",
  "mac16pt2x.png",
  "mac32pt1x.png",
  "mac32pt2x.png",
  "mac128pt1x.png",
  "mac128pt2x.png",
  "mac256pt1x.png",
  "mac256pt2x.png",
  "mac512pt1x.png",
  "mac512pt2x.png",
]);

const CORS = { "Access-Control-Allow-Origin": "*" };

export async function onRequest(context) {
  const { request } = context;

  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
      },
    });
  }

  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response("Method Not Allowed", {
      status: 405,
      headers: { Allow: "GET, HEAD, OPTIONS", ...CORS },
    });
  }

  const url = new URL(request.url);

  if (url.search) {
    return new Response("Not Found", { status: 404, headers: CORS });
  }

  const path = url.pathname.startsWith(PREFIX)
    ? url.pathname.slice(PREFIX.length)
    : "";

  let decodedPath;
  try {
    decodedPath = decodeURIComponent(path);
  } catch {
    return new Response("Bad Request", { status: 400, headers: CORS });
  }

  const segments = decodedPath.split("/");
  const invalid =
    !decodedPath ||
    decodedPath.startsWith("/") ||
    decodedPath.includes("\\") ||
    segments.some((s) => s === ".." || s === ".");

  if (invalid) {
    return new Response("Not Found", { status: 404, headers: CORS });
  }

  const targetUrl = new URL(RAW_BASE + decodedPath);

  const fileName = targetUrl.pathname.startsWith(ASSET_DIR)
    ? targetUrl.pathname.slice(ASSET_DIR.length)
    : "";
  const isAllowed =
    targetUrl.origin === "https://raw.githubusercontent.com" &&
    fileName !== "" &&
    ALLOWED_FILES.has(fileName);

  if (!isAllowed) {
    return new Response("Not Found", { status: 404, headers: CORS });
  }

  const response = await fetch(targetUrl.toString(), {
    method: request.method,
    headers: { "User-Agent": "SwiftCraftLauncher-API/1.0" },
  });

  if (!response.ok) {
    return new Response(response.body, {
      status: response.status,
      headers: {
        "Content-Type":
          response.headers.get("Content-Type") || "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
        ...CORS,
      },
    });
  }

  const headers = new Headers();
  headers.set(
    "Content-Type",
    response.headers.get("Content-Type") || "application/octet-stream"
  );
  headers.set("Cache-Control", "public, max-age=3600");
  headers.set("Access-Control-Allow-Origin", "*");

  for (const h of ["ETag", "Last-Modified", "Content-Length"]) {
    const v = response.headers.get(h);
    if (v) headers.set(h, v);
  }

  return new Response(response.body, {
    status: response.status,
    headers,
  });
}
