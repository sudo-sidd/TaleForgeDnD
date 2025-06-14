import React, { useState, useEffect } from 'react';
import type { Character, World } from '../types/game';
import { aiService } from '../services/aiService';
import { getAllModifiers } from '../utils/diceUtils';

interface PartyGenerationProps {
  playerCharacter: Character;
  world: World;
  onPartyGenerated: (party: Character[]) => void;
}

const PartyGeneration: React.FC<PartyGenerationProps> = ({ 
  playerCharacter, 
  world, 
  onPartyGenerated 
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedParty, setGeneratedParty] = useState<Character[]>([]);
  const [error, setError] = useState<string | null>(null);

  const generateParty = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const partyMembers = await aiService.generatePartyMembers(playerCharacter, world, 3);
      setGeneratedParty(partyMembers);
    } catch (err) {
      setError('Failed to generate party members. Using default party.');
      console.error('Party generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    generateParty();
  }, []);

  const handleAcceptParty = () => {
    onPartyGenerated([playerCharacter, ...generatedParty]);
  };

  const getClassEmoji = (characterClass: string): string => {
    const classEmojis: Record<string, string> = {
      'Fighter': '⚔️',
      'Wizard': '🧙‍♂️',
      'Rogue': '🗡️',
      'Cleric': '✨',
      'Barbarian': '🪓',
      'Ranger': '🏹',
      'Sorcerer': '🔮',
      'Bard': '🎵'
    };
    return classEmojis[characterClass] || '👤';
  };

  const getRaceEmoji = (race: string): string => {
    const raceEmojis: Record<string, string> = {
      'Human': '👤',
      'Elf': '🧝‍♀️',
      'Dwarf': '⛏️',
      'Halfling': '🍄',
      'Gnome': '🎩',
      'Orc': '👹',
      'Tiefling': '😈',
      'Dragonborn': '🐲',
      'Goliath': '🗿',
      'Aarakocra': '🦅'
    };
    return raceEmojis[race] || '👤';
  };

  if (isGenerating) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="parchment-bg rounded-lg p-8 pixel-border text-center">
          <h2 className="text-3xl font-pixel text-amber-900 mb-6">
            🎭 Assembling Your Party 🎭
          </h2>
          <div className="text-6xl animate-bounce mb-4">⚔️</div>
          <p className="font-pixel text-lg text-amber-800 mb-4">
            The AI Dungeon Master is gathering companions...
          </p>
          <div className="flex justify-center space-x-2">
            <div className="w-3 h-3 bg-amber-600 rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-amber-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-3 h-3 bg-amber-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="parchment-bg rounded-lg p-8 pixel-border">
        <h2 className="text-3xl font-pixel text-center text-amber-900 mb-6">
          🎭 Your Adventuring Party 🎭
        </h2>
        
        <div className="text-center mb-6">
          <p className="text-lg text-amber-800 font-pixel">
            Your companions for the quest in <span className="text-red-800 font-bold">{world.name}</span>
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border-4 border-red-400 rounded p-4 mb-6">
            <p className="font-pixel text-sm text-red-800">{error}</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Player Character */}
          <div className="bg-blue-100 rounded-lg p-4 border-4 border-blue-400">
            <div className="text-center mb-3">
              <div className="text-4xl mb-2">
                {getClassEmoji(playerCharacter.class)} {getRaceEmoji(playerCharacter.race)}
              </div>
              <h3 className="font-pixel text-lg text-blue-900 mb-1">
                {playerCharacter.name}
              </h3>
              <p className="font-pixel text-xs text-blue-700">
                {playerCharacter.race} {playerCharacter.class}
              </p>
              <p className="font-pixel text-xs text-blue-600 italic">
                (You)
              </p>
            </div>
            
            <div className="space-y-1 font-pixel text-xs text-blue-800">
              <div><strong>Personality:</strong> {playerCharacter.personality}</div>
              <div><strong>Quirk:</strong> {playerCharacter.quirk}</div>
              
              <div className="mt-3">
                <strong>Stats:</strong>
                <div className="grid grid-cols-2 gap-1 mt-1 text-xs">
                  {Object.entries(getAllModifiers(playerCharacter.stats)).map(([stat, modifier]) => (
                    <div key={stat} className="flex justify-between">
                      <span>{stat.slice(0, 3).toUpperCase()}:</span>
                      <span>{modifier >= 0 ? `+${modifier}` : modifier}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Generated Party Members */}
          {generatedParty.map((member) => (
            <div key={member.id} className="bg-amber-100 rounded-lg p-4 border-4 border-amber-400">
              <div className="text-center mb-3">
                <div className="text-4xl mb-2">
                  {getClassEmoji(member.class)} {getRaceEmoji(member.race)}
                </div>
                <h3 className="font-pixel text-lg text-amber-900 mb-1">
                  {member.name}
                </h3>
                <p className="font-pixel text-xs text-amber-700">
                  {member.race} {member.class}
                </p>
              </div>
              
              <div className="space-y-1 font-pixel text-xs text-amber-800">
                <div><strong>Personality:</strong> {member.personality}</div>
                <div><strong>Quirk:</strong> {member.quirk}</div>
                {member.backstory && (
                  <div><strong>Background:</strong> {member.backstory}</div>
                )}
                
                <div className="mt-3">
                  <strong>Stats:</strong>
                  <div className="grid grid-cols-2 gap-1 mt-1 text-xs">
                    {Object.entries(getAllModifiers(member.stats)).map(([stat, modifier]) => (
                      <div key={stat} className="flex justify-between">
                        <span>{stat.slice(0, 3).toUpperCase()}:</span>
                        <span>{modifier >= 0 ? `+${modifier}` : modifier}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center space-y-4">
          <div className="bg-green-100 border-4 border-green-400 rounded p-4">
            <p className="font-pixel text-sm text-green-800 mb-2">
              ✅ <strong>Party Balance Check:</strong>
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
              <div className="bg-red-200 p-2 rounded">
                <strong>Tank:</strong> {[playerCharacter, ...generatedParty].find(c => ['Fighter', 'Barbarian'].includes(c.class))?.name || 'None'}
              </div>
              <div className="bg-green-200 p-2 rounded">
                <strong>Healer:</strong> {[playerCharacter, ...generatedParty].find(c => c.class === 'Cleric')?.name || 'None'}
              </div>
              <div className="bg-blue-200 p-2 rounded">
                <strong>Damage:</strong> {[playerCharacter, ...generatedParty].find(c => ['Wizard', 'Sorcerer', 'Ranger'].includes(c.class))?.name || 'None'}
              </div>
              <div className="bg-purple-200 p-2 rounded">
                <strong>Utility:</strong> {[playerCharacter, ...generatedParty].find(c => ['Rogue', 'Bard'].includes(c.class))?.name || 'None'}
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={generateParty}
              disabled={isGenerating}
              className="pixel-button bg-gradient-to-b from-blue-400 to-blue-600 border-blue-800 text-blue-900"
            >
              🎲 Generate New Party
            </button>
            <button
              onClick={handleAcceptParty}
              className="pixel-button bg-gradient-to-b from-green-400 to-green-600 border-green-800 text-green-900"
            >
              ⚔️ Begin Adventure!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartyGeneration;
