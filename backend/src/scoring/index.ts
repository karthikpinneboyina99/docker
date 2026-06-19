/**
 * Scoring Engine for Football Transfer Intelligence Platform
 * 
 * =========================================================
 * 1. calculateReliabilityScore Formula
 * =========================================================
 * - Recency Decay: A source's reliabilityWeight (0 to 1) decays based on the age of the report.
 *   Reports from 0 days ago retain 100% of their weight. Reports 60+ days old decay to 50% of their weight.
 *   Math: decay = Math.max(0.5, 1 - (daysOld / 60) * 0.5)
 *   Adjusted Weight = reliabilityWeight * decay
 * 
 * - Base Average: We calculate the average of all adjusted weights.
 * 
 * - Corroboration Bonus: If multiple independent sources report the rumor, we add a 5% bonus 
 *   to the final score for each source beyond the first, capped at +20% (max 5 sources).
 *   Math: bonus = Math.min(0.20, (numSources - 1) * 0.05)
 * 
 * - Final Score: (Base Average * (1 + bonus)) * 100, clamped between 0 and 100.
 * 
 * =========================================================
 * 2. calculateTransferProbability Formula
 * =========================================================
 * Combines 4 signals into a 0-100 probability using weighted scaling:
 * 
 * - Status (50% weight): 
 *   COMPLETED: 100, AGREED: 90, ADVANCED_TALKS: 70, RUMOR: 30, DENIED/DEAD: 0.
 * 
 * - Reliability (30% weight):
 *   Directly uses the 0-100 score from calculateReliabilityScore.
 * 
 * - Contract Remaining (10% weight):
 *   Players with <= 12 months left (or expired) score 100 (highly likely to move).
 *   Players with >= 48 months left score 0.
 *   Linear scale between 12 and 48 months: max(0, 100 - ((months - 12) / 36) * 100)
 * 
 * - Club Spending Fit (10% weight):
 *   clubSpendingFitScore (0-1) * 100
 * 
 * - Staleness Penalty:
 *   If the rumor is old and has not been COMPLETED, we subtract points:
 *   > 30 days: -5
 *   > 60 days: -10
 *   > 90 days: -20
 * 
 * Final Score: (Status * 0.5) + (Reliability * 0.3) + (Contract * 0.1) + (SpendingFit * 0.1) - Staleness.
 * The result is clamped between 0 and 100.
 */

export function calculateReliabilityScore(
  sources: { reliabilityWeight: number; reportedAt: Date }[],
  currentDate: Date = new Date()
): number {
  if (!sources || sources.length === 0) {
    return 0;
  }

  let totalAdjustedWeight = 0;

  for (const source of sources) {
    const diffTime = currentDate.getTime() - source.reportedAt.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    
    // Decay factor: max 1.0 at 0 days, min 0.5 at >= 60 days
    const decay = Math.max(0.5, 1 - (Math.max(0, diffDays) / 60) * 0.5);
    
    const adjustedWeight = source.reliabilityWeight * decay;
    totalAdjustedWeight += adjustedWeight;
  }

  const baseAverage = totalAdjustedWeight / sources.length;

  // Corroboration bonus: +5% per extra source, up to +20%
  const bonus = Math.min(0.20, (sources.length - 1) * 0.05);

  let finalScore = (baseAverage * (1 + bonus)) * 100;
  
  // Clamp between 0 and 100
  if (finalScore > 100) finalScore = 100;
  if (finalScore < 0) finalScore = 0;

  return Math.round(finalScore);
}

export function calculateTransferProbability(input: {
  reliabilityScore: number;
  contractMonthsRemaining: number;
  rumorStatus: string;
  daysSinceRumorCreated: number;
  clubSpendingFitScore: number;
}): number {
  let statusScore = 0;
  switch (input.rumorStatus) {
    case 'COMPLETED':
      statusScore = 100;
      break;
    case 'AGREED':
      statusScore = 90;
      break;
    case 'ADVANCED_TALKS':
      statusScore = 70;
      break;
    case 'RUMOR':
      statusScore = 30;
      break;
    case 'DENIED':
    case 'DEAD':
      statusScore = 0;
      break;
    default:
      statusScore = 0;
  }

  // Contract score calculation
  let contractScore = 100;
  if (input.contractMonthsRemaining > 12) {
    // 12 months -> 100, 48 months -> 0
    contractScore = Math.max(0, 100 - ((input.contractMonthsRemaining - 12) / 36) * 100);
  }

  // Club spending fit score (0-1 mapped to 0-100)
  const spendingFitScore = input.clubSpendingFitScore * 100;

  // Calculate weighted sum
  let probability = 
    (statusScore * 0.50) + 
    (input.reliabilityScore * 0.30) + 
    (contractScore * 0.10) + 
    (spendingFitScore * 0.10);

  // Apply staleness penalty if not completed
  if (input.rumorStatus !== 'COMPLETED') {
    if (input.daysSinceRumorCreated > 90) {
      probability -= 20;
    } else if (input.daysSinceRumorCreated > 60) {
      probability -= 10;
    } else if (input.daysSinceRumorCreated > 30) {
      probability -= 5;
    }
  }

  // Clamp result
  if (probability > 100) probability = 100;
  if (probability < 0) probability = 0;

  return Math.round(probability);
}
