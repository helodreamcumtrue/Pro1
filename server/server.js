const express = require('express');
const cors = require('cors');
const { 
  processRisk, 
  calculateFinancials, 
  generateRecommendations 
} = require('./engines');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// In-memory "Intelligence Registry" (Substitute with Firestore/PostgreSQL for production)
let riskDatabase = [
  { 
    id: 1, 
    type: 'REGULATORY', 
    title: 'AI Act Compliance Delta', 
    industry: 'Tech', 
    location: 'EU', 
    description: 'Immediate infrastructure audit required for LLM weights storage.',
    rawImpact: 9, 
    rawProbability: 8, 
    rawVelocity: 9,
    timestamp: new Date().toISOString()
  },
  { 
    id: 2, 
    type: 'LOGISTICS', 
    title: 'Suez Transit Bottleneck', 
    industry: 'Retail', 
    location: 'Global', 
    description: 'Rerouting adding 14 days to lead times for Q4 stock.',
    rawImpact: 7, 
    rawProbability: 9, 
    rawVelocity: 4,
    timestamp: new Date().toISOString()
  }
];

let companyProfile = {
  monthlyRevenue: 1500000,
  monthlyCosts: 1100000,
  industry: 'Technology & Manufacturing',
  sensitivity: 0.85 // 0 to 1 scale
};

// --- API Endpoints ---

/**
 * GET /api/risks
 * Returns all risks processed through the Risk, Financial, and Recommendation engines.
 */
app.get('/api/risks', (req, res) => {
  const processedRisks = riskDatabase.map(risk => {
    // 1. Calculate Score
    const riskAnalysis = processRisk(risk);
    
    // 2. Calculate Financial Consequences
    const financialImpact = calculateFinancials(riskAnalysis.impact, companyProfile);
    
    // 3. Generate Next Steps
    const recommendations = generateRecommendations(riskAnalysis, risk.type);

    return {
      ...risk,
      ...riskAnalysis,
      financialImpact,
      recommendations
    };
  });

  res.json(processedRisks);
});

/**
 * POST /api/risks
 * Ingests a new signal, standardizes it, and saves it to the registry.
 */
app.post('/api/risks', (req, res) => {
  const { title, type, industry, location, description, impact, probability, velocity } = req.body;

  const newRisk = {
    id: riskDatabase.length + 1,
    title: title || 'Unnamed Signal',
    type: type || 'GENERAL',
    industry: industry || 'Global',
    location: location || 'Remote',
    description: description || 'No description provided.',
    rawImpact: parseFloat(impact) || 5,
    rawProbability: parseFloat(probability) || 5,
    rawVelocity: parseFloat(velocity) || 5,
    timestamp: new Date().toISOString()
  };

  riskDatabase.push(newRisk);
  res.status(201).json({ message: 'Risk signal standardized and ingested.', id: newRisk.id });
});

/**
 * GET /api/profile
 * Returns the executive company profile.
 */
app.get('/api/profile', (req, res) => {
  res.json(companyProfile);
});

/**
 * PUT /api/profile
 * Updates company profile details for simulation accuracy.
 */
app.put('/api/profile', (req, res) => {
  companyProfile = { ...companyProfile, ...req.body };
  res.json({ message: 'Executive profile updated.', profile: companyProfile });
});

app.listen(PORT, () => {
  console.log(`CrisisBoard Intelligence Core running on http://localhost:${PORT}`);
});
