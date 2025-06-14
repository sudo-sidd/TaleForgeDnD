import { useState } from 'react';
import type { World, Character, Race, CharacterClass, Personality, Quirk, Stats } from '../types/game';
import { RACES, CLASSES, PERSONALITIES, QUIRKS, generateRandomStats } from '../data/characters';

interface CharacterCreationProps {
  world: World;
  onCharacterCreated: (character: Character) => void;
}

const CharacterCreation: React.FC<CharacterCreationProps> = ({ world, onCharacterCreated }) => {
  const [characterName, setCharacterName] = useState('');
  const [selectedRace, setSelectedRace] = useState<{ name: Race; description: string; bonuses: string } | null>(null);
  const [selectedClass, setSelectedClass] = useState<{ name: CharacterClass; description: string; abilities: string } | null>(null);
  const [selectedPersonality, setSelectedPersonality] = useState<{ name: Personality; description: string } | null>(null);
  const [selectedQuirk, setSelectedQuirk] = useState<{ name: Quirk; description: string } | null>(null);
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
    
    const totalPointsUsed = Object.values(randomStats).reduce((sum, value) => sum + (value - 8), 0);
    setPointsRemaining(27 - totalPointsUsed);
  };

  const handleResetStats = () => {
    setStats({
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10
    });
    setPointsRemaining(27);
  };

  const handleBeginAdventure = () => {
    if (characterName && selectedRace && selectedClass && selectedPersonality && selectedQuirk) {
      const character: Character = {
        id: `char-${Date.now()}`,
        name: characterName,
        race: selectedRace.name,
        class: selectedClass.name,
        stats: stats,
        personality: selectedPersonality.name,
        quirk: selectedQuirk.name,
        level: 1,
        isPlayer: true
      };
      onCharacterCreated(character);
    }
  };

  const isComplete = characterName && selectedRace && selectedClass && selectedPersonality && selectedQuirk;

  return (
    <div className="parchment-bg pixel-border pixel-shadow p-8 relative">
      {/* Page Header */}
      <div className="text-center mb-8">
        <div className="text-4xl mb-4">⚔️</div>
        <h2 className="font-pixel text-2xl text-amber-900 title-glow mb-2">
          ~ Create Your Hero ~
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-amber-700 to-transparent mx-auto mb-4"></div>
        <p className="font-pixel text-xs text-amber-700 italic">
          Adventuring in: {world.name}
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column - Basic Info */}
        <div className="space-y-6">
          {/* Character Name */}
          <div className="border-l-4 border-amber-600 pl-4">
            <h3 className="font-pixel text-base text-amber-900 mb-3 flex items-center">
              <span className="text-lg mr-2">📝</span> Character Name
            </h3>
            <input
              type="text"
              value={characterName}
              onChange={(e) => setCharacterName(e.target.value)}
              placeholder="Enter your hero's name..."
              className="w-full p-3 border-2 border-amber-600 rounded bg-amber-50 font-pixel text-sm text-amber-900 placeholder-amber-600 focus:outline-none focus:border-amber-800"
            />
          </div>

          {/* Race Selection */}
          <div className="border-l-4 border-amber-600 pl-4">
            <h3 className="font-pixel text-base text-amber-900 mb-3 flex items-center">
              <span className="text-lg mr-2">👤</span> Race
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {RACES.map((race, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedRace(race)}
                  className={`p-2 border-2 rounded font-pixel text-xs transition-all duration-200 ${
                    selectedRace?.name === race.name
                      ? 'bg-amber-300 border-amber-700 text-amber-900'
                      : 'bg-amber-100 border-amber-500 text-amber-800 hover:bg-amber-200'
                  }`}
                >
                  {race.name}
                </button>
              ))}
            </div>
            {selectedRace && (
              <div className="mt-2 p-3 bg-amber-50 border border-amber-300 rounded">
                <p className="font-pixel text-xs text-amber-800 leading-relaxed">
                  {selectedRace.description}
                </p>
              </div>
            )}
          </div>

          {/* Class Selection */}
          <div className="border-l-4 border-amber-600 pl-4">
            <h3 className="font-pixel text-base text-amber-900 mb-3 flex items-center">
              <span className="text-lg mr-2">⚔️</span> Class
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {CLASSES.map((cls, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedClass(cls)}
                  className={`p-2 border-2 rounded font-pixel text-xs transition-all duration-200 ${
                    selectedClass?.name === cls.name
                      ? 'bg-amber-300 border-amber-700 text-amber-900'
                      : 'bg-amber-100 border-amber-500 text-amber-800 hover:bg-amber-200'
                  }`}
                >
                  {cls.name}
                </button>
              ))}
            </div>
            {selectedClass && (
              <div className="mt-2 p-3 bg-amber-50 border border-amber-300 rounded">
                <p className="font-pixel text-xs text-amber-800 leading-relaxed">
                  {selectedClass.description}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Ability Scores */}
        <div className="space-y-6">
          {/* Ability Scores */}
          <div className="border-l-4 border-blue-600 pl-4">
            <h3 className="font-pixel text-base text-blue-900 mb-3 flex items-center">
              <span className="text-lg mr-2">🎲</span> Ability Scores
            </h3>
            <div className="mb-4 p-3 bg-blue-50 border border-blue-300 rounded">
              <p className="font-pixel text-xs text-blue-800 mb-2">
                Points: {pointsRemaining}
              </p>
              <div className="flex gap-2">
                <button onClick={handleRandomStats} className="pixel-button bg-gradient-to-b from-blue-400 to-blue-600 text-blue-900 text-xs">
                  🎲 Random Stats
                </button>
                <button onClick={handleResetStats} className="pixel-button bg-gradient-to-b from-gray-400 to-gray-600 text-gray-900 text-xs">
                  🔄 Reset
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(stats).map(([statName, value]) => (
                <div key={statName} className="bg-blue-50 border border-blue-300 rounded p-3">
                  <label className="font-pixel text-xs text-blue-900 block mb-2 capitalize">
                    {statName.substring(0, 3).toUpperCase()}:
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleStatChange(statName as keyof Stats, value - 1)}
                      disabled={value <= 8 || pointsRemaining <= 0}
                      className="w-6 h-6 bg-blue-600 text-white font-pixel text-xs rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      -
                    </button>
                    <span className="font-pixel text-sm text-blue-900 w-8 text-center">
                      {value}(+{Math.floor((value - 10) / 2)})
                    </span>
                    <button
                      onClick={() => handleStatChange(statName as keyof Stats, value + 1)}
                      disabled={value >= 15 || pointsRemaining <= 0}
                      className="w-6 h-6 bg-blue-600 text-white font-pixel text-xs rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Personality & Quirk */}
      <div className="grid lg:grid-cols-2 gap-8 mt-8">
        {/* Personality */}
        <div className="border-l-4 border-green-600 pl-4">
          <h3 className="font-pixel text-base text-green-900 mb-3 flex items-center">
            <span className="text-lg mr-2">😊</span> Personality
          </h3>
          <div className="grid grid-cols-1 gap-2">
            {PERSONALITIES.map((personality, index) => (
              <button
                key={index}
                onClick={() => setSelectedPersonality(personality)}
                className={`p-2 border-2 rounded font-pixel text-xs transition-all duration-200 text-left ${
                  selectedPersonality?.name === personality.name
                    ? 'bg-green-300 border-green-700 text-green-900'
                    : 'bg-green-100 border-green-500 text-green-800 hover:bg-green-200'
                }`}
              >
                <div className="font-bold">{personality.name}</div>
                <div className="text-xs opacity-80">{personality.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Quirk */}
        <div className="border-l-4 border-purple-600 pl-4">
          <h3 className="font-pixel text-base text-purple-900 mb-3 flex items-center">
            <span className="text-lg mr-2">🎭</span> Quirk
          </h3>
          <div className="grid grid-cols-1 gap-2">
            {QUIRKS.map((quirk, index) => (
              <button
                key={index}
                onClick={() => setSelectedQuirk(quirk)}
                className={`p-2 border-2 rounded font-pixel text-xs transition-all duration-200 text-left ${
                  selectedQuirk?.name === quirk.name
                    ? 'bg-purple-300 border-purple-700 text-purple-900'
                    : 'bg-purple-100 border-purple-500 text-purple-800 hover:bg-purple-200'
                }`}
              >
                <div className="font-bold">{quirk.name}</div>
                <div className="text-xs opacity-80">{quirk.description}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Begin Adventure Button */}
      <div className="text-center mt-10">
        <button
          onClick={handleBeginAdventure}
          disabled={!isComplete}
          className={`pixel-button text-base px-8 py-4 ${
            isComplete
              ? 'bg-gradient-to-b from-emerald-400 to-emerald-600 text-emerald-900'
              : 'bg-gradient-to-b from-gray-400 to-gray-600 text-gray-600'
          }`}
        >
          {isComplete ? '🚀 Begin Adventure! →' : '❌ Complete All Fields'}
        </button>
      </div>
    </div>
  );
};

export default CharacterCreation;
