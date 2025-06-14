import { useState } from 'react'
import type { GameState, World, Character } from './types/game'
import WorldSelection from './components/WorldSelection'
import CharacterCreation from './components/CharacterCreation'
import PartyGeneration from './components/PartyGeneration'
import GameScreen from './components/GameScreen'

function App() {
  const [gameState, setGameState] = useState<GameState>({
    gamePhase: 'world-selection',
    narrative: [],
    availableActions: []
  });

  const handleWorldSelected = (world: World) => {
    setGameState(prev => ({
      ...prev,
      currentWorld: world,
      gamePhase: 'character-creation'
    }));
  };

  const handleCharacterCreated = (character: Character) => {
    setGameState(prev => ({
      ...prev,
      playerCharacter: character,
      gamePhase: 'party-generation'
    }));
  };

  const handlePartyGenerated = (party: Character[]) => {
    setGameState(prev => ({
      ...prev,
      currentParty: {
        id: `party-${Date.now()}`,
        members: party
      },
      gamePhase: 'gameplay'
    }));
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-10 left-10 text-6xl text-amber-700 opacity-20 animate-pulse">⚔️</div>
        <div className="absolute top-20 right-20 text-6xl text-amber-700 opacity-20 animate-pulse" style={{animationDelay: '1s'}}>🛡️</div>
        <div className="absolute bottom-20 left-20 text-6xl text-amber-700 opacity-20 animate-pulse" style={{animationDelay: '2s'}}>🏹</div>
        <div className="absolute bottom-10 right-10 text-6xl text-amber-700 opacity-20 animate-pulse" style={{animationDelay: '3s'}}>💰</div>
      </div>

      {/* Main Quest Book Container */}
      <div className="quest-book-page pixel-shadow max-w-7xl mx-auto my-8 relative z-10">
        
        {/* Book Spine/Binding */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-b from-amber-900 via-amber-800 to-amber-900 pixel-border-left flex flex-col items-center justify-center space-y-8">
          <div className="text-amber-200 text-xl transform -rotate-90 font-pixel">LOGBOOK</div>
          <div className="w-8 h-1 bg-amber-600 rounded-full"></div>
          <div className="w-6 h-1 bg-amber-600 rounded-full"></div>
          <div className="w-8 h-1 bg-amber-600 rounded-full"></div>
        </div>
        
        {/* Page Content */}
        <div className="ml-20 p-8">
          
          {/* Ornate Header */}
          <header className="text-center mb-12 relative">
            {/* Top Border Decoration */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-600 to-transparent"></div>
            
            {/* Background Castle */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
              <div className="text-8xl opacity-10 filter blur-sm">🏰</div>
            </div>
            
            <div className="relative z-10 pt-4">
              {/* Title with Decorative Elements */}
              <div className="flex items-center justify-center mb-6">
                <div className="text-4xl mr-4">⚔️</div>
                <h1 className="font-pixel text-5xl text-amber-900 title-glow tracking-wider">
                  ADVENTURER'S LOGBOOK
                </h1>
                <div className="text-4xl ml-4">⚔️</div>
              </div>
              
              {/* Subtitle */}
              <div className="w-64 h-2 bg-gradient-to-r from-transparent via-amber-700 to-transparent mx-auto mb-4 rounded-full"></div>
              <p className="font-pixel text-lg text-amber-800 tracking-wider mb-6">
                ~ Where Magic Meets Destiny ~
              </p>
              
              {/* Phase Indicator with Enhanced Design */}
              <div className="inline-block relative">
                <div className="px-8 py-3 bg-gradient-to-r from-amber-100 via-yellow-100 to-amber-100 border-4 border-amber-600 pixel-shadow relative overflow-hidden">
                  <div className="absolute inset-0 bg-amber-50 opacity-50"></div>
                  <span className="font-pixel text-sm text-amber-900 relative z-10 tracking-wide">
                    {gameState.gamePhase === 'world-selection' && '�️ Choosing Realm'}
                    {gameState.gamePhase === 'character-creation' && '👤 Creating Hero'}
                    {gameState.gamePhase === 'party-generation' && '👥 Gathering Party'}
                    {gameState.gamePhase === 'gameplay' && '⚔️ Adventure Begins'}
                  </span>
                </div>
                <div className="absolute -top-2 -left-2 w-4 h-4 bg-amber-600 transform rotate-45"></div>
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-amber-600 transform rotate-45"></div>
              </div>
            </div>
            
            {/* Bottom Border Decoration */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-600 to-transparent mt-6"></div>
          </header>

          {/* Content Area with Enhanced Structure */}
          <div className="relative min-h-96">
            {/* Corner Decorations */}
            <div className="absolute top-0 left-0 text-3xl text-amber-700 opacity-40">📜</div>
            <div className="absolute top-0 right-0 text-3xl text-amber-700 opacity-40">🗡️</div>
            <div className="absolute bottom-0 left-0 text-3xl text-amber-700 opacity-40">🛡️</div>
            <div className="absolute bottom-0 right-0 text-3xl text-amber-700 opacity-40">💰</div>
            
            {/* Main Content */}
            <div className="px-8 py-6">
              {gameState.gamePhase === 'world-selection' && (
                <WorldSelection onWorldSelected={handleWorldSelected} />
              )}

              {gameState.gamePhase === 'character-creation' && gameState.currentWorld && (
                <CharacterCreation 
                  world={gameState.currentWorld}
                  onCharacterCreated={handleCharacterCreated}
                />
              )}

              {gameState.gamePhase === 'party-generation' && gameState.currentWorld && gameState.playerCharacter && (
                <PartyGeneration
                  playerCharacter={gameState.playerCharacter}
                  world={gameState.currentWorld}
                  onPartyGenerated={handlePartyGenerated}
                />
              )}

              {gameState.gamePhase === 'gameplay' && (
                <GameScreen gameState={gameState} setGameState={setGameState} />
              )}
            </div>
          </div>
          
          {/* Page Footer */}
          <footer className="text-center mt-8 pt-6 border-t-2 border-amber-600 border-opacity-30">
            <div className="flex items-center justify-center space-x-6 mb-4">
              <div className="text-2xl opacity-40">📚</div>
              <span className="font-pixel text-sm text-amber-600 opacity-70">
                Page {gameState.gamePhase === 'world-selection' ? '1' : 
                      gameState.gamePhase === 'character-creation' ? '2' : 
                      gameState.gamePhase === 'party-generation' ? '3' : '4'} of Many Adventures...
              </span>
              <div className="text-2xl opacity-40">📚</div>
            </div>
            
            {/* Decorative Bottom Elements */}
            <div className="flex items-center justify-center space-x-4 opacity-30">
              <div className="w-8 h-1 bg-amber-600 rounded-full"></div>
              <div className="text-amber-700">✦</div>
              <div className="w-12 h-1 bg-amber-600 rounded-full"></div>
              <div className="text-amber-700">✧</div>
              <div className="w-8 h-1 bg-amber-600 rounded-full"></div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}

export default App
