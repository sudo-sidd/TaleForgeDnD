import { useState } from 'react';
import type { DiceType, DiceRoll } from '../types/game';

interface DiceRollerProps {
  onRoll?: (roll: DiceRoll) => void;
  className?: string;
}

const DICE_TYPES: { type: DiceType; sides: number; emoji: string }[] = [
  { type: 'd4', sides: 4, emoji: '🔸' },
  { type: 'd6', sides: 6, emoji: '⚀' },
  { type: 'd8', sides: 8, emoji: '🔷' },
  { type: 'd10', sides: 10, emoji: '🔟' },
  { type: 'd12', sides: 12, emoji: '🔵' },
  { type: 'd20', sides: 20, emoji: '🎲' },
  { type: 'd100', sides: 100, emoji: '💯' }
];

const DiceRoller: React.FC<DiceRollerProps> = ({ onRoll, className = '' }) => {
  const [isRolling, setIsRolling] = useState(false);
  const [lastRoll, setLastRoll] = useState<DiceRoll | null>(null);
  const [selectedDice, setSelectedDice] = useState<DiceType>('d20');
  const [modifier, setModifier] = useState(0);
  const [purpose, setPurpose] = useState('');

  const rollDice = (diceType: DiceType, sides: number) => {
    if (isRolling) return;

    setIsRolling(true);
    setSelectedDice(diceType);

    // Simulate rolling animation delay
    setTimeout(() => {
      const result = Math.floor(Math.random() * sides) + 1;
      const total = result + modifier;
      
      const roll: DiceRoll = {
        type: diceType,
        result,
        modifier: modifier !== 0 ? modifier : undefined,
        total,
        purpose: purpose || `${diceType} roll`
      };

      setLastRoll(roll);
      setIsRolling(false);
      
      if (onRoll) {
        onRoll(roll);
      }
    }, 1000);
  };

  const getRollResultColor = (roll: DiceRoll) => {
    if (roll.type === 'd20') {
      if (roll.result === 20) return 'text-green-600 font-bold'; // Natural 20
      if (roll.result === 1) return 'text-red-600 font-bold';   // Natural 1
    }
    return 'text-amber-900';
  };

  const getRollResultMessage = (roll: DiceRoll) => {
    if (roll.type === 'd20') {
      if (roll.result === 20) return '🎉 CRITICAL SUCCESS! 🎉';
      if (roll.result === 1) return '💥 CRITICAL FAILURE! 💥';
    }
    return '';
  };

  return (
    <div className={`bg-amber-100 rounded-lg p-4 pixel-border ${className}`}>
      <h4 className="font-pixel text-lg text-amber-900 mb-4 text-center">
        🎲 Dice Roller 🎲
      </h4>

      {/* Purpose Input */}
      <div className="mb-4">
        <label className="block font-pixel text-xs text-amber-800 mb-2">
          Roll Purpose (optional):
        </label>
        <input
          type="text"
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          placeholder="e.g., Attack roll, Perception check..."
          className="w-full p-2 rounded border-2 border-amber-600 font-pixel text-xs bg-amber-50"
        />
      </div>

      {/* Modifier Input */}
      <div className="mb-4">
        <label className="block font-pixel text-xs text-amber-800 mb-2">
          Modifier:
        </label>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setModifier(prev => prev - 1)}
            className="w-8 h-8 pixel-button text-xs"
          >
            -
          </button>
          <span className="w-12 text-center font-pixel text-sm text-amber-900 bg-amber-50 py-1 px-2 rounded border border-amber-300">
            {modifier >= 0 ? `+${modifier}` : modifier}
          </span>
          <button
            onClick={() => setModifier(prev => prev + 1)}
            className="w-8 h-8 pixel-button text-xs"
          >
            +
          </button>
        </div>
      </div>

      {/* Dice Buttons */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {DICE_TYPES.map(({ type, sides, emoji }) => (
          <button
            key={type}
            onClick={() => rollDice(type, sides)}
            disabled={isRolling}
            className={`pixel-button text-xs p-2 flex flex-col items-center space-y-1 ${
              selectedDice === type && isRolling ? 'animate-bounce' : ''
            } disabled:opacity-50`}
          >
            <span className="text-lg">{emoji}</span>
            <span>{type}</span>
          </button>
        ))}
      </div>

      {/* Roll Result */}
      <div className="bg-amber-50 rounded border-2 border-amber-600 p-4 min-h-[100px] flex flex-col justify-center">
        {isRolling ? (
          <div className="text-center">
            <div className="text-4xl animate-spin inline-block">🎲</div>
            <p className="font-pixel text-xs text-amber-800 mt-2">Rolling...</p>
          </div>
        ) : lastRoll ? (
          <div className="text-center">
            <div className={`font-pixel text-lg ${getRollResultColor(lastRoll)}`}>
              {lastRoll.type.toUpperCase()}: {lastRoll.result}
              {lastRoll.modifier && lastRoll.modifier !== 0 && (
                <span className="text-amber-700">
                  {lastRoll.modifier >= 0 ? ` + ${lastRoll.modifier}` : ` - ${Math.abs(lastRoll.modifier)}`}
                </span>
              )}
            </div>
            <div className="font-pixel text-xl text-amber-900 font-bold mt-1">
              Total: {lastRoll.total}
            </div>
            {lastRoll.purpose && (
              <div className="font-pixel text-xs text-amber-700 mt-1">
                {lastRoll.purpose}
              </div>
            )}
            {getRollResultMessage(lastRoll) && (
              <div className="font-pixel text-xs text-center mt-2">
                {getRollResultMessage(lastRoll)}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center font-pixel text-sm text-amber-600">
            Click a die to roll!
          </div>
        )}
      </div>

      {/* Quick Roll Buttons */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          onClick={() => rollDice('d20', 20)}
          disabled={isRolling}
          className="pixel-button text-xs bg-gradient-to-b from-green-400 to-green-600 border-green-800 text-green-900"
        >
          🎯 Quick d20
        </button>
        <button
          onClick={() => {
            setPurpose('Ability Check');
            rollDice('d20', 20);
          }}
          disabled={isRolling}
          className="pixel-button text-xs bg-gradient-to-b from-blue-400 to-blue-600 border-blue-800 text-blue-900"
        >
          🧠 Ability Check
        </button>
      </div>
    </div>
  );
};

export default DiceRoller;
