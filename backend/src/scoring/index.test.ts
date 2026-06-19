import { describe, it, expect } from 'vitest';
import { calculateReliabilityScore, calculateTransferProbability } from './index';

describe('calculateReliabilityScore', () => {
  it('should return a low score for a single low-reliability source', () => {
    const sources = [
      { reliabilityWeight: 0.2, reportedAt: new Date() }
    ];
    // Formula: 0.2 weight * 1.0 decay = 0.2 base average. Bonus = 0.
    // 0.2 * 100 = 20.
    const score = calculateReliabilityScore(sources);
    expect(score).toBe(20);
  });

  it('should return a higher score when corroborated by multiple sources', () => {
    const sources = [
      { reliabilityWeight: 0.8, reportedAt: new Date() },
      { reliabilityWeight: 0.8, reportedAt: new Date() },
      { reliabilityWeight: 0.8, reportedAt: new Date() },
    ];
    // Formula: Base average = 0.8. Bonus = (3 - 1) * 0.05 = 0.10.
    // Final = 0.8 * 1.10 = 0.88 -> 88.
    const score = calculateReliabilityScore(sources);
    expect(score).toBe(88);
  });

  it('should decay the score if the report is very old', () => {
    const oldDate = new Date();
    oldDate.setDate(oldDate.getDate() - 60); // 60 days old
    const sources = [
      { reliabilityWeight: 1.0, reportedAt: oldDate }
    ];
    // Decay factor at 60 days is 0.5. 1.0 * 0.5 = 0.5 base average -> 50.
    const score = calculateReliabilityScore(sources);
    expect(score).toBe(50);
  });

  it('should handle zero sources gracefully', () => {
    const score = calculateReliabilityScore([]);
    expect(score).toBe(0);
  });
});

describe('calculateTransferProbability', () => {
  it('should return a high score for a rumor with three high-reliability sources, AGREED status, expiring contract', () => {
    const probability = calculateTransferProbability({
      reliabilityScore: 88, // Result of 3 high-rel sources
      contractMonthsRemaining: 6, // Expiring soon (<12) -> contract score 100
      rumorStatus: 'AGREED', // Status score 90
      daysSinceRumorCreated: 5, // No staleness penalty
      clubSpendingFitScore: 0.8 // -> spending fit 80
    });
    // Calculation:
    // Status (90 * 0.50) = 45
    // Reliability (88 * 0.30) = 26.4
    // Contract (100 * 0.10) = 10
    // Spending (80 * 0.10) = 8
    // Total = 45 + 26.4 + 10 + 8 = 89.4 -> round to 89
    expect(probability).toBe(89);
  });

  it('should return 100 for already expired contract (negative months)', () => {
    const probability = calculateTransferProbability({
      reliabilityScore: 100,
      contractMonthsRemaining: -2, // Already expired -> contract score 100
      rumorStatus: 'COMPLETED', // Status score 100
      daysSinceRumorCreated: 0,
      clubSpendingFitScore: 1.0 // spending fit 100
    });
    // 50 + 30 + 10 + 10 = 100
    expect(probability).toBe(100);
  });

  it('should penalize old rumors unless they are completed', () => {
    const oldRumorProb = calculateTransferProbability({
      reliabilityScore: 50,
      contractMonthsRemaining: 24, // Score ~ 66.6
      rumorStatus: 'RUMOR', // Score 30
      daysSinceRumorCreated: 100, // Penalty -20
      clubSpendingFitScore: 0.5 // Score 50
    });
    // Status (30*0.5) = 15
    // Rel (50*0.3) = 15
    // Contract (66.6*0.1) = 6.66
    // Spend (50*0.1) = 5
    // Subtotal: 41.66
    // Staleness Penalty: -20
    // Total: ~22
    expect(oldRumorProb).toBe(22);

    const oldCompletedProb = calculateTransferProbability({
      reliabilityScore: 50,
      contractMonthsRemaining: 24, 
      rumorStatus: 'COMPLETED', // Score 100, overrides staleness
      daysSinceRumorCreated: 100,
      clubSpendingFitScore: 0.5
    });
    // Status (100*0.5) = 50
    // Rel (50*0.3) = 15
    // Contract (66.6*0.1) = 6.66
    // Spend (50*0.1) = 5
    // Subtotal: 76.66
    // Staleness Penalty: 0
    // Total: 77
    expect(oldCompletedProb).toBe(77);
  });
});
