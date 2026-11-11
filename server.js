const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, "ratings.json");

app.use(express.json({ limit: "20kb" }));
app.use(express.static(path.join(__dirname, "public")));

function readRatings() {
  try { return JSON.parse(fs.readFileSync(DATA_FILE, "utf8")); }
  catch { return []; }
}

app.post("/api/rate", (req, res) => {
  const { score, reasons, note, name } = req.body || {};
  if (!Number.isInteger(score) || score < 1 || score > 10) {
    return res.status(400).json({ error: "Please choose a score from 1 to 10." });
  }
  const safe = (value, max) => String(value || "").trim().slice(0, max);
  const rating = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    score,
    reasons: Array.isArray(reasons) ? reasons.slice(0, 6).map(x => safe(x, 60)) : [],
    note: safe(note, 700),
    name: safe(name, 40),
    createdAt: new Date().toISOString()
  };
  const ratings = readRatings();
  ratings.push(rating);
  fs.writeFileSync(DATA_FILE, JSON.stringify(ratings, null, 2));
  res.json({ ok: true, message: "Your verdict has officially been delivered." });
});

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.get("*", (_req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));

app.listen(PORT, () => console.log(`Green Flag is running on port ${PORT}`));