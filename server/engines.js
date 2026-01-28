/**
 * CRISISBOARD LOGIC ENGINES
 * High-performance analytical frameworks for Risk and Finance.
 */

const processRisk = (risk) => {
  const impact = risk.rawImpact || 5;
  const probability = risk.rawProbability || 5;
  const velocity = risk.rawVelocity || 5;

  // Formula: Geometric weighting normalized to 100
  const score = Math.round((impact * probability * velocity) / 10);
  
  let status = 'LOW';
  if (score > 70) status = 'CRITICAL';
  else if (score > 40) status = 'WARNING';
  else if (score > 20) status = 'ELEVATED';

  return {
    score,
    status,
    impact: score // Normalized impact for financial translation
  };
};

const calculateFinancials = (riskScore, profile) => {
  const { monthlyRevenue, monthlyCosts, sensitivity } = profile;
  
  // High sensitivity + high score = aggressive erosion
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
};

const generateRecommendations = (riskAnalysis, type) => {
  const { status, score } = riskAnalysis;
  const actions = [];

  if (status === 'CRITICAL') {
    actions.push({ task: 'Immediate Executive Briefing', priority: 'P0' });
  }

  switch (type) {
    case 'REGULATORY':
      actions.push({ task: 'Legal Review of Compliance Gap', priority: 'High' });
      break;
    case 'LOGISTICS':
      actions.push({ task: 'Inventory buffer analysis', priority: 'Medium' });
      actions.push({ task: 'Supply route diversification', priority: 'High' });
      break;
    case 'FISCAL':
      actions.push({ task: 'Execute FX Hedging Protocol', priority: 'High' });
      break;
    default:
      actions.push({ task: 'Monitor signal intensity', priority: 'Low' });
  }

  return actions;
};

module.exports = {
  processRisk,
  calculateFinancials,
  generateRecommendations
};
