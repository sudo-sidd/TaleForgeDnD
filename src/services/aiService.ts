// Updated to use Vite's `import.meta.env` for environment variables.

import type { Character, World, AIResponse, Quest, Stats } from '../types/game';

// AI Service for interacting with Grok API
export class AIService {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || import.meta.env.VITE_GROK_API_KEY || '';
    this.baseUrl = 'https://api.x.ai/v1'; // Grok API endpoint
  }

  // Generate AI DM response to player action
  async getDMResponse(
    playerAction: string,
    character: Character,
    world: World,
    narrative: string[] = []
  ): Promise<AIResponse> {
    if (!this.apiKey) {
      // Fallback responses for development without API key
      return this.getFallbackResponse(playerAction, character, world);
    }

    try {
      const prompt = this.buildDMPrompt(playerAction, character, world, narrative);
      
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'grok-beta',
          messages: [
            {
              role: 'system',
              content: this.getSystemPrompt()
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 300,
          temperature: 0.8
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      const aiText = data.choices[0]?.message?.content || 'The DM seems distracted...';

      return this.parseAIResponse(aiText);
    } catch (error) {
      console.error('AI Service Error:', error);
      return this.getFallbackResponse(playerAction, character, world);
    }
  }

  // Generate party members using AI
  async generatePartyMembers(
    playerCharacter: Character,
    world: World,
    count: number = 3
  ): Promise<Character[]> {
    if (!this.apiKey) {
      return this.getFallbackParty(playerCharacter, world, count);
    }

    try {
      const prompt = this.buildPartyPrompt(playerCharacter, world, count);
      
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'grok-beta',
          messages: [
            {
              role: 'system',
              content: 'You are a D&D party generator. Create balanced party members with detailed stats and personalities.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 500,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      const party = this.parsePartyResponse(data);

      if (!party) {
        throw new Error('Failed to parse party response');
      }

      return party;
    } catch (error) {
      console.error('AI Service Error:', error);
      return this.getFallbackParty(playerCharacter, world, count);
    }
  }

  // Generate dynamic quests based on world and party
  async generateQuest(
    world: World,
    party: Character[],
    questType: 'main' | 'side' = 'side'
  ): Promise<Quest> {
    if (!this.apiKey) {
      return this.getFallbackQuest(world, questType);
    }

    try {
      const prompt = this.buildQuestPrompt(world, party, questType);
      
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'grok-beta',
          messages: [
            {
              role: 'system',
              content: 'You are a quest generator for D&D adventures. Create engaging quests that fit the world and party composition.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 200,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`Quest generation failed: ${response.statusText}`);
      }

      const data = await response.json();
      const questText = data.choices[0]?.message?.content || '';
      
      return this.parseQuestResponse(questText, world, questType) || this.getFallbackQuest(world, questType);
    } catch (error) {
      console.error('Quest Generation Error:', error);
      return this.getFallbackQuest(world, questType);
    }
  }

  // Generate story events based on current situation
  async generateStoryEvent(
    world: World,
    party: Character[],
    currentNarrative: string[]
  ): Promise<{ event: string; choices: string[] }> {
    if (!this.apiKey) {
      return this.getFallbackEvent(world);
    }

    try {
      const prompt = this.buildEventPrompt(world, party, currentNarrative);
      
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'grok-beta',
          messages: [
            {
              role: 'system',
              content: 'You are a story event generator for D&D. Create interesting encounters and decisions for the party.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 250,
          temperature: 0.8
        })
      });

      if (!response.ok) {
        throw new Error(`Event generation failed: ${response.statusText}`);
      }

      const data = await response.json();
      const eventText = data.choices[0]?.message?.content || '';
      
      return this.parseEventResponse(eventText) || this.getFallbackEvent(world);
    } catch (error) {
      console.error('Event Generation Error:', error);
      return this.getFallbackEvent(world);
    }
  }

  // Enhanced DM response with better context awareness
  async getEnhancedDMResponse(
    playerAction: string,
    character: Character,
    party: Character[],
    world: World,
    narrative: string[] = [],
    currentQuest?: Quest
  ): Promise<AIResponse> {
    if (!this.apiKey) {
      return this.getEnhancedFallbackResponse(playerAction, character, party, world, currentQuest);
    }

    try {
      const prompt = this.buildEnhancedDMPrompt(playerAction, character, party, world, narrative, currentQuest);
      
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'grok-beta',
          messages: [
            {
              role: 'system',
              content: this.getEnhancedSystemPrompt()
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 400,
          temperature: 0.8
        })
      });

      if (!response.ok) {
        throw new Error(`Enhanced API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      const aiText = data.choices[0]?.message?.content || 'The DM pauses thoughtfully...';

      return this.parseEnhancedAIResponse(aiText);
    } catch (error) {
      console.error('Enhanced AI Service Error:', error);
      return this.getEnhancedFallbackResponse(playerAction, character, party, world, currentQuest);
    }
  }

  // Build the main DM prompt
  private buildDMPrompt(
    playerAction: string,
    character: Character,
    world: World,
    narrative: string[]
  ): string {
    const recentNarrative = narrative.slice(-10).join('\n');
    
    return `
You are the Dungeon Master for a D&D adventure in ${world.name}.

WORLD CONTEXT:
${world.description}
${world.plotHook}

PLAYER CHARACTER:
- Name: ${character.name}
- Race: ${character.race}
- Class: ${character.class}
- Personality: ${character.personality}
- Quirk: ${character.quirk}

RECENT EVENTS:
${recentNarrative}

PLAYER ACTION: "${playerAction}"

As the DM, respond to this action with:
1. A narrative description of what happens
2. Any consequences or results
3. What the player sees/hears/experiences
4. If needed, suggest what kind of dice roll might be required

Keep responses engaging, creative, and true to D&D storytelling style. Be concise but vivid.
    `;
  }

  private buildEnhancedDMPrompt(
    playerAction: string,
    character: Character,
    party: Character[],
    world: World,
    narrative: string[],
    currentQuest?: Quest
  ): string {
    const recentNarrative = narrative.slice(-12).join('\n');
    const partyInfo = party.map(p => `${p.name} (${p.race} ${p.class}, Level ${p.level})`).join('\n');
    const questInfo = currentQuest ? `\nCURRENT QUEST: ${currentQuest.title} - ${currentQuest.description}` : '';
    
    return `
You are the Dungeon Master for a D&D adventure in ${world.name}.

WORLD CONTEXT:
${world.description}
Theme: ${world.theme}
Main Plot: ${world.plotHook}

PARTY COMPOSITION:
${partyInfo}

ACTIVE CHARACTER: ${character.name} (${character.race} ${character.class})
- Personality: ${character.personality}
- Quirk: ${character.quirk}${questInfo}

RECENT STORY:
${recentNarrative}

PLAYER ACTION: "${playerAction}"

As the DM, respond with:
1. Vivid narrative description of what happens
2. How the party and world react
3. Any consequences or opportunities
4. If a dice roll is needed, specify: ROLL [stat] DC [number]

Consider the party dynamics and individual character traits. Keep the tone engaging and true to the world's theme.
    `;
  }

  private buildPartyPrompt(
    playerCharacter: Character,
    world: World,
    count: number
  ): string {
    return `
Create ${count} party members to accompany this player character in ${world.name}:

Player Character: ${playerCharacter.name} (${playerCharacter.race} ${playerCharacter.class})

Requirements:
- Balance the party (need different roles: tank, healer, damage, utility)
- Each character should have: name, race, class, personality, quirk, and brief backstory
- Characters should fit the world theme: ${world.theme}
- Avoid duplicating the player's race/class combination

Format as JSON array with this structure:
[
  {
    "name": "Character Name",
    "race": "Race",
    "class": "Class", 
    "personality": "Personality",
    "quirk": "Quirk",
    "backstory": "Brief backstory"
  }
]
    `;
  }

  private buildQuestPrompt(
    world: World,
    party: Character[],
    questType: 'main' | 'side'
  ): string {
    const partyComposition = party.map(p => `${p.name} (${p.race} ${p.class})`).join(', ');
    
    return `
Generate a ${questType} quest for this D&D party in ${world.name}:

WORLD: ${world.description}
PARTY: ${partyComposition}
PLOT HOOK: ${world.plotHook}

Create a quest with:
- Title (short, engaging)
- Description (what needs to be done)
- Difficulty Class (8-20)

Format as:
TITLE: [Quest Title]
DESCRIPTION: [Quest Description]
DC: [Difficulty Class Number]
    `;
  }

  private buildEventPrompt(
    world: World,
    party: Character[],
    narrative: string[]
  ): string {
    const recentEvents = narrative.slice(-5).join('\n');
    const partyComposition = party.map(p => `${p.name} (${p.race} ${p.class})`).join(', ');
    
    return `
Generate a story event for this D&D party in ${world.name}:

WORLD: ${world.description}
PARTY: ${partyComposition}
RECENT EVENTS: ${recentEvents}

Create an event with:
- A situation the party encounters
- 2-3 possible choices for how to respond

Format as:
EVENT: [Description of what happens]
CHOICE1: [First option]
CHOICE2: [Second option]
CHOICE3: [Third option (optional)]
    `;
  }

  private getSystemPrompt(): string {
    return `
You are an expert Dungeon Master for Dungeons & Dragons 5th Edition. You excel at:
- Creating immersive, engaging narratives
- Responding to player actions with consequences and opportunities
- Maintaining consistent world-building and character interactions
- Suggesting appropriate dice rolls and skill checks
- Balancing challenge with fun
- Using vivid, descriptive language that brings scenes to life

Always maintain the fantasy medieval tone and encourage creative problem-solving.
    `;
  }

  private getEnhancedSystemPrompt(): string {
    return `
You are a master Dungeon Master for D&D 5e with these specialties:
- Rich, immersive storytelling that brings scenes to life
- Balancing challenge with fun and narrative satisfaction  
- Incorporating each party member's personality and abilities
- Creating meaningful consequences for player choices
- Suggesting appropriate skill checks and combat encounters
- Maintaining consistency with established world lore and rules
- Encouraging creative problem-solving and roleplay

Your responses should:
- Be 2-4 sentences of vivid description
- Include party member reactions when relevant
- Suggest dice rolls naturally (format: ROLL [STAT] DC [number])
- Advance the story while giving players agency
- Match the world's tone and atmosphere
    `;
  }

  private parseAIResponse(aiText: string): AIResponse {
    // Parse the AI response and extract suggestions for dice rolls if mentioned
    const diceRollRegex = /(?:roll|check|DC)\s*(\d+)/i;
    const match = aiText.match(diceRollRegex);
    
    const response: AIResponse = {
      narrative: aiText
    };

    if (match) {
      const dc = parseInt(match[1]);
      response.diceRollRequired = {
        type: 'd20',
        difficultyClass: dc,
        stat: 'dexterity' // Default, could be parsed more intelligently
      };
    }

    return response;
  }

  private parseEnhancedAIResponse(aiText: string): AIResponse {
    const rollMatch = aiText.match(/ROLL\s+(\w+)\s+DC\s+(\d+)/i);
    
    // Clean the response of any system commands
    const cleanedText = aiText.replace(/ROLL\s+\w+\s+DC\s+\d+/gi, '').trim();
    
    const response: AIResponse = {
      narrative: cleanedText || 'The world responds to your action in unexpected ways...'
    };

    if (rollMatch) {
      const stat = rollMatch[1].toLowerCase();
      const dc = parseInt(rollMatch[2]);
      
      // Map common stat variations to proper stat names
      const statMap: { [key: string]: keyof Stats } = {
        'str': 'strength',
        'dex': 'dexterity', 
        'con': 'constitution',
        'int': 'intelligence',
        'wis': 'wisdom',
        'cha': 'charisma',
        'strength': 'strength',
        'dexterity': 'dexterity',
        'constitution': 'constitution',
        'intelligence': 'intelligence',
        'wisdom': 'wisdom',
        'charisma': 'charisma'
      };

      const mappedStat = statMap[stat] || 'dexterity';
      
      response.diceRollRequired = {
        type: 'd20',
        difficultyClass: dc,
        stat: mappedStat
      };
    }

    return response;
  }

  private parsePartyResponse(aiText: string): Character[] | null {
    try {
      // Try to extract JSON from the response
      const jsonMatch = aiText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const partyData = JSON.parse(jsonMatch[0]);
        return partyData.map((member: any, index: number) => ({
          id: `party-member-${index}`,
          name: member.name,
          race: member.race,
          class: member.class,
          level: 1,
          stats: this.generateBalancedStats(),
          personality: member.personality,
          quirk: member.quirk,
          backstory: member.backstory,
          isPlayer: false
        }));
      }
    } catch (error) {
      console.error('Failed to parse party response:', error);
    }
    return null;
  }

  private parseQuestResponse(questText: string, _world: World, questType: 'main' | 'side'): Quest | null {
    try {
      const titleMatch = questText.match(/TITLE:\s*(.+)/i);
      const descriptionMatch = questText.match(/DESCRIPTION:\s*(.+)/i);
      const dcMatch = questText.match(/DC:\s*(\d+)/i);

      if (titleMatch && descriptionMatch) {
        return {
          id: `quest-${Date.now()}`,
          title: titleMatch[1].trim(),
          description: descriptionMatch[1].trim(),
          type: questType,
          status: 'active',
          difficultyClass: dcMatch ? parseInt(dcMatch[1]) : 12
        };
      }
    } catch (error) {
      console.error('Failed to parse quest response:', error);
    }
    return null;
  }

  private parseEventResponse(eventText: string): { event: string; choices: string[] } | null {
    try {
      const eventMatch = eventText.match(/EVENT:\s*(.+)/i);
      const choice1Match = eventText.match(/CHOICE1:\s*(.+)/i);
      const choice2Match = eventText.match(/CHOICE2:\s*(.+)/i);
      const choice3Match = eventText.match(/CHOICE3:\s*(.+)/i);

      if (eventMatch && choice1Match && choice2Match) {
        const choices = [choice1Match[1].trim(), choice2Match[1].trim()];
        if (choice3Match) {
          choices.push(choice3Match[1].trim());
        }

        return {
          event: eventMatch[1].trim(),
          choices
        };
      }
    } catch (error) {
      console.error('Failed to parse event response:', error);
    }
    return null;
  }

  private generateBalancedStats() {
    // Generate balanced stats for AI party members
    const stats = {
      strength: 8 + Math.floor(Math.random() * 8),
      dexterity: 8 + Math.floor(Math.random() * 8),
      constitution: 8 + Math.floor(Math.random() * 8),
      intelligence: 8 + Math.floor(Math.random() * 8),
      wisdom: 8 + Math.floor(Math.random() * 8),
      charisma: 8 + Math.floor(Math.random() * 8)
    };
    return stats;
  }

  // Fallback responses when AI is not available
  private getFallbackResponse(
    playerAction: string,
    character: Character,
    world: World
  ): AIResponse {
    const responses = [
      `As ${character.name} ${playerAction.toLowerCase()}, the ancient magic of ${world.name} seems to respond. The air shimmers with possibility...`,
      `Your action echoes through the mystical realm. The ${character.race} ${character.class}'s ${character.personality} nature guides the outcome...`,
      `The ${world.name} holds many secrets. Your bold action might reveal one of them. Roll a d20 to see what happens!`,
      `The world watches as you act. Your ${character.quirk} might play a role in what comes next...`
    ];

    return {
      narrative: responses[Math.floor(Math.random() * responses.length)],
      suggestedActions: ['Investigate further', 'Be cautious', 'Take a different approach']
    };
  }

  private getEnhancedFallbackResponse(
    playerAction: string,
    character: Character,
    party: Character[],
    world: World,
    currentQuest?: Quest
  ): AIResponse {
    const partySize = party.length;
    const hasQuest = currentQuest ? true : false;
    
    const contextualResponses = [
      `As ${character.name} ${playerAction.toLowerCase()}, the party of ${partySize} watches intently. The ${world.theme} atmosphere of ${world.name} adds weight to every decision.`,
      `Your ${character.personality} nature guides you as you ${playerAction.toLowerCase()}. The other party members ${hasQuest ? 'consider how this affects your quest' : 'await the outcome with interest'}.`,
      `The mystical energies of ${world.name} respond to your action. ${character.quirk} becomes particularly relevant as events unfold.`,
      `As the party's ${character.class}, your action carries special significance. The ${world.theme} setting creates new possibilities.`
    ];

    const selectedResponse = contextualResponses[Math.floor(Math.random() * contextualResponses.length)];
    
    return {
      narrative: selectedResponse,
      suggestedActions: [
        'Investigate the results',
        'Consult with party members', 
        'Proceed with caution',
        'Take a different approach'
      ]
    };
  }

  private getFallbackParty(
    _playerCharacter: Character,
    _world: World,
    count: number
  ): Character[] {
    const fallbackMembers = [
      {
        name: 'Thorin Ironbeard',
        race: 'Dwarf' as const,
        class: 'Cleric' as const,
        personality: 'Loyal' as const,
        quirk: 'Keeps detailed journal' as const,
        backstory: 'A wise cleric seeking to restore ancient temples.'
      },
      {
        name: 'Lyralei Swiftarrow',
        race: 'Elf' as const,
        class: 'Ranger' as const,
        personality: 'Cautious' as const,
        quirk: 'Talks to weapon' as const,
        backstory: 'A skilled tracker with a mysterious past.'
      },
      {
        name: 'Finn Lightfinger',
        race: 'Halfling' as const,
        class: 'Rogue' as const,
        personality: 'Witty' as const,
        quirk: 'Always tries to barter' as const,
        backstory: 'A charming rogue with a heart of gold.'
      }
    ];

    return fallbackMembers.slice(0, count).map((member, index) => ({
      id: `party-member-${index}`,
      name: member.name,
      race: member.race,
      class: member.class,
      level: 1,
      stats: this.generateBalancedStats(),
      personality: member.personality,
      quirk: member.quirk,
      backstory: member.backstory,
      isPlayer: false
    }));
  }

  private getFallbackQuest(_world: World, questType: 'main' | 'side'): Quest {
    const quests = {
      main: [
        {
          title: 'The Ancient Prophecy',
          description: 'Uncover the truth behind an ancient prophecy that threatens the realm.',
          difficultyClass: 15
        },
        {
          title: 'The Lost Crown',
          description: 'Retrieve the stolen crown from the depths of the shadow realm.',
          difficultyClass: 18
        }
      ],
      side: [
        {
          title: 'The Missing Merchant',
          description: 'Find the merchant who disappeared on the old forest road.',
          difficultyClass: 10
        },
        {
          title: 'Goblin Trouble',
          description: 'Clear out the goblin nest that is threatening local farmers.',
          difficultyClass: 8
        }
      ]
    };

    const selectedQuests = quests[questType];
    const randomQuest = selectedQuests[Math.floor(Math.random() * selectedQuests.length)];

    return {
      id: `quest-${Date.now()}`,
      title: randomQuest.title,
      description: randomQuest.description,
      type: questType,
      status: 'active',
      difficultyClass: randomQuest.difficultyClass
    };
  }

  private getFallbackEvent(_world: World): { event: string; choices: string[] } {
    const events = [
      {
        event: 'You encounter a mysterious traveler at the crossroads who offers to trade information.',
        choices: [
          'Accept the trade and listen to what they have to say',
          'Politely decline and continue on your path',
          'Question them about their true intentions'
        ]
      },
      {
        event: 'A sudden storm forces your party to seek shelter in an abandoned inn.',
        choices: [
          'Explore the inn to see if anyone else is there',
          'Set up camp in the main room and wait for the storm to pass',
          'Search for alternative shelter nearby'
        ]
      },
      {
        event: 'You discover ancient runes carved into a stone monolith.',
        choices: [
          'Try to decipher the meaning of the runes',
          'Touch the stone to see if anything happens',
          'Leave the monolith undisturbed and move on'
        ]
      }
    ];

    return events[Math.floor(Math.random() * events.length)];
  }
}

// Export a singleton instance
export const aiService = new AIService();
