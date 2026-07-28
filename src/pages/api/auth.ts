// Inicio del login OAuth de GitHub para el panel /admin (Decap CMS).
export const prerender = false;

import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ request, cookies, redirect }) => {
  const clientId = import.meta.env.OAUTH_GITHUB_CLIENT_ID;
  if (!clientId) {
    return new Response(
      'Falta configurar OAUTH_GITHUB_CLIENT_ID en las variables de entorno de Vercel.',
      { status: 500 }
    );
  }

  const url = new URL(request.url);
  const state = crypto.randomUUID();
  cookies.set('oauth_state', state, {
    path: '/api',
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 600,
  });

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `${url.origin}/api/callback`,
    scope: 'repo,user',
    state,
  });
  return redirect(`https://github.com/login/oauth/authorize?${params}`, 302);
};
