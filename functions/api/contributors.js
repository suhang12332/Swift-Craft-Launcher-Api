export async function onRequest(context) {
  const url = new URL(context.request.url);

  if (context.request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,OPTIONS",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Max-Age": "86400",
      },
    });
  }

  if (url.search) {
    return new Response("Not Found", {
      status: 404,
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  }

  const token = context.env.GITHUB_TOKEN;

  const headers = {
    "User-Agent": "SwiftCraftLauncher-API/1.0",
    Accept: "application/vnd.github+json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(
    "https://api.github.com/repos/suhang12332/Swift-Craft-Launcher/contributors",
    { headers }
  );

  const respHeaders = new Headers(response.headers);
  respHeaders.set("Access-Control-Allow-Origin", "*");
  respHeaders.set("Cache-Control", "public, max-age=3600");

  return new Response(response.body, {
    status: response.status,
    headers: respHeaders,
  });
}
