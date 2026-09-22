// functions/api/data.js
// 工作记录 云端 API

export async function onRequestGet(context) {
  try {
    const data = await context.env.WORK_KV.get('workData', 'json');
    return new Response(JSON.stringify(data || {}), {
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  }
}

export async function onRequestPost(context) {
  try {
    const token = context.request.headers.get('X-Write-Token') || '';
    if (!context.env.WRITE_TOKEN || token !== context.env.WRITE_TOKEN) {
      return new Response(JSON.stringify({ error: '未授权' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
      });
    }
    const body = await context.request.text();
    await context.env.WORK_KV.put('workData', body);
    return new Response(JSON.stringify({ ok: true, ts: Date.now() }), {
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-Write-Token',
    },
  });
}
