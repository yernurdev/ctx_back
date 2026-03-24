/**
 * Cortex AI - Transplant Risk Calculator
 * Real biomathematical formulas for kidney transplant compatibility
 */

/**
 * CKD-EPI 2021 creatinine formula (no race variable)
 * Returns eGFR in mL/min/1.73m²
 */
function calculateCKDEPI(creatinine, age, isFemale = false) {
  const kappa = isFemale ? 0.7 : 0.9;
  const alpha = isFemale ? -0.241 : -0.302;
  const ratio = creatinine / kappa;
  const base = ratio < 1 ? Math.pow(ratio, alpha) : Math.pow(ratio, -1.200);
  const egfr = 142 * base * Math.pow(0.9938, age) * (isFemale ? 1.012 : 1.0);
  return Math.round(egfr * 10) / 10;
}

/**
 * Simplified KDPI Score (0–100%)
 * Based on: age, creatinine, bmi, bun
 */
function calculateKDPI(donorData) {
  const { age, creatinine, bmi, bun } = donorData;
  // KDPI uses donor factors — simplified scoring
  let score = 0;
  if (age > 50) score += (age - 50) * 0.5;
  if (creatinine > 1.5) score += (creatinine - 1.5) * 10;
  if (bmi > 30) score += (bmi - 30) * 0.5;
  if (bun > 25) score += (bun - 25) * 0.3;
  score = Math.min(Math.max(score, 0), 100);
  return Math.round(score * 10) / 10;
}

/**
 * Blood type ABO compatibility matrix
 */
function isABOCompatible(donorBT, recipientBT) {
  const compatibility = {
    'O-': ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'],
    'O+': ['O+', 'A+', 'B+', 'AB+'],
    'A-': ['A-', 'A+', 'AB-', 'AB+'],
    'A+': ['A+', 'AB+'],
    'B-': ['B-', 'B+', 'AB-', 'AB+'],
    'B+': ['B+', 'AB+'],
    'AB-': ['AB-', 'AB+'],
    'AB+': ['AB+'],
  };
  return (compatibility[donorBT] || []).includes(recipientBT);
}

/**
 * Simple HLA mismatch counter
 * HLA strings like "A*02:01,B*07:02,C*03:04"
 */
function calculateHLAMismatch(donorHLA, recipientHLA) {
  const dAlleles = new Set(donorHLA.split(',').map(a => a.trim().toUpperCase()));
  const rAlleles = new Set(recipientHLA.split(',').map(a => a.trim().toUpperCase()));
  let matched = 0;
  for (const a of dAlleles) {
    if (rAlleles.has(a)) matched++;
  }
  const total = Math.max(dAlleles.size, rAlleles.size);
  const mismatch = total - matched;
  return { matched, mismatch, total };
}

/**
 * Main compatibility score calculator
 * Returns score 0-100 and risk assessment
 */
function calculateCompatibility(donorData, recipientData) {
  const riskFactors = [];
  const recommendations = [];
  let score = 100;

  // 1. ABO compatibility
  const aboOk = isABOCompatible(donorData.blood_type, recipientData.blood_type);
  if (!aboOk) {
    score -= 40;
    riskFactors.push('ABO blood group incompatibility detected');
    recommendations.push('ABO crossmatch required — incompatible blood types');
  }

  // 2. HLA mismatch
  const { mismatch, total } = calculateHLAMismatch(donorData.hla, recipientData.hla);
  const mismatchPct = total > 0 ? mismatch / total : 0;
  score -= Math.round(mismatchPct * 25);
  if (mismatch > 2) {
    riskFactors.push(`High HLA mismatch: ${mismatch}/${total} antigens mismatched`);
    recommendations.push('Consider immunosuppression intensification');
  }

  // 3. Creatinine (recipient - CKD severity)
  const egfr = calculateCKDEPI(recipientData.creatinine, recipientData.age);
  if (egfr < 15) {
    score -= 15;
    riskFactors.push(`Recipient eGFR critically low: ${egfr} mL/min (G5 CKD)`);
    recommendations.push('Urgent transplant evaluation required');
  } else if (egfr < 30) {
    score -= 8;
    riskFactors.push(`Recipient eGFR low: ${egfr} mL/min (G4 CKD)`);
  } else if (egfr < 60) {
    score -= 3;
    riskFactors.push(`Recipient eGFR mildly reduced: ${egfr} mL/min`);
  }

  // 4. Donor kidney quality (KDPI)
  const kdpi = calculateKDPI(donorData);
  if (kdpi > 85) {
    score -= 15;
    riskFactors.push(`High donor KDPI: ${kdpi}% — increased delayed graft function risk`);
    recommendations.push('Consider extended criteria donor protocols');
  } else if (kdpi > 60) {
    score -= 7;
    riskFactors.push(`Moderate donor KDPI: ${kdpi}%`);
  }

  // 5. BMI mismatch
  const bmiDiff = Math.abs(donorData.bmi - recipientData.bmi);
  if (bmiDiff > 10) {
    score -= 5;
    riskFactors.push('Significant BMI difference between donor and recipient');
  }

  // 6. Age difference
  const ageDiff = Math.abs(donorData.age - recipientData.age);
  if (ageDiff > 30) {
    score -= 5;
    riskFactors.push(`Large age gap (${ageDiff} years)`);
  }

  // 7. Metabolic factors
  if (recipientData.glucose > 180) {
    score -= 5;
    riskFactors.push('Recipient hyperglycemia — post-transplant diabetes risk');
    recommendations.push('Optimize glycemic control pre-transplant');
  }
  if (recipientData.crp > 10) {
    score -= 5;
    riskFactors.push(`Elevated CRP: ${recipientData.crp} mg/L — active inflammation`);
    recommendations.push('Investigate and treat underlying infection/inflammation');
  }
  if (recipientData.hemoglobin < 8) {
    score -= 5;
    riskFactors.push('Severe anemia in recipient');
    recommendations.push('Treat anemia before transplant');
  }

  // Clamp score
  score = Math.min(Math.max(Math.round(score), 0), 100);

  // Risk level
  let riskLevel;
  if (score >= 75) riskLevel = 'Low';
  else if (score >= 55) riskLevel = 'Moderate';
  else if (score >= 35) riskLevel = 'High';
  else riskLevel = 'Critical';

  // Default recommendation
  if (recommendations.length === 0) {
    recommendations.push('All parameters within acceptable transplant thresholds');
  }

  // Organ quality
  let organQuality;
  if (kdpi < 35) organQuality = 'Excellent';
  else if (kdpi < 60) organQuality = 'Good';
  else if (kdpi < 85) organQuality = 'Marginal';
  else organQuality = 'High Risk';

  // AI summary
  const aiSummary = generateSummary(score, riskLevel, aboOk, mismatch, egfr, kdpi, riskFactors);

  return {
    compatibilityScore: score,
    riskLevel,
    ckdEpi: egfr,
    kdpi,
    organQuality,
    riskFactors,
    recommendations,
    aiSummary,
  };
}

function generateSummary(score, riskLevel, aboOk, hlaMismatch, egfr, kdpi, riskFactors) {
  const lines = [
    `Compatibility index: ${score}/100 — ${riskLevel} risk.`,
  ];

  if (!aboOk) {
    lines.push('ABO incompatibility is a critical barrier and must be resolved before proceeding.');
  } else {
    lines.push('ABO blood groups are compatible.');
  }

  lines.push(`HLA mismatch count: ${hlaMismatch}. Recipient eGFR: ${egfr} mL/min (CKD-EPI 2021).`);
  lines.push(`Donor KDPI: ${kdpi}% — ${kdpi < 35 ? 'excellent' : kdpi < 60 ? 'standard' : 'marginal'} organ quality.`);

  if (riskFactors.length > 0) {
    lines.push(`Key risk factors identified: ${riskFactors.slice(0, 3).join('; ')}.`);
  } else {
    lines.push('No critical risk factors identified. Proceed per standard protocol.');
  }

  return lines.join(' ');
}

module.exports = { calculateCompatibility, calculateCKDEPI, calculateKDPI };
