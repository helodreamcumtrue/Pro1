/**
 * CRISISBOARD INTELLIGENCE ENGINES v2.0
 * High-performance analytical frameworks for Risk and Finance.
 * Optimized for executive decision-making and boardroom reporting.
 */

/**
 * 1. ENHANCED RISK ENGINE
 * Uses a weighted geometric mean to calculate the "Crisis Index".
 * Prioritizes 'Velocity' as a multiplier for short-term operational stability.
 */
const processRisk = (risk) => {
  const i = Math.min(Math.max(risk.rawImpact || 5, 1), 10);
  const p = Math.min(Math.max(risk.rawProbability || 5, 1), 10);
  const v = Math.min(Math.max(risk.rawVelocity || 5, 1), 10);

  // Velocity acts as a weight: High velocity risks escalate the score faster
  const velocityWeight = 1 + (v / 20); 
  const baseScore = (i * p * 1.5);
  const score = Math.min(Math.round(baseScore * velocityWeight), 100);
  
  let status = 'LOW';
  let color = '#10b981'; // Emerald

  if (score > 80) {
    status = 'CRITICAL';
    color = '#f43f5e'; // Rose
  } else if (score > 60) {
    status = 'HIGH';
    color = '#f59e0b'; // Amber
  } else if (score > 40) {
    status = 'WARNING';
    color = '#3b82f6'; // Blue
  } else if (score > 20) {
    status = 'ELEVATED';
    color = '#6366f1'; // Indigo
  }

  return {
    score,
    status,
    color,
    impactLevel: i,
    probabilityLevel: p,
    velocityLevel: v,
    impact: score // Normalized for financial engine
  };
};

/**
 * 2. ADVANCED FINANCIAL IMPACT ENGINE
 * Translates risk scores into granular P&L consequences.
 * Calculates Revenue Erosion, OpEx Surge, and EBITDA impact.
 */
const calculateFinancials = (riskScore, profile) => {
  const { monthlyRevenue, monthlyCosts, sensitivity, industry } = profile;
  
  // Industry-specific volatility multipliers
  const sectorMultipliers = {
    'Technology & Manufacturing': 1.2,
    'Fintech': 1.4,
    'Retail': 1.1,
    'General': 1.0
  };
  const multiplier = sectorMultipliers[industry] || 1.0;
  
  // Normalize factor based on score and corporate sensitivity
  const factor = (riskScore / 100) * sensitivity * multiplier;
  
  // Revenue Impact (Demand loss / Contract cancellations)
  const revenueLoss = Math.round(monthlyRevenue * 0.15 * factor);
  
  // OpEx Impact (Legal fees / Supply chain premiums / PR costs)
  const costIncrease = Math.round(monthlyCosts * 0.09 * factor);
  
  // Margin Analytics
  const currentEBITDA = monthlyRevenue - monthlyCosts;
  const currentMargin = (currentEBITDA / monthlyRevenue) * 100;
  
  const projectedRevenue = monthlyRevenue - revenueLoss;
  const projectedCosts = monthlyCosts + costIncrease;
  const projectedEBITDA = projectedRevenue - projectedCosts;
  const projectedMargin = (projectedEBITDA / projectedRevenue) * 100;

  return {
    revenueLoss,
    costIncrease,
    ebitdaImpact: currentEBITDA - projectedEBITDA,
    marginErosion: (currentMargin - projectedMargin).toFixed(2),
    projectedMargin: projectedMargin.toFixed(2),
    recoveryCostEstimate: Math.round(revenueLoss * 0.25), // Estimate of capital needed to revert impact
    currency: profile.currency || 'INR'
  };
};

/**
 * 3. STRATEGIC RECOMMENDATION ENGINE
 * Dynamic rule-based logic to generate actionable boardroom protocols.
 */
const generateRecommendations = (riskAnalysis, type) => {
  const { status, score } = riskAnalysis;
  const actions = [];

  // Universal Severity Triggers
  if (score > 85) {
    actions.push({ task: 'Activate Crisis Management Team (CMT)', priority: 'CRITICAL', eta: '2h' });
    actions.push({ task: 'Immediate Investor Relations (IR) Hold Statement', priority: 'CRITICAL', eta: '4h' });
  } else if (score > 60) {
    actions.push({ task: 'Executive Committee Briefing', priority: 'HIGH', eta: '24h' });
  }

  // Type-Specific Protocols
  switch (type) {
    case 'REGULATORY':
      actions.push({ task: 'Gap Analysis vs New Compliance Framework', priority: 'High', owner: 'Legal' });
      actions.push({ task: 'Lobbying & Govt. Relations Outreach', priority: 'Medium', owner: 'Public Affairs' });
      break;
    case 'LOGISTICS':
      actions.push({ task: 'Identify Tier-2 Alternate Suppliers', priority: 'High', owner: 'Ops' });
      actions.push({ task: 'Inventory Buffer Optimization (Safety Stock)', priority: 'Medium', owner: 'Supply Chain' });
      break;
    case 'FISCAL':
      actions.push({ task: 'Review Forward Exchange Contracts', priority: 'High', owner: 'Finance' });
      actions.push({ task: 'Stress-test Cash Flow Liquidity', priority: 'High', owner: 'Treasury' });
      break;
    case 'REPUTATION':
      actions.push({ task: 'Real-time Sentiment Analysis Monitoring', priority: 'Medium', owner: 'Marketing' });
      actions.push({ task: 'Stakeholder Reassurance Campaign', priority: 'High', owner: 'PR' });
      break;
    case 'CYBER':
      actions.push({ task: 'Penetration Testing & Perimeter Hardening', priority: 'Critical', owner: 'CISO' });
      actions.push({ task: 'Backup Integrity Verification', priority: 'High', owner: 'IT' });
      break;
    default:
      actions.push({ task: 'Establish Baseline Monitoring KPIs', priority: 'Low', owner: 'Strategy' });
  }

  return actions;
};

module.exports = {
  processRisk,
  calculateFinancials,
  generateRecommendations
};
