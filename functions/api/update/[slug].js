// functions/api/update/[[path]].js
const GITHUB_BASE =
  "https://github.com/suhang12332/Swift-Craft-Launcher/releases/latest/download/";

const ALLOWED = new Set(["appcast-arm64.xml", "appcast-x86_64.xml"]);

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

  const name = url.pathname.split("/").pop();
  if (!ALLOWED.has(name)) {
    return new Response("Not Found", { status: 404 });
  }

  const upstream = await fetch(GITHUB_BASE + name, {
    method: request.method,
    redirect: "follow",
    headers: {
      "User-Agent": "Swift-Craft-Launcher-Updater",
      Accept: request.headers.get("Accept") || "*/*",
    },
  });

  const headers = new Headers(upstream.headers);
  headers.set("Access-Control-Allow-Origin", "*");

  return new Response(upstream.body, {
    status: upstream.status,
    headers,
  });
}
