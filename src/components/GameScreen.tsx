import React from 'react';
import type { GameState } from '../types/game';

interface GameScreenProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

const GameScreen: React.FC<GameScreenProps> = ({ gameState }) => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="parchment-bg rounded-lg p-8 pixel-border">
        <h2 className="text-3xl font-pixel text-center text-amber-900 mb-6">
          🎲 Adventure Begins! 🎲
        </h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* Story Panel */}
          <div className="md:col-span-2">
            <div className="bg-amber-100 rounded-lg p-6 pixel-border h-96 overflow-y-auto">
              <h3 className="text-xl font-pixel text-amber-900 mb-4">📖 Story</h3>
              <div className="space-y-4 font-pixel text-sm text-amber-800 leading-relaxed">
                <p>
                  Welcome to <strong>{gameState.currentWorld?.name}</strong>!
                </p>
                <p>
                  {gameState.currentWorld?.description}
                </p>
                <p className="text-red-800 font-bold">
                  🎯 Quest: {gameState.currentWorld?.plotHook}
                </p>
                <p>
                  Your character <strong>{gameState.playerCharacter?.name}</strong> the {gameState.playerCharacter?.race} {gameState.playerCharacter?.class} stands ready for adventure!
                </p>
              </div>
            </div>
          </div>

          {/* Character Panel */}
          <div>
            <div className="bg-amber-100 rounded-lg p-4 pixel-border">
              <h3 className="text-lg font-pixel text-amber-900 mb-4">👤 Character</h3>
              {gameState.playerCharacter && (
                <div className="space-y-2 font-pixel text-xs text-amber-800">
                  <div><strong>Name:</strong> {gameState.playerCharacter.name}</div>
                  <div><strong>Race:</strong> {gameState.playerCharacter.race}</div>
                  <div><strong>Class:</strong> {gameState.playerCharacter.class}</div>
                  <div><strong>Level:</strong> {gameState.playerCharacter.level}</div>
                  <div><strong>Personality:</strong> {gameState.playerCharacter.personality}</div>
                  <div><strong>Quirk:</strong> {gameState.playerCharacter.quirk}</div>
                  
                  <div className="mt-4">
                    <strong>Stats:</strong>
                    <div className="grid grid-cols-2 gap-1 mt-2">
                      <div>STR: {gameState.playerCharacter.stats.strength}</div>
                      <div>DEX: {gameState.playerCharacter.stats.dexterity}</div>
                      <div>CON: {gameState.playerCharacter.stats.constitution}</div>
                      <div>INT: {gameState.playerCharacter.stats.intelligence}</div>
                      <div>WIS: {gameState.playerCharacter.stats.wisdom}</div>
                      <div>CHA: {gameState.playerCharacter.stats.charisma}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Panel */}
        <div className="mt-6">
          <div className="bg-amber-100 rounded-lg p-6 pixel-border">
            <h3 className="text-xl font-pixel text-amber-900 mb-4">⚡ Actions</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <textarea
                  placeholder="What do you say or do?"
                  className="w-full h-24 p-3 rounded border-4 border-amber-800 font-pixel text-sm bg-amber-50 resize-none"
                />
                <button className="pixel-button mt-2 w-full">
                  🗣️ Take Action
                </button>
              </div>
              <div>
                <h4 className="font-pixel text-sm text-amber-900 mb-2">🎲 Dice Roller</h4>
                <div className="grid grid-cols-4 gap-2">
                  {['d4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100'].map((die) => (
                    <button key={die} className="pixel-button text-xs">
                      {die}
                    </button>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-amber-50 rounded border-2 border-amber-600">
                  <div className="text-center font-pixel text-sm text-amber-800">
                    🎲 Roll Result: --
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameScreen;
