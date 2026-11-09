const RAW_BASE =
  "https://raw.githubusercontent.com/suhang12332/Swift-Craft-Launcher/refs/heads/main/";

const PREFIX = "/api/assets/";

export async function onRequest(context) {
  const { request } = context;

  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS"
      }
    });
  }

  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response("Method Not Allowed", {
      status: 405,
      headers: {
        Allow: "GET, HEAD, OPTIONS",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }

  const url = new URL(request.url);
  const path = url.pathname.startsWith(PREFIX)
    ? url.pathname.slice(PREFIX.length)
    : "";

  let decodedPath;
  try {
    decodedPath = decodeURIComponent(path);
  } catch {
    return new Response("Bad Request", {
      status: 400,
      headers: { "Access-Control-Allow-Origin": "*" }
    });
  }

  const segments = decodedPath.split("/");
  const invalid =
    !decodedPath ||
    decodedPath.startsWith("/") ||
    decodedPath.includes("\\") ||
    segments.some((segment) => segment === ".." || segment === ".");

  if (invalid) {
    return new Response("Not Found", {
      status: 404,
      headers: { "Access-Control-Allow-Origin": "*" }
    });
  }

  const targetUrl = new URL(path, RAW_BASE);
  targetUrl.search = url.search;

  if (
    targetUrl.origin !== "https://raw.githubusercontent.com" ||
    !targetUrl.pathname.startsWith("/suhang12332/Swift-Craft-Launcher/")
  ) {
    return new Response("Not Found", {
      status: 404,
      headers: { "Access-Control-Allow-Origin": "*" }
    });
  }

  const response = await fetch(targetUrl.toString(), {
    method: request.method,
    headers: {
      "User-Agent": "SwiftCraftLauncher-API/1.0"
    }
  });

  if (!response.ok) {
    return new Response(response.body, {
      status: response.status,
      headers: {
        "Content-Type":
          response.headers.get("Content-Type") || "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }

  const headers = new Headers();
  headers.set(
    "Content-Type",
    response.headers.get("Content-Type") || "application/octet-stream"
  );
  headers.set("Cache-Control", "public, max-age=3600");
  headers.set("Access-Control-Allow-Origin", "*");

  const etag = response.headers.get("ETag");
  if (etag) headers.set("ETag", etag);

  const lastModified = response.headers.get("Last-Modified");
  if (lastModified) headers.set("Last-Modified", lastModified);

  const contentLength = response.headers.get("Content-Length");
  if (contentLength) headers.set("Content-Length", contentLength);

  return new Response(response.body, {
    status: response.status,
    headers
  });
}
