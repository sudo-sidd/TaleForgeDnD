import React, { useState } from 'react';
import type { Character, World } from '../types/game';
import { aiService } from '../services/aiService';

interface StoryEvent {
  id: string;
  event: string;
  choices: string[];
  timestamp: Date;
}

interface StoryEventManagerProps {
  world: World;
  party: Character[];
  narrative: string[];
  onEventChoice: (choice: string, event: StoryEvent) => void;
}

const StoryEventManager: React.FC<StoryEventManagerProps> = ({
  world,
  party,
  narrative,
  onEventChoice
}) => {
  const [currentEvent, setCurrentEvent] = useState<StoryEvent | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [eventHistory, setEventHistory] = useState<StoryEvent[]>([]);

  const generateRandomEvent = async () => {
    setIsGenerating(true);
    try {
      const eventData = await aiService.generateStoryEvent(world, party, narrative);
      const newEvent: StoryEvent = {
        id: `event-${Date.now()}`,
        event: eventData.event,
        choices: eventData.choices,
        timestamp: new Date()
      };
      
      setCurrentEvent(newEvent);
      setEventHistory(prev => [...prev, newEvent]);
    } catch (error) {
      console.error('Failed to generate story event:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleChoiceSelect = (choice: string) => {
    if (currentEvent) {
      onEventChoice(choice, currentEvent);
      setCurrentEvent(null);
    }
  };

  const shouldOfferEvent = () => {
    // Offer events periodically based on narrative length
    return narrative.length > 0 && narrative.length % 8 === 0 && !currentEvent;
  };

  return (
    <div className="space-y-4">
      {/* Current Event */}
      {currentEvent && (
        <div className="bg-gradient-to-b from-purple-100 to-purple-200 rounded-lg p-4 pixel-border border-purple-400">
          <h3 className="text-lg font-pixel text-purple-900 mb-3 flex items-center">
            ✨ Random Encounter ✨
          </h3>
          
          <div className="bg-purple-50 rounded p-3 pixel-border mb-4">
            <p className="font-pixel text-sm text-purple-800 leading-relaxed">
              {currentEvent.event}
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-pixel text-sm text-purple-900 font-bold">
              🤔 How do you respond?
            </h4>
            {currentEvent.choices.map((choice, index) => (
              <button
                key={index}
                onClick={() => handleChoiceSelect(choice)}
                className="w-full text-left p-2 rounded pixel-button bg-gradient-to-b from-purple-300 to-purple-500 border-purple-700 text-purple-900 hover:from-purple-400 hover:to-purple-600"
              >
                <span className="font-pixel text-sm">
                  {String.fromCharCode(65 + index)}) {choice}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Event Generation Button */}
      {!currentEvent && (
        <div className="bg-amber-100 rounded-lg p-4 pixel-border">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-pixel text-sm text-amber-900 font-bold mb-1">
                🎭 Story Events
              </h4>
              <p className="font-pixel text-xs text-amber-700">
                {shouldOfferEvent() 
                  ? 'Something interesting might happen...' 
                  : 'Keep adventuring to encounter new events!'
                }
              </p>
            </div>
            <button
              onClick={generateRandomEvent}
              disabled={isGenerating}
              className={`pixel-button text-xs px-3 py-2 ${
                shouldOfferEvent() 
                  ? 'bg-gradient-to-b from-green-400 to-green-600 border-green-800 text-green-900' 
                  : ''
              } disabled:opacity-50`}
            >
              {isGenerating ? '⚡ Creating...' : '🎲 Random Event'}
            </button>
          </div>
        </div>
      )}
      
      {/* Event History */}
      {eventHistory.length > 0 && (
        <details className="bg-gray-100 rounded-lg p-4 pixel-border">
          <summary className="font-pixel text-sm text-gray-900 cursor-pointer hover:text-gray-700">
            📖 Event History ({eventHistory.length})
          </summary>
          <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
            {eventHistory.slice(-5).reverse().map((event) => (
              <div key={event.id} className="bg-gray-50 rounded p-2 pixel-border">
                <p className="font-pixel text-xs text-gray-700 mb-1">
                  {event.event}
                </p>
                <span className="font-pixel text-xs text-gray-500">
                  {event.timestamp.toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
};

export default StoryEventManager;
