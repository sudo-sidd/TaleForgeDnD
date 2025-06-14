# AI-Powered D&D Web App

A full-stack web application for an immersive AI-powered Dungeons & Dragons experience with pixel art UI and classic D&D mechanics.

## 🎮 Current Features

### ✅ Core Game Flow
- **World Selection**: Choose from 10 unique fantasy worlds with rich lore
- **Character Creation**: Full D&D-inspired character creator with races, classes, stats, personalities, and quirks
- **Party Generation**: AI-powered party member creation with balanced team dynamics
- **Dynamic Gameplay**: Interactive storytelling with AI Dungeon Master responses

### ✅ D&D Mechanics
- **Dice Rolling System**: Support for all D&D dice (d4, d6, d8, d10, d12, d20, d100)
- **Stat Checks**: Quick stat check buttons with difficulty classes
- **Character Stats**: Point-buy and random stat allocation systems
- **Party Management**: Track multiple party members with individual stats

### ✅ AI Integration
- **AI Dungeon Master**: Dynamic story responses using Grok API (with fallback)
- **Quest Generation**: AI-generated main and side quests
- **Story Events**: Random encounter generation with multiple choice responses
- **Party AI**: AI-suggested party member responses based on personality

### ✅ User Interface
- **Pixel Art Theme**: Retro 16-bit aesthetic with fantasy elements
- **Responsive Design**: Works on desktop and mobile devices
- **Interactive Components**: Rich UI with animations and feedback
- **Adventure Log**: Comprehensive narrative tracking system

### ✅ Advanced Features
- **Party Interaction Panel**: Let party members contribute to discussions
- **Quest Management**: Dynamic quest tracking and completion system
- **Story Event Manager**: Random encounters with meaningful choices
- **Game Statistics**: Track playtime, actions, dice rolls, and progress
- **Enhanced AI Prompts**: Context-aware responses considering party and quest state

## Tech Stack

- **Frontend**: React 18 with TypeScript and Vite
- **Styling**: Tailwind CSS with custom pixel art theme
- **Backend**: Node.js with Express.js (to be implemented)
- **Database**: Supabase (PostgreSQL) (to be implemented)
- **AI Integration**: Grok API for AI DM (to be implemented)
- **Image Generation**: Stable Diffusion via Hugging Face API (to be implemented)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open your browser to `http://localhost:5173`

## Development Phases

### Phase 1: MVP (Current)

- [X] Project setup and basic structure
- [X] World selection with static data
- [X] Character creation system
- [X] Basic UI with pixel art styling
- [ ] Dice rolling mechanics
- [ ] AI integration (Grok API)

### Phase 2: Enhanced Gameplay

- [ ] AI-generated party members
- [ ] Dynamic world images
- [ ] Free-form player actions
- [ ] Advanced UI animations

### Phase 3: Polish and Scale

- [ ] Side quests and expanded AI DM
- [ ] Enhanced pixel art assets
- [ ] Performance optimization
- [ ] Accessibility improvements
