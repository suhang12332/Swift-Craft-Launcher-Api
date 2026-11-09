export async function onRequest(context) {
  // CORS 预检直接本地响应
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
