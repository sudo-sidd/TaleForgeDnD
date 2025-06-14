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

  console.log('App rendering, gamePhase:', gameState.gamePhase);

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
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #fffbeb, #fef3c7)',
      fontFamily: '"Press Start 2P", cursive'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '32px 16px'
      }}>
        <header style={{
          textAlign: 'center',
          marginBottom: '32px'
        }}>
          <h1 style={{
            fontSize: '32px',
            color: '#78350f',
            marginBottom: '16px',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}>
            ⚔️ AI D&D ADVENTURE ⚔️
          </h1>
          <p style={{
            fontSize: '18px',
            color: '#92400e',
            fontFamily: '"Press Start 2P", cursive'
          }}>
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
