import React, { useState } from 'react';
import type { Character } from '../types/game';

interface PartyInteraction {
  characterId: string;
  character: Character;
  message: string;
  timestamp: Date;
}

interface PartyInteractionProps {
  party: Character[];
  currentAction: string;
  onPartyInput: (interaction: PartyInteraction) => void;
}

const PartyInteractionPanel: React.FC<PartyInteractionProps> = ({
  party,
  currentAction,
  onPartyInput
}) => {
  const [selectedMember, setSelectedMember] = useState<Character | null>(null);
  const [memberInput, setMemberInput] = useState('');
  const [isAIGenerating, setIsAIGenerating] = useState(false);

  const nonPlayerMembers = party.filter(member => !member.isPlayer);

  const generateAISuggestion = (character: Character) => {
    setIsAIGenerating(true);
    
    // Generate contextual responses based on character personality
    const suggestions = {
      'Brave': [
        "Let's face this challenge head-on!",
        "I'll take the lead on this one.",
        "We can handle whatever comes our way."
      ],
      'Cautious': [
        "Perhaps we should think this through first.",
        "I sense potential danger here.",
        "Let's proceed carefully."
      ],
      'Curious': [
        "I wonder what we might discover...",
        "This reminds me of something I've read.",
        "There's more here than meets the eye."
      ],
      'Loyal': [
        "Whatever you decide, I'm with you.",
        "The party sticks together.",
        "I trust your judgment on this."
      ],
      'Witty': [
        "Well, this is certainly interesting!",
        "I have an idea that might work...",
        "Leave it to us to find trouble!"
      ],
      'Gruff': [
        "Let's get this over with.",
        "I don't like the look of this.",
        "Simple solutions work best."
      ]
    };

    const personalitySuggestions = suggestions[character.personality] || suggestions['Loyal'];
    const randomSuggestion = personalitySuggestions[Math.floor(Math.random() * personalitySuggestions.length)];
    
    setTimeout(() => {
      setMemberInput(randomSuggestion);
      setIsAIGenerating(false);
    }, 1000);
  };

  const submitMemberInput = () => {
    if (!selectedMember || !memberInput.trim()) return;

    const interaction: PartyInteraction = {
      characterId: selectedMember.id,
      character: selectedMember,
      message: memberInput,
      timestamp: new Date()
    };

    onPartyInput(interaction);
    setMemberInput('');
    setSelectedMember(null);
  };

  const getClassIcon = (characterClass: string): string => {
    const classIcons: Record<string, string> = {
      'Fighter': '⚔️',
      'Wizard': '🧙‍♂️',
      'Rogue': '🗡️',
      'Cleric': '✨',
      'Barbarian': '🪓',
      'Ranger': '🏹',
      'Sorcerer': '🔮',
      'Bard': '🎵'
    };
    return classIcons[characterClass] || '👤';
  };

  if (nonPlayerMembers.length === 0) {
    return null;
  }

  return (
    <div className="bg-green-100 rounded-lg p-4 pixel-border">
      <h3 className="text-lg font-pixel text-green-900 mb-3">
        🗣️ Party Discussion
      </h3>
      
      {currentAction && (
        <div className="bg-green-50 rounded p-2 pixel-border mb-3">
          <p className="font-pixel text-xs text-green-800">
            <strong>Current Situation:</strong> {currentAction}
          </p>
        </div>
      )}

      {!selectedMember ? (
        <div>
          <p className="font-pixel text-sm text-green-800 mb-3">
            Who would like to contribute to the discussion?
          </p>
          <div className="grid grid-cols-1 gap-2">
            {nonPlayerMembers.map(member => (
              <button
                key={member.id}
                onClick={() => setSelectedMember(member)}
                className="flex items-center p-2 rounded pixel-button bg-gradient-to-b from-green-300 to-green-500 border-green-700 text-green-900 hover:from-green-400 hover:to-green-600"
              >
                <span className="mr-2">{getClassIcon(member.class)}</span>
                <div className="text-left">
                  <div className="font-pixel text-sm font-bold">{member.name}</div>
                  <div className="font-pixel text-xs opacity-80">
                    {member.race} {member.class} • {member.personality}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center mb-3">
            <span className="mr-2">{getClassIcon(selectedMember.class)}</span>
            <div>
              <div className="font-pixel text-sm font-bold text-green-900">
                {selectedMember.name} speaks:
              </div>
              <div className="font-pixel text-xs text-green-700">
                {selectedMember.personality} • {selectedMember.quirk}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <textarea
              value={memberInput}
              onChange={(e) => setMemberInput(e.target.value)}
              placeholder={`What does ${selectedMember.name} say or do?`}
              className="w-full h-20 p-2 rounded border-2 border-green-600 font-pixel text-sm bg-green-50 resize-none"
            />
            
            <div className="flex gap-2">
              <button
                onClick={submitMemberInput}
                disabled={!memberInput.trim()}
                className="pixel-button flex-1 disabled:opacity-50"
              >
                💬 Speak
              </button>
              <button
                onClick={() => generateAISuggestion(selectedMember)}
                disabled={isAIGenerating}
                className="pixel-button bg-gradient-to-b from-blue-400 to-blue-600 border-blue-800 text-blue-900 disabled:opacity-50"
              >
                {isAIGenerating ? '⚡' : '🤖'} AI
              </button>
              <button
                onClick={() => {
                  setSelectedMember(null);
                  setMemberInput('');
                }}
                className="pixel-button bg-gradient-to-b from-gray-400 to-gray-600 border-gray-800 text-gray-900"
              >
                ↩️
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartyInteractionPanel;
