import express from "express";
import dotenv from "dotenv";
import crypto from "crypto";
import { zplTag } from "./zpl.js";

dotenv.config();

const app = express();
app.use(express.json({ limit: "512kb" }));

// Simple API-key auth (kiosk/clients must send x-api-key)
app.use((req, res, next) => {
  const key = req.header("x-api-key");
  if (!process.env.API_KEY) return res.status(500).json({ error: "server_misconfigured", detail: "API_KEY not set" });
  if (!key || key !== process.env.API_KEY) return res.status(401).json({ error: "unauthorized" });
  next();
});

app.get("/health", (_, res) => res.json({ ok: true }));

// Create a new TRACK-ID and return ZPL
app.post("/api/print", (req, res) => {
  const {
    hotelName = "PALACE HOTEL",
    displayName = "GUEST",
    bagsTotal = 1,
    bagIndex = 1,
    dpi,
    from = "KIH"
  } = req.body || {};

  const trackId = crypto.randomBytes(5).toString("hex").toUpperCase(); // 10 chars
  const zebraDpi = Number(dpi || process.env.ZEBRA_DPI || 203);

  const zpl = zplTag({ dpi: zebraDpi, trackId, hotelName, displayName, bagIndex, bagsTotal, from });

  res.json({ trackId, zpl, dpi: zebraDpi });
});

const port = Number(process.env.PORT || 8080);
app.listen(port, () => console.log(`Server running on :${port}`));
