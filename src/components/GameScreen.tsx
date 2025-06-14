import React, { useState } from 'react';
import type { GameState, DiceRoll, Stats, Quest } from '../types/game';
import DiceRoller from './DiceRoller';
import QuestManager from './QuestManager';
import StoryEventManager from './StoryEventManager';
import PartyInteractionPanel from './PartyInteractionPanel';
import GameStats from './GameStats';
import { performStatCheck, DIFFICULTY_CLASSES, formatRollResult } from '../utils/diceUtils';
import { aiService } from '../services/aiService';

interface GameScreenProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

const GameScreen: React.FC<GameScreenProps> = ({ gameState, setGameState }) => {
  const [playerAction, setPlayerAction] = useState('');

  const handlePlayerAction = async () => {
    if (!playerAction.trim() || !gameState.playerCharacter || !gameState.currentWorld) return;

    // Add player action to narrative
    const newNarrative = [...gameState.narrative, `You: ${playerAction}`];
    
    setGameState(prev => ({
      ...prev,
      narrative: newNarrative
    }));

    const currentAction = playerAction;
    setPlayerAction('');
    
    try {
      // Get enhanced AI DM response with full party context
      const aiResponse = await aiService.getEnhancedDMResponse(
        currentAction,
        gameState.playerCharacter,
        gameState.currentParty?.members || [gameState.playerCharacter],
        gameState.currentWorld,
        newNarrative,
        gameState.currentQuest
      );

      setGameState(prev => ({
        ...prev,
        narrative: [...prev.narrative, `DM: ${aiResponse.narrative}`]
      }));

      // If AI suggests a dice roll, add it to the narrative
      if (aiResponse.diceRollRequired) {
        const { difficultyClass, stat } = aiResponse.diceRollRequired;
        setGameState(prev => ({
          ...prev,
          narrative: [...prev.narrative, `🎯 The DM requests a ${stat} check (DC ${difficultyClass}). Click the ${stat.toUpperCase()} button to roll!`]
        }));
      }
    } catch (error) {
      console.error('Failed to get AI response:', error);
      setGameState(prev => ({
        ...prev,
        narrative: [...prev.narrative, `DM: The DM considers your action carefully... (AI temporarily unavailable)`]
      }));
    }
  };

  const handleDiceRoll = (roll: DiceRoll) => {
    // Add roll to narrative
    const rollText = `🎲 ${roll.purpose}: ${roll.result}${roll.modifier ? ` + ${roll.modifier}` : ''} = ${roll.total}`;
    setGameState(prev => ({
      ...prev,
      narrative: [...prev.narrative, rollText],
      rollHistory: [...(prev.rollHistory || []), roll]
    }));
  };

  const performQuickStatCheck = (statName: keyof Stats, dc: number = DIFFICULTY_CLASSES.MEDIUM) => {
    if (!gameState.playerCharacter) return;

    const result = performStatCheck(gameState.playerCharacter.stats, {
      stat: statName,
      difficultyClass: dc
    });

    const message = formatRollResult(result);
    setGameState(prev => ({
      ...prev,
      narrative: [...prev.narrative, `🎯 ${message}`]
    }));

    handleDiceRoll(result.roll);
  };

  const handleQuestUpdate = (quest: Quest) => {
    setGameState(prev => ({
      ...prev,
      currentQuest: quest,
      narrative: [...prev.narrative, `📜 New Quest: ${quest.title} - ${quest.description}`]
    }));
  };

  const handleQuestComplete = (quest: Quest) => {
    setGameState(prev => ({
      ...prev,
      currentQuest: undefined,
      narrative: [...prev.narrative, `✅ Quest Completed: ${quest.title}! Your party gains experience and renown.`]
    }));
  };

  const handleEventChoice = (choice: string, event: any) => {
    setGameState(prev => ({
      ...prev,
      narrative: [
        ...prev.narrative,
        `🎭 Event: ${event.event}`,
        `You chose: ${choice}`
      ]
    }));

    // Set the choice as player action and process it
    setPlayerAction(choice);
    setTimeout(() => {
      handlePlayerAction();
    }, 100);
  };

  const handlePartyInteraction = (interaction: any) => {
    setGameState(prev => ({
      ...prev,
      narrative: [
        ...prev.narrative,
        `${interaction.character.name}: ${interaction.message}`
      ]
    }));
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="parchment-bg rounded-lg p-8 pixel-border">
        <h2 className="text-3xl font-pixel text-center text-amber-900 mb-6">
          🎲 Adventure Begins! 🎲
        </h2>
        
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Story Panel */}
          <div className="lg:col-span-2">
            <div className="bg-amber-100 rounded-lg p-6 pixel-border h-96 overflow-y-auto">
              <h3 className="text-xl font-pixel text-amber-900 mb-4">📖 Adventure Log</h3>
              <div className="space-y-2 font-pixel text-sm text-amber-800 leading-relaxed">
                {gameState.narrative.length === 0 ? (
                  <>
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
                      Your party stands ready for adventure!
                    </p>
                    <p className="text-blue-800 italic">
                      💬 Enter your action below to begin...
                    </p>
                  </>
                ) : (
                  gameState.narrative.map((entry, index) => (
                    <div 
                      key={index} 
                      className={`p-2 rounded ${
                        entry.startsWith('You:') ? 'bg-blue-100 border-l-4 border-blue-400' :
                        entry.startsWith('DM:') ? 'bg-green-100 border-l-4 border-green-400' :
                        entry.startsWith('🎲') || entry.startsWith('🎯') ? 'bg-yellow-100 border-l-4 border-yellow-400' :
                        'bg-amber-50'
                      }`}
                    >
                      {entry}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Character Panel */}
          <div>
            <div className="bg-amber-100 rounded-lg p-4 pixel-border mb-4">
              <h3 className="text-lg font-pixel text-amber-900 mb-4">👤 Character</h3>
              {gameState.playerCharacter && (
                <div className="space-y-2 font-pixel text-xs text-amber-800">
                  <div><strong>Name:</strong> {gameState.playerCharacter.name}</div>
                  <div><strong>Race:</strong> {gameState.playerCharacter.race}</div>
                  <div><strong>Class:</strong> {gameState.playerCharacter.class}</div>
                  <div><strong>Level:</strong> {gameState.playerCharacter.level}</div>
                  <div><strong>Personality:</strong> {gameState.playerCharacter.personality}</div>
                  
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

                  <div className="mt-4">
                    <strong>Quick Stat Checks:</strong>
                    <div className="grid grid-cols-2 gap-1 mt-2">
                      <button 
                        onClick={() => performQuickStatCheck('strength')}
                        className="pixel-button text-xs p-1"
                      >
                        STR
                      </button>
                      <button 
                        onClick={() => performQuickStatCheck('dexterity')}
                        className="pixel-button text-xs p-1"
                      >
                        DEX
                      </button>
                      <button 
                        onClick={() => performQuickStatCheck('constitution')}
                        className="pixel-button text-xs p-1"
                      >
                        CON
                      </button>
                      <button 
                        onClick={() => performQuickStatCheck('intelligence')}
                        className="pixel-button text-xs p-1"
                      >
                        INT
                      </button>
                      <button 
                        onClick={() => performQuickStatCheck('wisdom')}
                        className="pixel-button text-xs p-1"
                      >
                        WIS
                      </button>
                      <button 
                        onClick={() => performQuickStatCheck('charisma')}
                        className="pixel-button text-xs p-1"
                      >
                        CHA
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Party Panel */}
            <div className="bg-amber-100 rounded-lg p-4 pixel-border">
              <h3 className="text-lg font-pixel text-amber-900 mb-4">🎭 Party Members</h3>
              {gameState.currentParty?.members ? (
                <div className="space-y-3">
                  {gameState.currentParty.members.map((member) => (
                    <div key={member.id} className={`p-2 rounded pixel-border ${member.isPlayer ? 'bg-blue-100 border-blue-400' : 'bg-green-100 border-green-400'}`}>
                      <div className="font-pixel text-xs text-amber-800">
                        <div className="flex items-center justify-between mb-1">
                          <div className="font-bold">{member.isPlayer ? '👤' : '🤖'} {member.name}</div>
                          <div className="text-xs">Lvl {member.level}</div>
                        </div>
                        <div className="text-xs opacity-80">
                          {member.race} {member.class}
                        </div>
                        <div className="grid grid-cols-6 gap-1 mt-1 text-xs">
                          <div title="Strength">S: {member.stats.strength}</div>
                          <div title="Dexterity">D: {member.stats.dexterity}</div>
                          <div title="Constitution">C: {member.stats.constitution}</div>
                          <div title="Intelligence">I: {member.stats.intelligence}</div>
                          <div title="Wisdom">W: {member.stats.wisdom}</div>
                          <div title="Charisma">Ch: {member.stats.charisma}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="font-pixel text-xs text-amber-700 italic">No party assembled yet.</p>
              )}
            </div>

            {/* Quest Manager */}
            {gameState.currentParty && gameState.currentWorld && (
              <QuestManager
                currentQuest={gameState.currentQuest}
                world={gameState.currentWorld}
                party={gameState.currentParty.members}
                onQuestUpdate={handleQuestUpdate}
                onQuestComplete={handleQuestComplete}
              />
            )}
          </div>

          {/* Dice Roller Panel */}
          <div>
            <DiceRoller onRoll={handleDiceRoll} />
            
            {/* Game Stats */}
            <div className="mt-4">
              <GameStats gameState={gameState} />
            </div>
          </div>
        </div>

        {/* Story Events */}
        {gameState.currentParty && gameState.currentWorld && (
          <StoryEventManager
            world={gameState.currentWorld}
            party={gameState.currentParty.members}
            narrative={gameState.narrative}
            onEventChoice={handleEventChoice}
          />
        )}

        {/* Party Interaction */}
        {gameState.currentParty && gameState.currentParty.members.length > 1 && (
          <PartyInteractionPanel
            party={gameState.currentParty.members}
            currentAction={playerAction}
            onPartyInput={handlePartyInteraction}
          />
        )}

        {/* Action Panel */}
        <div className="mt-6">
          <div className="bg-amber-100 rounded-lg p-6 pixel-border">
            <h3 className="text-xl font-pixel text-amber-900 mb-4">⚡ Your Action</h3>
            <div className="space-y-4">
              <div>
                <textarea
                  value={playerAction}
                  onChange={(e) => setPlayerAction(e.target.value)}
                  placeholder="What do you say or do? (e.g., 'I search for hidden doors', 'I talk to the merchant', 'I attack the goblin')"
                  className="w-full h-24 p-3 rounded border-4 border-amber-800 font-pixel text-sm bg-amber-50 resize-none"
                />
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={handlePlayerAction}
                  disabled={!playerAction.trim()}
                  className="pixel-button flex-1 disabled:opacity-50"
                >
                  🗣️ Take Action
                </button>
                <button 
                  onClick={() => setPlayerAction('')}
                  className="pixel-button bg-gradient-to-b from-gray-400 to-gray-600 border-gray-800 text-gray-900"
                >
                  🔄 Clear
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameScreen;
