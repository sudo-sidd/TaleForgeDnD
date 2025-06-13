import type { Race, CharacterClass, Personality, Quirk } from '../types/game';

export const RACES: { name: Race; description: string; bonuses: string }[] = [
  {
    name: 'Human',
    description: 'Versatile and adaptable',
    bonuses: '+1 to all stats'
  },
  {
    name: 'Elf',
    description: 'Graceful and long-lived',
    bonuses: '+2 Dexterity, darkvision'
  },
  {
    name: 'Dwarf',
    description: 'Hardy and stout',
    bonuses: '+2 Constitution, poison resistance'
  },
  {
    name: 'Halfling',
    description: 'Nimble and lucky',
    bonuses: '+2 Dexterity, reroll 1s on d20s'
  },
  {
    name: 'Gnome',
    description: 'Clever and magical',
    bonuses: '+2 Intelligence, advantage on magic saves'
  },
  {
    name: 'Orc',
    description: 'Strong and fierce',
    bonuses: '+2 Strength, survive one lethal hit'
  },
  {
    name: 'Tiefling',
    description: 'Fiendish and charismatic',
    bonuses: '+2 Charisma, fire resistance'
  },
  {
    name: 'Dragonborn',
    description: 'Draconic and proud',
    bonuses: '+2 Strength, breath weapon'
  },
  {
    name: 'Goliath',
    description: 'Massive and resilient',
    bonuses: '+2 Constitution, cold resistance'
  },
  {
    name: 'Aarakocra',
    description: 'Winged and swift',
    bonuses: '+2 Dexterity, flight ability'
  }
];

export const CLASSES: { name: CharacterClass; description: string; abilities: string }[] = [
  {
    name: 'Fighter',
    description: 'Melee expert',
    abilities: 'Proficient with all weapons, extra attack'
  },
  {
    name: 'Wizard',
    description: 'Arcane spellcaster',
    abilities: '+2 Intelligence, casts arcane spells'
  },
  {
    name: 'Rogue',
    description: 'Stealthy and cunning',
    abilities: '+2 Dexterity, sneak attack ability'
  },
  {
    name: 'Cleric',
    description: 'Divine spellcaster',
    abilities: '+2 Wisdom, healing and support spells'
  },
  {
    name: 'Barbarian',
    description: 'Raging warrior',
    abilities: '+2 Strength, rage for bonus damage'
  },
  {
    name: 'Ranger',
    description: 'Nature expert',
    abilities: '+2 Dexterity, tracking and ranged skills'
  },
  {
    name: 'Sorcerer',
    description: 'Innate spellcaster',
    abilities: '+2 Charisma, metamagic flexibility'
  },
  {
    name: 'Bard',
    description: 'Charismatic performer',
    abilities: '+2 Charisma, inspires allies'
  }
];

export const PERSONALITIES: { name: Personality; description: string }[] = [
  {
    name: 'Brave',
    description: 'Fearless in danger, inspires allies'
  },
  {
    name: 'Cautious',
    description: 'Plans carefully, avoids unnecessary risks'
  },
  {
    name: 'Curious',
    description: 'Seeks knowledge, explores hidden areas'
  },
  {
    name: 'Loyal',
    description: 'Devoted to the party, prioritizes group goals'
  },
  {
    name: 'Witty',
    description: 'Quick with humor, boosts morale in tense moments'
  },
  {
    name: 'Gruff',
    description: 'Blunt and direct, but reliable in a pinch'
  }
];

export const QUIRKS: { name: Quirk; description: string }[] = [
  {
    name: 'Collects odd trinkets',
    description: 'Always picking up shiny rocks, broken blades, etc.'
  },
  {
    name: 'Hums when nervous',
    description: 'Has a specific tune they hum in tense situations'
  },
  {
    name: 'Obsessed with specific food',
    description: 'Constantly talks about roasted boar or similar'
  },
  {
    name: 'Talks to weapon',
    description: 'Treats their weapon as if it\'s alive and listening'
  },
  {
    name: 'Superstitious about omens',
    description: 'Sees meaning in crows, broken mirrors, etc.'
  },
  {
    name: 'Keeps detailed journal',
    description: 'Meticulously records every adventure detail'
  },
  {
    name: 'Afraid of common thing',
    description: 'Terrified of spiders, heights, or something mundane'
  },
  {
    name: 'Always tries to barter',
    description: 'Attempts to negotiate even in inappropriate situations'
  },
  {
    name: 'Speaks in rhymes when tense',
    description: 'Can\'t help but rhyme during stressful moments'
  },
  {
    name: 'Has lucky charm',
    description: 'Carries a special item they never part with'
  }
];

export function generateRandomStats(): Record<string, number> {
  // Point-buy system with 27 points, stats start at 8
  const stats = {
    strength: 8,
    dexterity: 8,
    constitution: 8,
    intelligence: 8,
    wisdom: 8,
    charisma: 8
  };
  
  let pointsRemaining = 27;
  const statNames = Object.keys(stats);
  
  while (pointsRemaining > 0) {
    const randomStat = statNames[Math.floor(Math.random() * statNames.length)];
    if (stats[randomStat as keyof typeof stats] < 15) {
      stats[randomStat as keyof typeof stats]++;
      pointsRemaining--;
    }
  }
  
  return stats;
}
