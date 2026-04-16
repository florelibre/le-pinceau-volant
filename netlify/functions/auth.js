const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

exports.handler = async (event) => {
  const { code } = event.queryStringParameters || {};

  if (!code) {
    const url = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=repo,user`;
    return { statusCode: 302, headers: { Location: url } };
  }

  const response = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, code }),
  });

  const { access_token, error } = await response.json();

  const message = access_token
    ? `authorization:github:success:${JSON.stringify({ token: access_token, provider: "github" })}`
    : `authorization:github:error:${JSON.stringify({ error: error || "unknown_error" })}`;

  return {
    statusCode: 200,
    headers: { "Content-Type": "text/html" },
    body: `<!DOCTYPE html><html><body><script>
      (window.opener || window.parent).postMessage(${JSON.stringify(message)}, "*");
      window.close();
    </script></body></html>`,
  };
};
