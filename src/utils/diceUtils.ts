import type { Stats, DiceRoll } from '../types/game';

export interface StatCheck {
  stat: keyof Stats;
  difficultyClass: number;
  advantage?: boolean;
  disadvantage?: boolean;
}

export interface StatCheckResult {
  roll: DiceRoll;
  statModifier: number;
  total: number;
  success: boolean;
  criticalSuccess: boolean;
  criticalFailure: boolean;
}

// Calculate ability modifier from ability score
export const getAbilityModifier = (score: number): number => {
  return Math.floor((score - 10) / 2);
};

// Get all ability modifiers from stats
export const getAllModifiers = (stats: Stats) => {
  return {
    strength: getAbilityModifier(stats.strength),
    dexterity: getAbilityModifier(stats.dexterity),
    constitution: getAbilityModifier(stats.constitution),
    intelligence: getAbilityModifier(stats.intelligence),
    wisdom: getAbilityModifier(stats.wisdom),
    charisma: getAbilityModifier(stats.charisma)
  };
};

// Roll a die with specified sides
export const rollDie = (sides: number): number => {
  return Math.floor(Math.random() * sides) + 1;
};

// Roll multiple dice
export const rollMultipleDice = (count: number, sides: number): number[] => {
  return Array.from({ length: count }, () => rollDie(sides));
};

// Perform a stat check
export const performStatCheck = (
  stats: Stats,
  check: StatCheck
): StatCheckResult => {
  const statModifier = getAbilityModifier(stats[check.stat]);
  
  let rolls: number[] = [];
  
  if (check.advantage) {
    // Roll twice, take higher
    rolls = [rollDie(20), rollDie(20)];
    rolls.sort((a, b) => b - a); // Sort descending
  } else if (check.disadvantage) {
    // Roll twice, take lower
    rolls = [rollDie(20), rollDie(20)];
    rolls.sort((a, b) => a - b); // Sort ascending
  } else {
    // Normal roll
    rolls = [rollDie(20)];
  }
  
  const diceResult = rolls[0];
  const total = diceResult + statModifier;
  const success = total >= check.difficultyClass;
  const criticalSuccess = diceResult === 20;
  const criticalFailure = diceResult === 1;
  
  const roll: DiceRoll = {
    type: 'd20',
    result: diceResult,
    modifier: statModifier,
    total,
    purpose: `${check.stat.charAt(0).toUpperCase() + check.stat.slice(1)} check (DC ${check.difficultyClass})`
  };
  
  return {
    roll,
    statModifier,
    total,
    success,
    criticalSuccess,
    criticalFailure
  };
};

// Common Difficulty Classes for D&D 5e
export const DIFFICULTY_CLASSES = {
  TRIVIAL: 5,
  EASY: 10,
  MEDIUM: 15,
  HARD: 20,
  VERY_HARD: 25,
  NEARLY_IMPOSSIBLE: 30
} as const;

// Get descriptive text for DC
export const getDifficultyDescription = (dc: number): string => {
  if (dc <= 5) return 'Trivial';
  if (dc <= 10) return 'Easy';
  if (dc <= 15) return 'Medium';
  if (dc <= 20) return 'Hard';
  if (dc <= 25) return 'Very Hard';
  return 'Nearly Impossible';
};

// Generate damage roll (e.g., "2d6+3")
export const rollDamage = (diceCount: number, diceSides: number, modifier: number = 0): {
  rolls: number[];
  total: number;
  formula: string;
} => {
  const rolls = rollMultipleDice(diceCount, diceSides);
  const total = rolls.reduce((sum, roll) => sum + roll, 0) + modifier;
  
  let formula = `${diceCount}d${diceSides}`;
  if (modifier > 0) formula += `+${modifier}`;
  if (modifier < 0) formula += `${modifier}`;
  
  return { rolls, total, formula };
};

// Common stat check helpers
export const makeStrengthCheck = (stats: Stats, dc: number = 15) => 
  performStatCheck(stats, { stat: 'strength', difficultyClass: dc });

export const makeDexterityCheck = (stats: Stats, dc: number = 15) => 
  performStatCheck(stats, { stat: 'dexterity', difficultyClass: dc });

export const makeConstitutionCheck = (stats: Stats, dc: number = 15) => 
  performStatCheck(stats, { stat: 'constitution', difficultyClass: dc });

export const makeIntelligenceCheck = (stats: Stats, dc: number = 15) => 
  performStatCheck(stats, { stat: 'intelligence', difficultyClass: dc });

export const makeWisdomCheck = (stats: Stats, dc: number = 15) => 
  performStatCheck(stats, { stat: 'wisdom', difficultyClass: dc });

export const makeCharismaCheck = (stats: Stats, dc: number = 15) => 
  performStatCheck(stats, { stat: 'charisma', difficultyClass: dc });

// Format roll result for display
export const formatRollResult = (result: StatCheckResult): string => {
  const { roll, success, criticalSuccess, criticalFailure } = result;
  
  let message = `${roll.purpose}: ${roll.result}`;
  if (roll.modifier) {
    message += roll.modifier >= 0 ? ` + ${roll.modifier}` : ` - ${Math.abs(roll.modifier)}`;
  }
  message += ` = ${roll.total}`;
  
  if (criticalSuccess) {
    message += ' (CRITICAL SUCCESS!)';
  } else if (criticalFailure) {
    message += ' (CRITICAL FAILURE!)';
  } else if (success) {
    message += ' (Success)';
  } else {
    message += ' (Failure)';
  }
  
  return message;
};
