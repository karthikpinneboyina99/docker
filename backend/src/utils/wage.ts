export function estimateWage(marketValue: number, position: string, age: number): { estimatedWage: number, explanation: string } {
  const baseWage = marketValue * 0.10;
  
  let positionMultiplier = 1.0;
  const pos = position.toLowerCase();
  if (pos.includes('forward') || pos.includes('striker') || pos.includes('winger')) {
    positionMultiplier = 1.20;
  } else if (pos.includes('defender') || pos.includes('back')) {
    positionMultiplier = 0.85;
  } else if (pos.includes('goalkeeper')) {
    positionMultiplier = 0.75;
  }
  
  let ageMultiplier = 1.0;
  if (age <= 21) ageMultiplier = 0.60;
  else if (age >= 29) ageMultiplier = 1.20;
  
  let estimatedWage = Math.round(baseWage * positionMultiplier * ageMultiplier);
  if (estimatedWage < 500000) estimatedWage = 500000;

  return {
    estimatedWage,
    explanation: `Estimated using a heuristic formula: 10% of market value (base), adjusted by a ${positionMultiplier}x position multiplier and a ${ageMultiplier}x age multiplier. This is an estimate, not actual data.`
  };
}
