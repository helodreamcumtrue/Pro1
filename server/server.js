import express from "express";
import cors from "cors";
import fs from "fs";

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

const readRisks = () => {
  const raw = fs.readFileSync("./risks.json", "utf-8");
  return JSON.parse(raw);
};

// GET all risks with score
app.get("/api/risks", (req, res) => {
  const risks = readRisks();

  const enriched = risks.map(r => {
    const score = r.impact * r.probability * r.velocity;
    return {
      ...r,
      score,
      level: score > 50 ? "High" : score > 20 ? "Medium" : "Low"
    };
  });

  res.json(enriched);
});

// POST new risk (optional)
app.post("/api/risks", (req, res) => {
  const risks = readRisks();
  risks.push(req.body);
  fs.writeFileSync("./risks.json", JSON.stringify(risks, null, 2));
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
