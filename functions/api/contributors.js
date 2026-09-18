const WORKER = "https://swift-craft-launcher-contributors.suhang12332.workers.dev";

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const path = url.pathname.replace("/api/contributors", "");

  const targetUrl = new URL(WORKER + path);
  targetUrl.search = url.search;

  const response = await fetch(targetUrl.toString(), {
    method: context.request.method,
    headers: context.request.headers
  });

  const headers = new Headers(response.headers);
  headers.set("Access-Control-Allow-Origin", "*");

  return new Response(response.body, {
    status: response.status,
    headers
  });
}