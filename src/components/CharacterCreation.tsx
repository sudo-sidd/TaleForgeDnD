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
    
    // Calculate points remaining based on the new stats
    const totalPointsUsed = Object.values({
      strength: randomStats.strength,
      dexterity: randomStats.dexterity,
      constitution: randomStats.constitution,
      intelligence: randomStats.intelligence,
      wisdom: randomStats.wisdom,
      charisma: randomStats.charisma
    }).reduce((sum, stat) => sum + (stat - 8), 0);
    
    setPointsRemaining(27 - totalPointsUsed);
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
              <div className="flex justify-between items-center mb-3">
                <label className="text-lg font-pixel text-amber-900">
                  📊 Ability Scores
                </label>
                <div className={`text-sm font-pixel px-3 py-1 rounded border-2 ${
                  pointsRemaining === 0 
                    ? 'text-green-800 bg-green-100 border-green-400' 
                    : pointsRemaining > 0 
                      ? 'text-blue-800 bg-blue-100 border-blue-400'
                      : 'text-red-800 bg-red-100 border-red-400'
                }`}>
                  Points: {pointsRemaining}
                </div>
              </div>
              <div className="space-y-3">
                {Object.entries(stats).map(([statName, value]) => {
                  const modifier = Math.floor((value - 10) / 2);
                  const modifierString = modifier >= 0 ? `+${modifier}` : `${modifier}`;
                  
                  return (
                    <div key={statName} className="flex items-center justify-between bg-amber-50 p-2 rounded border-2 border-amber-200">
                      <span className="font-pixel text-sm text-amber-800 capitalize w-16 text-left">
                        {statName.slice(0, 3)}:
                      </span>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleStatChange(statName as keyof Stats, value - 1)}
                          disabled={value <= 8}
                          className="w-8 h-8 pixel-button text-xs flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          -
                        </button>
                        <div className="text-center">
                          <span className="w-10 text-center font-pixel text-sm text-amber-900 bg-amber-100 py-1 px-2 rounded border border-amber-300 block">
                            {value}
                          </span>
                          <span className="text-xs font-pixel text-amber-700 mt-1 block">
                            ({modifierString})
                          </span>
                        </div>
                        <button
                          onClick={() => handleStatChange(statName as keyof Stats, value + 1)}
                          disabled={value >= 15 || pointsRemaining <= 0}
                          className="w-8 h-8 pixel-button text-xs flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleRandomStats}
                  className="flex-1 pixel-button text-xs bg-gradient-to-b from-blue-400 to-blue-600 border-blue-800 text-blue-900"
                >
                  🎲 Random Stats
                </button>
                <button
                  onClick={() => {
                    setStats({
                      strength: 8,
                      dexterity: 8,
                      constitution: 8,
                      intelligence: 8,
                      wisdom: 8,
                      charisma: 8
                    });
                    setPointsRemaining(27);
                  }}
                  className="flex-1 pixel-button text-xs bg-gradient-to-b from-gray-400 to-gray-600 border-gray-800 text-gray-900"
                >
                  🔄 Reset
                </button>
              </div>
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
