export async function onRequest(context) {
  const token = context.env.GITHUB_TOKEN;

  const headers = {
    "User-Agent": "SwiftCraftLauncher"
  };

  if (token) {
    headers["Authorization"] = `token ${token}`;
  }

  const response = await fetch(
    "https://api.github.com/repos/suhang12332/Swift-Craft-Launcher/contributors",
    { headers }
  );

  return new Response(response.body, {
    status: response.status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600",
      "Access-Control-Allow-Origin": "*"
    }
  });
}