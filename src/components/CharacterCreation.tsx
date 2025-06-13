import { useState } from 'react';
import type { World, Character, Race, CharacterClass, Personality, Quirk, Stats } from '../types/game';
import { RACES, CLASSES, PERSONALITIES, QUIRKS, generateRandomStats } from '../data/characters';

interface CharacterCreationProps {
  world: World;
  onCharacterCreated: (character: Character) => void;
}

const CharacterCreation: React.FC<CharacterCreationProps> = ({ world, onCharacterCreated }) => {
  const [characterName, setCharacterName] = useState('');
  const [selectedRace, setSelectedRace] = useState<Race | null>(null);
  const [selectedClass, setSelectedClass] = useState<CharacterClass | null>(null);
  const [selectedPersonality, setSelectedPersonality] = useState<Personality | null>(null);
  const [selectedQuirk, setSelectedQuirk] = useState<Quirk | null>(null);
  const [stats, setStats] = useState<Stats>(() => ({
    strength: 10,
    dexterity: 10,
    constitution: 10,
    intelligence: 10,
    wisdom: 10,
    charisma: 10
  }));
  const [pointsRemaining, setPointsRemaining] = useState(27);

  const handleStatChange = (statName: keyof Stats, value: number) => {
    const currentValue = stats[statName];
    const difference = value - currentValue;
    
    if (pointsRemaining - difference >= 0 && value >= 8 && value <= 15) {
      setStats(prev => ({ ...prev, [statName]: value }));
      setPointsRemaining(prev => prev - difference);
    }
  };

  const handleRandomStats = () => {
    const randomStats = generateRandomStats();
    setStats({
      strength: randomStats.strength,
      dexterity: randomStats.dexterity,
      constitution: randomStats.constitution,
      intelligence: randomStats.intelligence,
      wisdom: randomStats.wisdom,
      charisma: randomStats.charisma
    });
    setPointsRemaining(0);
  };

  const canCreateCharacter = () => {
    return characterName.trim() && 
           selectedRace && 
           selectedClass && 
           selectedPersonality && 
           selectedQuirk &&
           pointsRemaining === 0;
  };

  const handleCreateCharacter = () => {
    if (!canCreateCharacter()) return;

    const character: Character = {
      id: 'player-character',
      name: characterName,
      race: selectedRace!,
      class: selectedClass!,
      level: 1,
      stats,
      personality: selectedPersonality!,
      quirk: selectedQuirk!,
      isPlayer: true
    };

    onCharacterCreated(character);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="parchment-bg rounded-lg p-8 pixel-border">
        <h2 className="text-3xl font-pixel text-center text-amber-900 mb-6">
          ⚔️ Create Your Hero ⚔️
        </h2>
        
        <div className="text-center mb-6">
          <p className="text-lg text-amber-800 font-pixel">
            Adventuring in: <span className="text-red-800 font-bold">{world.name}</span>
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Character Name */}
            <div>
              <label className="block text-lg font-pixel text-amber-900 mb-2">
                📝 Character Name
              </label>
              <input
                type="text"
                value={characterName}
                onChange={(e) => setCharacterName(e.target.value)}
                className="w-full p-3 rounded border-4 border-amber-800 font-pixel text-sm bg-amber-50"
                placeholder="Enter your hero's name..."
              />
            </div>

            {/* Race Selection */}
            <div>
              <label className="block text-lg font-pixel text-amber-900 mb-2">
                👤 Race
              </label>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                {RACES.map((race) => (
                  <button
                    key={race.name}
                    onClick={() => setSelectedRace(race.name)}
                    className={`p-2 rounded border-2 font-pixel text-xs transition-all ${
                      selectedRace === race.name
                        ? 'bg-amber-400 border-amber-800 text-amber-900'
                        : 'bg-amber-100 border-amber-600 text-amber-800 hover:bg-amber-200'
                    }`}
                  >
                    {race.name}
                  </button>
                ))}
              </div>
              {selectedRace && (
                <div className="mt-2 p-2 bg-amber-100 rounded text-xs font-pixel text-amber-800">
                  {RACES.find(r => r.name === selectedRace)?.bonuses}
                </div>
              )}
            </div>

            {/* Class Selection */}
            <div>
              <label className="block text-lg font-pixel text-amber-900 mb-2">
                ⚔️ Class
              </label>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                {CLASSES.map((charClass) => (
                  <button
                    key={charClass.name}
                    onClick={() => setSelectedClass(charClass.name)}
                    className={`p-2 rounded border-2 font-pixel text-xs transition-all ${
                      selectedClass === charClass.name
                        ? 'bg-amber-400 border-amber-800 text-amber-900'
                        : 'bg-amber-100 border-amber-600 text-amber-800 hover:bg-amber-200'
                    }`}
                  >
                    {charClass.name}
                  </button>
                ))}
              </div>
              {selectedClass && (
                <div className="mt-2 p-2 bg-amber-100 rounded text-xs font-pixel text-amber-800">
                  {CLASSES.find(c => c.name === selectedClass)?.abilities}
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Stats */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-lg font-pixel text-amber-900">
                  📊 Ability Scores
                </label>
                <div className="text-sm font-pixel text-red-800">
                  Points: {pointsRemaining}
                </div>
              </div>
              <div className="space-y-2">
                {Object.entries(stats).map(([statName, value]) => (
                  <div key={statName} className="flex items-center justify-between">
                    <span className="font-pixel text-sm text-amber-800 capitalize w-20">
                      {statName.slice(0, 3)}:
                    </span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleStatChange(statName as keyof Stats, value - 1)}
                        disabled={value <= 8 || pointsRemaining <= 0}
                        className="w-6 h-6 pixel-button text-xs"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-pixel text-sm text-amber-900">
                        {value}
                      </span>
                      <button
                        onClick={() => handleStatChange(statName as keyof Stats, value + 1)}
                        disabled={value >= 15 || pointsRemaining <= 0}
                        className="w-6 h-6 pixel-button text-xs"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={handleRandomStats}
                className="w-full mt-2 pixel-button text-xs"
              >
                🎲 Random Stats
              </button>
            </div>

            {/* Personality */}
            <div>
              <label className="block text-lg font-pixel text-amber-900 mb-2">
                🎭 Personality
              </label>
              <div className="grid grid-cols-2 gap-2">
                {PERSONALITIES.map((personality) => (
                  <button
                    key={personality.name}
                    onClick={() => setSelectedPersonality(personality.name)}
                    className={`p-2 rounded border-2 font-pixel text-xs transition-all ${
                      selectedPersonality === personality.name
                        ? 'bg-amber-400 border-amber-800 text-amber-900'
                        : 'bg-amber-100 border-amber-600 text-amber-800 hover:bg-amber-200'
                    }`}
                  >
                    {personality.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Quirks */}
            <div>
              <label className="block text-lg font-pixel text-amber-900 mb-2">
                🎪 Quirk
              </label>
              <select
                value={selectedQuirk || ''}
                onChange={(e) => setSelectedQuirk(e.target.value as Quirk)}
                className="w-full p-2 rounded border-4 border-amber-800 font-pixel text-xs bg-amber-50"
              >
                <option value="">Choose a quirk...</option>
                {QUIRKS.map((quirk) => (
                  <option key={quirk.name} value={quirk.name}>
                    {quirk.name}
                  </option>
                ))}
              </select>
              {selectedQuirk && (
                <div className="mt-2 p-2 bg-amber-100 rounded text-xs font-pixel text-amber-800">
                  {QUIRKS.find(q => q.name === selectedQuirk)?.description}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={handleCreateCharacter}
            disabled={!canCreateCharacter()}
            className={`pixel-button text-lg px-8 py-3 ${
              canCreateCharacter()
                ? 'bg-gradient-to-b from-green-400 to-green-600 border-green-800 text-green-900'
                : 'opacity-50 cursor-not-allowed'
            }`}
          >
            🚀 Begin Adventure!
          </button>
        </div>
      </div>
    </div>
  );
};

export default CharacterCreation;
