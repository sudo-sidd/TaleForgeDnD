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
    const worlds = getRandomWorlds(3);
    setAvailableWorlds(worlds);
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
    switch (theme) {
      case 'fire':
        return 'from-red-600 via-orange-500 to-yellow-400';
      case 'water':
        return 'from-blue-600 via-cyan-500 to-teal-400';
      case 'earth':
        return 'from-green-600 via-emerald-500 to-lime-400';
      case 'air':
        return 'from-sky-600 via-indigo-500 to-purple-400';
      case 'shadow':
        return 'from-gray-700 via-slate-600 to-zinc-500';
      default:
        return 'from-amber-600 via-yellow-500 to-orange-400';
    }
  };

  if (showDetails && selectedWorld) {
    return (
      <div className="max-w-5xl mx-auto">
        {/* Detailed World View */}
        <div className="parchment-bg pixel-border pixel-shadow p-8 relative overflow-hidden">
          {/* Header Decoration */}
          <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600"></div>
          
          {/* Page Header */}
          <div className="text-center mb-8 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="text-8xl opacity-20 filter blur-sm">🏰</div>
            </div>
            
            <div className="relative z-10">
              <div className="text-5xl mb-4 filter drop-shadow-lg">🌍</div>
              <h2 className="font-pixel text-4xl text-amber-900 title-glow mb-4 tracking-wider">
                {selectedWorld.name}
              </h2>
              <div className="w-32 h-2 bg-gradient-to-r from-transparent via-amber-700 to-transparent mx-auto mb-4 rounded-full"></div>
              <p className="font-pixel text-sm text-amber-700 italic tracking-wide">
                ~ Chronicle of the {selectedWorld.theme?.charAt(0).toUpperCase() + selectedWorld.theme?.slice(1) || 'Mystical'} Realm ~
              </p>
            </div>
          </div>

          {/* World Banner Image */}
          <div className={`w-full h-64 bg-gradient-to-br ${getThemeColors(selectedWorld.theme)} rounded-xl mb-8 flex items-center justify-center pixel-shadow relative overflow-hidden border-4 border-amber-700`}>
            <div className="absolute inset-0 bg-black opacity-20"></div>
            
            {/* Animated Elements */}
            <div className="absolute inset-0">
              <div className="absolute top-4 left-4 text-yellow-300 opacity-40 animate-pulse">✦</div>
              <div className="absolute top-4 right-4 text-yellow-300 opacity-40 animate-pulse" style={{animationDelay: '0.5s'}}>✧</div>
              <div className="absolute bottom-4 left-4 text-yellow-300 opacity-40 animate-pulse" style={{animationDelay: '1s'}}>✦</div>
              <div className="absolute bottom-4 right-4 text-yellow-300 opacity-40 animate-pulse" style={{animationDelay: '1.5s'}}>✧</div>
            </div>
            
            <div className="text-9xl relative z-10 drop-shadow-2xl filter">🏰</div>
            
            {/* Realm Type Badge */}
            <div className="absolute bottom-4 right-4 font-pixel text-sm text-white bg-black bg-opacity-70 px-4 py-2 rounded-full border-2 border-white border-opacity-50 backdrop-blur-sm">
              {selectedWorld.theme?.toUpperCase() || 'MYSTICAL'} REALM
            </div>
          </div>

          {/* World Details in Organized Sections */}
          <div className="grid lg:grid-cols-2 gap-8 mb-10">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Chronicle Section */}
              <div className="bg-amber-50 border-l-6 border-amber-600 p-6 rounded-r-lg pixel-shadow">
                <h3 className="font-pixel text-lg text-amber-900 mb-4 flex items-center">
                  <span className="text-2xl mr-3">📖</span> Chronicle
                </h3>
                <p className="font-pixel text-sm text-amber-800 leading-loose">
                  {selectedWorld.description}
                </p>
              </div>
              
              {/* Inhabitants Section */}
              <div className="bg-green-50 border-l-6 border-green-600 p-6 rounded-r-lg pixel-shadow">
                <h3 className="font-pixel text-lg text-green-900 mb-4 flex items-center">
                  <span className="text-2xl mr-3">👥</span> Inhabitants
                </h3>
                <p className="font-pixel text-sm text-green-800 leading-loose">
                  {selectedWorld.inhabitants}
                </p>
              </div>
            </div>
            
            {/* Right Column */}
            <div className="space-y-6">
              {/* Ancient History Section */}
              <div className="bg-blue-50 border-l-6 border-blue-600 p-6 rounded-r-lg pixel-shadow">
                <h3 className="font-pixel text-lg text-blue-900 mb-4 flex items-center">
                  <span className="text-2xl mr-3">🏛️</span> Ancient History
                </h3>
                <p className="font-pixel text-sm text-blue-800 leading-loose">
                  {selectedWorld.backstory}
                </p>
              </div>
              
              {/* Call to Adventure Section */}
              <div className="bg-red-50 border-l-6 border-red-600 p-6 rounded-r-lg pixel-shadow relative overflow-hidden">
                <div className="absolute top-0 right-0 text-6xl opacity-10">⚡</div>
                <h3 className="font-pixel text-lg text-red-900 mb-4 flex items-center relative z-10">
                  <span className="text-2xl mr-3">⚡</span> Call to Adventure
                </h3>
                <p className="font-pixel text-sm text-red-800 font-bold leading-loose relative z-10">
                  {selectedWorld.plotHook}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button 
              onClick={handleBackToSelection} 
              className="pixel-button bg-gradient-to-b from-gray-400 to-gray-600 text-gray-900 px-8 py-4 text-base"
            >
              ← Return to Index
            </button>
            <button 
              onClick={handleConfirmSelection} 
              className="pixel-button bg-gradient-to-b from-emerald-400 to-emerald-600 text-emerald-900 px-12 py-4 text-lg font-bold"
            >
              ⚔️ Begin Adventure! →
            </button>
          </div>
          
          {/* Decorative Footer */}
          <div className="mt-8 text-center">
            <div className="flex items-center justify-center space-x-6 opacity-30">
              <div className="text-2xl">🗡️</div>
              <div className="font-pixel text-xs text-amber-700">~ Destiny Awaits ~</div>
              <div className="text-2xl">🛡️</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Section Header with Ornate Design */}
      <div className="text-center relative">
        {/* Top Decoration */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex-1 h-1 bg-gradient-to-r from-transparent via-amber-600 to-amber-600 max-w-20"></div>
          <div className="px-4">
            <div className="text-6xl mb-2 filter drop-shadow-lg">🗺️</div>
          </div>
          <div className="flex-1 h-1 bg-gradient-to-l from-transparent via-amber-600 to-amber-600 max-w-20"></div>
        </div>
        
        <h2 className="font-pixel text-3xl text-amber-900 title-glow mb-4 tracking-wider">
          ~ REALM INDEX ~
        </h2>
        
        <div className="w-48 h-2 bg-gradient-to-r from-transparent via-amber-600 to-transparent mx-auto mb-4 rounded-full"></div>
        
        <p className="font-pixel text-base text-amber-800 leading-relaxed max-w-md mx-auto">
          Choose thy destination wisely, brave adventurer. Each realm holds untold mysteries and ancient secrets...
        </p>
        
        {/* Bottom Decoration */}
        <div className="flex items-center justify-center mt-6">
          <div className="text-2xl opacity-60 mx-2">⚔️</div>
          <div className="text-2xl opacity-60 mx-2">🛡️</div>
          <div className="text-2xl opacity-60 mx-2">🏹</div>
        </div>
      </div>

      {availableWorlds.length === 0 ? (
        <div className="text-center py-20">
          <div className="parchment-bg pixel-border pixel-shadow p-12 max-w-md mx-auto">
            <div className="text-6xl mb-6 animate-pulse">⏳</div>
            <p className="font-pixel text-base text-amber-700">
              Consulting the ancient maps...
            </p>
            <div className="mt-4 flex justify-center space-x-2">
              <div className="w-2 h-2 bg-amber-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-amber-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-amber-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {availableWorlds.map((world, index) => (
            <div
              key={world.id}
              className="group cursor-pointer transform transition-all duration-500 hover:scale-105 hover:-rotate-1"
              onClick={() => handleWorldClick(world)}
            >
              {/* Realm Card */}
              <div className="parchment-bg pixel-border pixel-shadow p-6 relative overflow-hidden h-full">
                {/* Card Header */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600"></div>
                
                {/* Card Number Badge */}
                <div className="absolute -top-2 -left-2 w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-700 text-white font-pixel text-sm flex items-center justify-center rounded-full border-4 border-amber-800 shadow-lg z-10">
                  {index + 1}
                </div>

                {/* Realm Preview Image */}
                <div className={`w-full h-40 bg-gradient-to-br ${getThemeColors(world.theme)} rounded-lg mb-6 flex items-center justify-center pixel-shadow relative overflow-hidden group-hover:brightness-110 transition-all duration-500 border-2 border-amber-700`}>
                  <div className="absolute inset-0 bg-black opacity-20 group-hover:opacity-10 transition-opacity duration-500"></div>
                  <div className="text-6xl relative z-10 group-hover:scale-125 transition-transform duration-500 filter drop-shadow-lg">🏰</div>
                  
                  {/* Theme Badge */}
                  <div className="absolute bottom-2 right-2 font-pixel text-xs text-white bg-black bg-opacity-70 px-3 py-1 rounded-full border border-white border-opacity-30">
                    {world.theme?.toUpperCase() || 'MYSTICAL'}
                  </div>
                  
                  {/* Decorative Corner Elements */}
                  <div className="absolute top-1 left-1 text-yellow-300 opacity-60">✦</div>
                  <div className="absolute top-1 right-1 text-yellow-300 opacity-60">✧</div>
                  <div className="absolute bottom-1 left-1 text-yellow-300 opacity-60">✦</div>
                  <div className="absolute bottom-1 right-1 text-yellow-300 opacity-60">✧</div>
                </div>
                
                {/* Realm Title */}
                <div className="text-center mb-4">
                  <h3 className="font-pixel text-xl text-amber-900 group-hover:text-amber-700 transition-colors duration-300 mb-2 tracking-wide">
                    {world.name}
                  </h3>
                  <div className="w-16 h-1 bg-gradient-to-r from-transparent via-amber-600 to-transparent mx-auto"></div>
                </div>
                
                {/* Realm Description Preview */}
                <div className="mb-6">
                  <p className="font-pixel text-xs text-amber-800 leading-relaxed text-center line-clamp-3">
                    {world.description.substring(0, 120)}...
                  </p>
                </div>
                
                {/* Action Button */}
                <div className="text-center">
                  <div className="inline-block px-6 py-3 bg-gradient-to-r from-amber-200 via-yellow-200 to-amber-200 border-2 border-amber-600 font-pixel text-sm text-amber-900 rounded-lg group-hover:from-amber-300 group-hover:via-yellow-300 group-hover:to-amber-300 group-hover:border-amber-700 transition-all duration-300 shadow-md hover:shadow-lg">
                    📜 Explore Realm →
                  </div>
                </div>

                {/* Decorative Bottom Elements */}
                <div className="absolute bottom-2 left-2 text-lg opacity-20 group-hover:opacity-40 transition-opacity duration-300">
                  ⚔️
                </div>
                <div className="absolute bottom-2 right-2 text-lg opacity-20 group-hover:opacity-40 transition-opacity duration-300">
                  🗡️
                </div>
                
                {/* Subtle Pattern Overlay */}
                <div className="absolute inset-0 opacity-5 pointer-events-none bg-repeat" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width="20" height="20" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23654321" fill-opacity="0.4" fill-rule="evenodd"%3E%3Ccircle cx="3" cy="3" r="3"/%3E%3Ccircle cx="13" cy="13" r="3"/%3E%3C/g%3E%3C/svg%3E")'}}></div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Footer Decoration */}
      <div className="text-center mt-12">
        <div className="flex items-center justify-center space-x-4 opacity-40">
          <div className="text-2xl">📚</div>
          <div className="font-pixel text-xs text-amber-700">~ End of Index ~</div>
          <div className="text-2xl">📚</div>
        </div>
      </div>
    </div>
  );
};

export default WorldSelection;
