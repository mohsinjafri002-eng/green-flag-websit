import { getStore } from "@netlify/blobs";

export default async (request) => {
  if (request.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method not allowed." }), {
      status: 405,
      headers: { "Content-Type": "application/json" }
    });
  }

  const expected = process.env.GREEN_FLAG_ADMIN_KEY;
  const supplied = request.headers.get("x-admin-key");

  if (!expected || !supplied || supplied !== expected) {
    return new Response(JSON.stringify({ error: "Access denied." }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const store = getStore("green-flag-ratings");
    const result = await store.list();
    const entries = await Promise.all(
      (result.blobs || []).map(async item => {
        return await store.get(item.key, { type: "json" });
      })
    );
    entries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return new Response(JSON.stringify({ ok: true, ratings: entries }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store"
      }
    });
  } catch (error) {
    console.error("Could not read ratings:", error);
    return new Response(JSON.stringify({ error: "Unable to load ratings." }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};