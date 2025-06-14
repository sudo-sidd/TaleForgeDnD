import React from 'react';
import type { GameState } from '../types/game';

interface GameStatsProps {
  gameState: GameState;
}

const GameStats: React.FC<GameStatsProps> = ({ gameState }) => {
  const totalActions = gameState.narrative.filter(entry => entry.startsWith('You:')).length;
  const totalRolls = gameState.rollHistory?.length || 0;
  // const questsCompleted = 0; // Could track completed quests in future
  const partySize = gameState.currentParty?.members.length || 0;

  const getPlaytimeEstimate = () => {
    const actionsPerMinute = 2; // Rough estimate
    const estimatedMinutes = Math.max(1, Math.floor(totalActions / actionsPerMinute));
    
    if (estimatedMinutes < 60) {
      return `${estimatedMinutes} minutes`;
    } else {
      const hours = Math.floor(estimatedMinutes / 60);
      const minutes = estimatedMinutes % 60;
      return `${hours}h ${minutes}m`;
    }
  };

  const getGamePhaseDisplay = () => {
    switch (gameState.gamePhase) {
      case 'world-selection': return '🌍 Choosing World';
      case 'character-creation': return '👤 Creating Character';
      case 'party-generation': return '🎭 Assembling Party';
      case 'gameplay': return '⚔️ Adventuring';
      default: return '🎮 Playing';
    }
  };

  const getCurrentQuestStatus = () => {
    if (!gameState.currentQuest) return 'No active quest';
    return `${gameState.currentQuest.title} (DC ${gameState.currentQuest.difficultyClass})`;
  };

  return (
    <div className="bg-slate-100 rounded-lg p-4 pixel-border">
      <h3 className="text-lg font-pixel text-slate-900 mb-3">
        📊 Adventure Stats
      </h3>
      
      <div className="space-y-2 font-pixel text-sm text-slate-800">
        <div className="flex justify-between">
          <span>Game Phase:</span>
          <span className="font-bold">{getGamePhaseDisplay()}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Playtime:</span>
          <span className="font-bold">{getPlaytimeEstimate()}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Actions Taken:</span>
          <span className="font-bold">{totalActions}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Dice Rolled:</span>
          <span className="font-bold">{totalRolls}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Party Size:</span>
          <span className="font-bold">{partySize}</span>
        </div>
        
        <div className="border-t border-slate-300 pt-2 mt-2">
          <div className="text-xs text-slate-600">
            <strong>Current World:</strong> {gameState.currentWorld?.name || 'None'}
          </div>
          <div className="text-xs text-slate-600">
            <strong>Active Quest:</strong> {getCurrentQuestStatus()}
          </div>
          {gameState.playerCharacter && (
            <div className="text-xs text-slate-600">
              <strong>Character:</strong> {gameState.playerCharacter.name} ({gameState.playerCharacter.race} {gameState.playerCharacter.class})
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="border-t border-slate-300 pt-2 mt-2">
          <div className="text-xs text-slate-600 mb-1">
            <strong>Quick Tips:</strong>
          </div>
          <div className="text-xs text-slate-500 space-y-1">
            {gameState.gamePhase === 'gameplay' && (
              <>
                <div>• Use stat buttons for quick checks</div>
                <div>• Try the Random Event generator</div>
                <div>• Let party members contribute ideas</div>
              </>
            )}
            {gameState.gamePhase !== 'gameplay' && (
              <div>• Follow the setup steps to begin your adventure</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameStats;
