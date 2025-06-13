// D&D Game Types
export interface Character {
  id: string;
  name: string;
  race: Race;
  class: CharacterClass;
  level: number;
  stats: Stats;
  personality: Personality;
  quirk: Quirk;
  backstory?: string;
  isPlayer: boolean;
}

export interface Stats {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

export interface World {
  id: string;
  name: string;
  description: string;
  inhabitants: string;
  backstory: string;
  plotHook: string;
  imageUrl?: string;
  theme: string;
}

export interface Party {
  id: string;
  members: Character[];
  currentQuest?: Quest;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'main' | 'side';
  status: 'active' | 'completed' | 'failed';
  difficultyClass: number;
}

export interface Action {
  id: string;
  type: 'say' | 'do' | 'discuss' | 'combat' | 'roll';
  characterId: string;
  text: string;
  diceRoll?: DiceRoll;
  outcome?: string;
  timestamp: Date;
}

export interface DiceRoll {
  type: DiceType;
  result: number;
  modifier?: number;
  total: number;
  purpose: string;
}

export type DiceType = 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20' | 'd100';

export type Race = 
  | 'Human' 
  | 'Elf' 
  | 'Dwarf' 
  | 'Halfling' 
  | 'Gnome' 
  | 'Orc' 
  | 'Tiefling' 
  | 'Dragonborn' 
  | 'Goliath' 
  | 'Aarakocra';

export type CharacterClass = 
  | 'Fighter' 
  | 'Wizard' 
  | 'Rogue' 
  | 'Cleric' 
  | 'Barbarian' 
  | 'Ranger' 
  | 'Sorcerer' 
  | 'Bard';

export type Personality = 
  | 'Brave' 
  | 'Cautious' 
  | 'Curious' 
  | 'Loyal' 
  | 'Witty' 
  | 'Gruff';

export type Quirk = 
  | 'Collects odd trinkets'
  | 'Hums when nervous'
  | 'Obsessed with specific food'
  | 'Talks to weapon'
  | 'Superstitious about omens'
  | 'Keeps detailed journal'
  | 'Afraid of common thing'
  | 'Always tries to barter'
  | 'Speaks in rhymes when tense'
  | 'Has lucky charm';

export interface GameState {
  currentWorld?: World;
  currentParty?: Party;
  playerCharacter?: Character;
  gamePhase: 'world-selection' | 'character-creation' | 'party-generation' | 'gameplay';
  narrative: string[];
  availableActions: string[];
}

// API Response types
export interface AIResponse {
  narrative: string;
  suggestedActions?: string[];
  diceRollRequired?: {
    type: DiceType;
    difficultyClass: number;
    stat: keyof Stats;
  };
}

export interface ImageGenerationResponse {
  url: string;
  prompt: string;
}
