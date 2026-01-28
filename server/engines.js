/**
 * CRISISBOARD LOGIC ENGINES
 * The mathematical frameworks for Risk Scoring, Financial Impact, and Recommendations.
 */

/**
 * 1. RISK ENGINE
 * Standardizes raw data and calculates the Risk Score.
 * Formula: (Impact * Probability * Velocity) normalized to 100.
 */
function processRisk(risk) {
  const impact = risk.rawImpact;      // 1-10
  const probability = risk.rawProbability; // 1-10
  const velocity = risk.rawVelocity;    // 1-10

  // Geometric mean-based scoring for higher sensitivity to high-impact variables
  const score = Math.round((impact * probability * velocity) / 10);
  
  let status = 'LOW';
  if (score > 70) status = 'CRITICAL';
  else if (score > 40) status = 'WARNING';
  else if (score > 20) status = 'ELEVATED';

  return {
    score,
    status,
    impact: score // Normalized impact for financial engine
  };
}

/**
 * 2. FINANCIAL IMPACT ENGINE
 * Translates abstract risk into currency-based consequences.
 */
function calculateFinancials(riskScore, profile) {
  const { monthlyRevenue, monthlyCosts, sensitivity } = profile;
  
  // Logic: High risk score + high sensitivity = higher revenue erosion
  const factor = (riskScore / 100) * sensitivity;
  
  const revenueLoss = Math.round(monthlyRevenue * 0.12 * factor);
  const costIncrease = Math.round(monthlyCosts * 0.07 * factor);
  
  const currentMargin = ((monthlyRevenue - monthlyCosts) / monthlyRevenue) * 100;
  const projectedRevenue = monthlyRevenue - revenueLoss;
  const projectedCosts = monthlyCosts + costIncrease;
  const projectedMargin = ((projectedRevenue - projectedCosts) / projectedRevenue) * 100;

  return {
    revenueLoss,
    costIncrease,
    marginErosion: (currentMargin - projectedMargin).toFixed(2),
    projectedMargin: projectedMargin.toFixed(2),
    currency: 'INR'
  };
}

/**
 * 3. RECOMMENDATION ENGINE
 * Rule-based next steps based on risk type and severity.
 */
function generateRecommendations(riskAnalysis, type) {
  const { status, score } = riskAnalysis;
  const actions = [];

  if (status === 'CRITICAL') {
    actions.push({ task: 'Immediate Board Briefing', priority: 'P0' });
  }

  switch (type) {
    case 'REGULATORY':
      actions.push({ task: 'Legal Review of Compliance Delta', priority: 'High' });
      if (score > 80) actions.push({ task: 'Budget allocation for infrastructure audit', priority: 'High' });
      break;
    case 'LOGISTICS':
      actions.push({ task: 'Inventory buffer analysis', priority: 'Medium' });
      actions.push({ task: 'Diversify supply route nodes', priority: 'High' });
      break;
    case 'FISCAL':
      actions.push({ task: 'Execute Currency Hedging', priority: 'High' });
      actions.push({ task: 'Vendor payment renegotiation', priority: 'Medium' });
      break;
    default:
      actions.push({ task: 'Standard risk monitoring', priority: 'Low' });
  }

  return actions;
}

module.exports = {
  processRisk,
  calculateFinancials,
  generateRecommendations
};
