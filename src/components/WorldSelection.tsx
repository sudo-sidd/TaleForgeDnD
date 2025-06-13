import { useState, useEffect } from 'react';
import type { World } from '../types/game';
import { getRandomWorlds } from '../data/worlds';

interface WorldSelectionProps {
  onWorldSelected: (world: World) => void;
}

const WorldSelection: React.FC<WorldSelectionProps> = ({ onWorldSelected }) => {
  const [availableWorlds, setAvailableWorlds] = useState<World[]>([]);
  const [selectedWorld, setSelectedWorld] = useState<World | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    setAvailableWorlds(getRandomWorlds(3));
  }, []);

  const handleWorldClick = (world: World) => {
    setSelectedWorld(world);
    setShowDetails(true);
  };

  const handleConfirmSelection = () => {
    if (selectedWorld) {
      onWorldSelected(selectedWorld);
    }
  };

  const handleBackToSelection = () => {
    setSelectedWorld(null);
    setShowDetails(false);
  };

  const getThemeColors = (theme: string) => {
    const themes: Record<string, string> = {
      'tropical-magical': 'from-cyan-400 to-blue-600',
      'volcanic-apocalyptic': 'from-red-600 to-orange-800',
      'mystical-forest': 'from-green-400 to-emerald-600',
      'arctic-mystical': 'from-blue-300 to-indigo-600',
      'celestial-desert': 'from-yellow-400 to-orange-500',
      'underground-dark': 'from-purple-800 to-gray-900',
      'sky-floating': 'from-sky-300 to-blue-500',
      'haunted-swamp': 'from-green-800 to-gray-700',
      'mountainous-warfare': 'from-stone-600 to-red-800',
      'twilight-mystical': 'from-purple-400 to-pink-600'
    };
    return themes[theme] || 'from-amber-400 to-amber-600';
  };

  if (showDetails && selectedWorld) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="parchment-bg rounded-lg p-8 pixel-border">
          <h2 className="text-3xl font-pixel text-center text-amber-900 mb-6">
            {selectedWorld.name}
          </h2>
          
          <div className={`w-full h-64 bg-gradient-to-br ${getThemeColors(selectedWorld.theme)} rounded-lg mb-6 flex items-center justify-center`}>
            <div className="text-6xl">🌍</div>
          </div>

          <div className="space-y-4 text-amber-800 font-pixel text-sm leading-relaxed">
            <div>
              <h3 className="text-lg text-amber-900 mb-2">📖 Description</h3>
              <p>{selectedWorld.description}</p>
            </div>
            
            <div>
              <h3 className="text-lg text-amber-900 mb-2">👥 Inhabitants</h3>
              <p>{selectedWorld.inhabitants}</p>
            </div>
            
            <div>
              <h3 className="text-lg text-amber-900 mb-2">🏛️ Backstory</h3>
              <p>{selectedWorld.backstory}</p>
            </div>
            
            <div>
              <h3 className="text-lg text-amber-900 mb-2">⚡ Adventure Hook</h3>
              <p className="text-red-800 font-bold">{selectedWorld.plotHook}</p>
            </div>
          </div>

          <div className="flex gap-4 mt-8 justify-center">
            <button
              onClick={handleBackToSelection}
              className="pixel-button"
            >
              ← Back to Worlds
            </button>
            <button
              onClick={handleConfirmSelection}
              className="pixel-button bg-gradient-to-b from-green-400 to-green-600 border-green-800 text-green-900"
            >
              Choose This World! →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-pixel text-amber-900 mb-4">
          🌟 Choose Your Adventure World 🌟
        </h2>
        <p className="text-lg text-amber-800 font-pixel">
          Select from three mystical realms...
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {availableWorlds.map((world) => (
          <div
            key={world.id}
            className="parchment-bg rounded-lg p-6 pixel-border cursor-pointer hover:transform hover:scale-105 transition-all duration-200"
            onClick={() => handleWorldClick(world)}
          >
            <div className={`w-full h-48 bg-gradient-to-br ${getThemeColors(world.theme)} rounded-lg mb-4 flex items-center justify-center`}>
              <div className="text-4xl">🌍</div>
            </div>
            
            <h3 className="text-xl font-pixel text-amber-900 text-center mb-3">
              {world.name}
            </h3>
            
            <p className="text-sm text-amber-800 font-pixel leading-relaxed text-center">
              {world.description}
            </p>
            
            <div className="mt-4 text-center">
              <button className="pixel-button">
                Explore This World
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorldSelection;
