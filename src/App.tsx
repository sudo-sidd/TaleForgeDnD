import { useState } from 'react'
import type { GameState, World, Character } from './types/game'
import WorldSelection from './components/WorldSelection'
import CharacterCreation from './components/CharacterCreation'
import PartyGeneration from './components/PartyGeneration'
import GameScreen from './components/GameScreen'
import './App.css'

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
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 parchment-bg">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-pixel text-amber-900 mb-4 drop-shadow-lg">
            ⚔️ AI D&D ADVENTURE ⚔️
          </h1>
          <p className="text-lg text-amber-800 font-pixel">
            Where Magic Meets Technology
          </p>
        </header>

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
  )
}

export default App
