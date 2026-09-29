// Cloudflare Worker for moderngranitequartz.com.
//
// Serves the static site from ./ (see wrangler.jsonc and .assetsignore) and
// handles one endpoint:
//
//   POST /api/quote  ->  { ok: true } | { ok: false, error: <code> }
//
// Each quote request is emailed to Razvan through Resend. Nothing is stored:
// the request exists in flight and then only in his inbox.
//
// CONFIGURATION
//   RESEND_API_KEY  secret, set in the Cloudflare dashboard (Settings ->
//                   Variables and Secrets). Without it this returns 503 and
//                   the form falls back to opening the visitor's email app,
//                   so a request is never silently lost.
//   QUOTE_TO        plain var in wrangler.jsonc: where requests are delivered.
//   QUOTE_FROM      plain var in wrangler.jsonc: must be on a domain verified
//                   in Resend (moderngranitequartz.com).

const LIMITS = { name: 120, phone: 40, email: 200, city: 80, project: 200, material: 40, details: 3000 };

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });

/** Strip control characters so nothing can forge headers through a field. */
const clean = (v, max) =>
  typeof v === 'string' ? v.replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, max) : '';

/** Same, but keeps line breaks in the free-text field. */
const cleanText = (v, max) =>
  typeof v === 'string' ? v.replace(/\r\n?/g, '\n').replace(/[\u0000-\u0009\u000b-\u001f\u007f]/g, ' ').trim().slice(0, max) : '';

async function handleQuote(request, env) {
  let form;
  try {
    form = await request.formData();
  } catch {
    return json({ ok: false, error: 'bad_request' }, 400);
  }

  // Honeypot. Real people never see this field, so anything in it is a bot.
  // Answer 200 so the bot believes it succeeded and does not retry.
  if (clean(form.get('company'), 100)) return json({ ok: true });

  // Bots submit instantly. A person cannot read the form and fill it in under three seconds.
  const started = Number(form.get('t') || 0);
  if (started && Date.now() - started < 3000) return json({ ok: true });

  const name = clean(form.get('name'), LIMITS.name);
  const phone = clean(form.get('phone'), LIMITS.phone);
  const email = clean(form.get('email'), LIMITS.email);
  const city = clean(form.get('city'), LIMITS.city);
  const projects = form.getAll('project').map((p) => clean(p, 40)).filter(Boolean).join(', ').slice(0, LIMITS.project);
  const material = clean(form.get('material'), LIMITS.material);
  const details = cleanText(form.get('details'), LIMITS.details);

  const missing = [!name && 'name', phone.replace(/\D/g, '').length < 10 && 'phone'].filter(Boolean);
  if (missing.length) return json({ ok: false, error: 'missing_fields', fields: missing }, 422);

  // Email is optional. Deliberately loose when given: rejecting an unusual but
  // real address costs a customer; a bounced reply costs nothing.
  const emailOk = /^[^@\s]+@[^@\s.]+\.[^@\s]+$/.test(email);
  if (email && !emailOk) return json({ ok: false, error: 'bad_email', fields: ['email'] }, 422);

  if (!env.RESEND_API_KEY) return json({ ok: false, error: 'not_configured' }, 503);

  const subject = `Quote request: ${projects || 'Countertops'}${city ? ` (${city})` : ''} - ${name}`;
  const text = [
    'New quote request from moderngranitequartz.com',
    '',
    `Name:      ${name}`,
    `Phone:     ${phone}`,
    `Email:     ${email || '(not given)'}`,
    `City:      ${city || '(not given)'}`,
    `Project:   ${projects || '(not given)'}`,
    `Material:  ${material || 'Not sure yet'}`,
    '',
    'About the project:',
    details || '(nothing added)',
    '',
    '-',
    email ? 'Reply to this email to answer them directly, or call the number above.' : 'No email given. Call or text the number above.',
  ].join('\n');

  const message = {
    from: env.QUOTE_FROM,
    to: [env.QUOTE_TO],
    subject,
    text,
  };
  if (emailOk) message.reply_to = email;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json' },
      body: JSON.stringify(message),
    });
    if (!res.ok) {
      // Log Resend's status and its own error text only, never the submission.
      const why = await res.json().then((j) => String(j?.message ?? '')).catch(() => '');
      console.error('resend rejected the message', res.status, why.slice(0, 200));
      return json({ ok: false, error: 'send_failed' }, 502);
    }
  } catch (err) {
    console.error('resend request threw', err?.name);
    return json({ ok: false, error: 'send_failed' }, 502);
  }

  return json({ ok: true });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/quote') {
      if (request.method !== 'POST') return json({ ok: false, error: 'method_not_allowed' }, 405);
      return handleQuote(request, env);
    }
    // Everything else is the static site.
    return env.ASSETS.fetch(request);
  },
};
