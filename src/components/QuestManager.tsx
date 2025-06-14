import React, { useState, useEffect } from 'react';
import type { Quest, Character, World } from '../types/game';
import { aiService } from '../services/aiService';

interface QuestManagerProps {
  currentQuest?: Quest;
  world: World;
  party: Character[];
  onQuestUpdate: (quest: Quest) => void;
  onQuestComplete: (quest: Quest) => void;
}

const QuestManager: React.FC<QuestManagerProps> = ({
  currentQuest,
  world,
  party,
  onQuestUpdate,
  onQuestComplete
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [availableQuests, setAvailableQuests] = useState<Quest[]>([]);

  useEffect(() => {
    if (!currentQuest) {
      generateInitialQuest();
    }
  }, []);

  const generateInitialQuest = async () => {
    setIsGenerating(true);
    try {
      const mainQuest = await aiService.generateQuest(world, party, 'main');
      onQuestUpdate(mainQuest);
    } catch (error) {
      console.error('Failed to generate initial quest:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateSideQuest = async () => {
    setIsGenerating(true);
    try {
      const sideQuest = await aiService.generateQuest(world, party, 'side');
      setAvailableQuests(prev => [...prev, sideQuest]);
    } catch (error) {
      console.error('Failed to generate side quest:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const acceptQuest = (quest: Quest) => {
    onQuestUpdate(quest);
    setAvailableQuests(prev => prev.filter(q => q.id !== quest.id));
  };

  const completeQuest = (quest: Quest) => {
    onQuestComplete(quest);
    setAvailableQuests([]);
  };

  const getQuestTypeIcon = (type: 'main' | 'side') => {
    return type === 'main' ? '⭐' : '📋';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-800 bg-green-100';
      case 'completed': return 'text-blue-800 bg-blue-100';
      case 'failed': return 'text-red-800 bg-red-100';
      default: return 'text-amber-800 bg-amber-100';
    }
  };

  return (
    <div className="bg-amber-100 rounded-lg p-4 pixel-border">
      <h3 className="text-lg font-pixel text-amber-900 mb-4">📜 Quest Journal</h3>
      
      {/* Current Quest */}
      {currentQuest && (
        <div className="mb-4">
          <div className="bg-amber-50 rounded p-3 pixel-border">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-pixel text-sm font-bold text-amber-900">
                {getQuestTypeIcon(currentQuest.type)} {currentQuest.title}
              </h4>
              <div className={`px-2 py-1 rounded text-xs font-pixel ${getStatusColor(currentQuest.status)}`}>
                {currentQuest.status.toUpperCase()}
              </div>
            </div>
            <p className="font-pixel text-xs text-amber-800 mb-2">
              {currentQuest.description}
            </p>
            <div className="flex items-center justify-between">
              <span className="font-pixel text-xs text-amber-700">
                🎯 DC: {currentQuest.difficultyClass}
              </span>
              {currentQuest.status === 'active' && (
                <button
                  onClick={() => completeQuest(currentQuest)}
                  className="pixel-button text-xs py-1 px-2 bg-gradient-to-b from-green-400 to-green-600 border-green-800 text-green-900"
                >
                  ✅ Complete
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Available Side Quests */}
      {availableQuests.length > 0 && (
        <div className="mb-4">
          <h4 className="font-pixel text-sm text-amber-900 mb-2">📋 Available Quests</h4>
          <div className="space-y-2">
            {availableQuests.map(quest => (
              <div key={quest.id} className="bg-amber-50 rounded p-2 pixel-border">
                <div className="flex items-center justify-between mb-1">
                  <h5 className="font-pixel text-xs font-bold text-amber-900">
                    {getQuestTypeIcon(quest.type)} {quest.title}
                  </h5>
                  <button
                    onClick={() => acceptQuest(quest)}
                    className="pixel-button text-xs py-1 px-2"
                  >
                    Accept
                  </button>
                </div>
                <p className="font-pixel text-xs text-amber-800 mb-1">
                  {quest.description}
                </p>
                <span className="font-pixel text-xs text-amber-700">
                  🎯 DC: {quest.difficultyClass}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quest Actions */}
      <div className="space-y-2">
        <button
          onClick={generateSideQuest}
          disabled={isGenerating}
          className="pixel-button w-full text-xs disabled:opacity-50"
        >
          {isGenerating ? '⚡ Generating...' : '🔍 Seek New Quest'}
        </button>
        
        {!currentQuest && !isGenerating && (
          <button
            onClick={generateInitialQuest}
            className="pixel-button w-full text-xs bg-gradient-to-b from-blue-400 to-blue-600 border-blue-800 text-blue-900"
          >
            🎯 Begin Adventure
          </button>
        )}
      </div>
    </div>
  );
};

export default QuestManager;
