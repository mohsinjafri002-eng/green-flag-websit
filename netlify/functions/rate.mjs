import { getStore } from "@netlify/blobs";

export default async (request) => {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed." }), {
      status: 405,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const body = await request.json();
    const score = Number(body?.score);

    if (!Number.isInteger(score) || score < 1 || score > 10) {
      return new Response(JSON.stringify({ error: "Please choose a score from 1 to 10." }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const safe = (value, max) => String(value || "").trim().slice(0, max);
    const rating = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      score,
      reasons: Array.isArray(body.reasons)
        ? body.reasons.slice(0, 6).map(value => safe(value, 60))
        : [],
      note: safe(body.note, 700),
      name: safe(body.name, 40),
      createdAt: new Date().toISOString()
    };

    // Netlify Blobs persists submissions beyond a function invocation.
    const store = getStore("green-flag-ratings");
    await store.setJSON(rating.id, rating);

    return new Response(JSON.stringify({
      ok: true,
      message: "Your verdict has officially been delivered."
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Rating submission failed:", error);
    return new Response(JSON.stringify({ error: "Unable to save your rating right now." }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};