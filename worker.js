// Serves the static site and one small endpoint: /api/geo returns the
// visitor's country (from Cloudflare's IP lookup) so pages can show
// country-specific prices. Everything else is a static asset.
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/geo') {
      const country = (request.cf && request.cf.country) || request.headers.get('cf-ipcountry') || '';
      return new Response(JSON.stringify({ country: /^[A-Z]{2}$/.test(country) ? country : '' }), {
        headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'private, no-store', 'vary': 'cf-ipcountry' },
      });
    }
    return env.ASSETS.fetch(request);
  },
};
