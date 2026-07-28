// Callback del OAuth de GitHub: canjea el código por un token y se lo pasa
// a Decap CMS (ventana que abrió el popup) con el handshake por postMessage.
export const prerender = false;

import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request, cookies }) => {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const savedState = cookies.get('oauth_state')?.value;

  const clientId = import.meta.env.OAUTH_GITHUB_CLIENT_ID;
  const clientSecret = import.meta.env.OAUTH_GITHUB_CLIENT_SECRET;

  let payload: string;

  if (!clientId || !clientSecret) {
    payload = 'authorization:github:error:' + JSON.stringify({ error: 'Faltan variables de entorno OAuth en Vercel.' });
  } else if (!code || !state || state !== savedState) {
    payload = 'authorization:github:error:' + JSON.stringify({ error: 'Estado OAuth inválido. Probá iniciar sesión de nuevo.' });
  } else {
    const res = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
    });
    const data = await res.json();
    payload = data.error
      ? 'authorization:github:error:' + JSON.stringify(data)
      : 'authorization:github:success:' + JSON.stringify({ token: data.access_token, provider: 'github' });
  }

  cookies.delete('oauth_state', { path: '/api' });

  const html = `<!doctype html>
<html lang="es">
<head><meta charset="utf-8"><title>Autenticando…</title></head>
<body>
<p>Autenticando… podés cerrar esta ventana si no se cierra sola.</p>
<script>
  (function () {
    var payload = ${JSON.stringify(payload)};
    function receiveMessage(e) {
      window.opener.postMessage(payload, e.origin);
      window.removeEventListener('message', receiveMessage, false);
    }
    window.addEventListener('message', receiveMessage, false);
    window.opener.postMessage('authorizing:github', '*');
  })();
</script>
</body>
</html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
  });
};
