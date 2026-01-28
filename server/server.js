const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { 
  processRisk, 
  calculateFinancials, 
  generateRecommendations 
} = require('./engines');

const app = express();
const PORT = process.env.PORT || 4000;
const RISKS_PATH = path.join(__dirname, 'risks.json');

app.use(cors());
app.use(express.json());

// Helper to load company profile (can be moved to a DB later)
let companyProfile = {
  monthlyRevenue: 1500000,
  monthlyCosts: 1100000,
  industry: 'Technology & Manufacturing',
  sensitivity: 0.85 
};

/**
 * GET /api/risks
 * Fetches signals from risks.json and runs them through the analytical engines.
 */
app.get('/api/risks', (req, res) => {
  try {
    const rawData = fs.readFileSync(RISKS_PATH, 'utf8');
    const riskDatabase = JSON.parse(rawData);

    const processedRisks = riskDatabase.map(risk => {
      // 1. Calculate Risk Scores
      const riskAnalysis = processRisk(risk);
      
      // 2. Calculate Financial Consequences
      const financialImpact = calculateFinancials(riskAnalysis.impact, companyProfile);
      
      // 3. Generate Actions
      const recommendations = generateRecommendations(riskAnalysis, risk.type);

      return {
        ...risk,
        ...riskAnalysis,
        financialImpact,
        recommendations
      };
    });

    res.json(processedRisks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read intelligence registry.' });
  }
});

/**
 * POST /api/risks
 * Ingests and standardizes a new risk signal.
 */
app.post('/api/risks', (req, res) => {
  try {
    const rawData = fs.readFileSync(RISKS_PATH, 'utf8');
    const db = JSON.parse(rawData);

    const newRisk = {
      id: Date.now(),
      title: req.body.title || 'Unnamed Signal',
      type: req.body.type || 'GENERAL',
      industry: req.body.industry || 'Global',
      location: req.body.location || 'Remote',
      description: req.body.description || '',
      rawImpact: parseFloat(req.body.impact) || 5,
      rawProbability: parseFloat(req.body.probability) || 5,
      rawVelocity: parseFloat(req.body.velocity) || 5,
      timestamp: new Date().toISOString()
    };

    db.push(newRisk);
    fs.writeFileSync(RISKS_PATH, JSON.stringify(db, null, 2));
    
    res.status(201).json({ message: 'Signal ingested.', id: newRisk.id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save signal.' });
  }
});

app.get('/api/profile', (req, res) => res.json(companyProfile));

app.listen(PORT, () => {
  console.log(`CrisisBoard Intelligence Core running on http://localhost:${PORT}`);
});
