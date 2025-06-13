<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# AI-Powered D&D Web App - Copilot Instructions

This is a full-stack web application for an AI-powered Dungeons & Dragons game experience.

## Project Overview
- **Frontend**: React 18 with TypeScript and Vite
- **Styling**: Tailwind CSS with pixel art theme
- **Backend**: Node.js with Express.js (to be added)
- **Database**: Supabase (PostgreSQL)
- **AI Integration**: Grok API for AI Dungeon Master
- **Image Generation**: Stable Diffusion via Hugging Face API

## Key Features
1. **World Selection**: Choose from 10 predefined fantasy worlds
2. **Character Creation**: D&D-inspired character creation with races, classes, stats, personalities, and quirks
3. **AI Dungeon Master**: Dynamic storytelling and campaign management
4. **Dice Rolling**: Virtual dice with D&D mechanics
5. **Party Management**: AI-generated party members with balanced dynamics
6. **Pixel Art UI**: Retro 16-bit aesthetic with fantasy themes

## Code Style Guidelines
- Use TypeScript for type safety
- Follow React functional components with hooks
- Use Tailwind CSS for styling with custom pixel art theme
- Implement responsive design for mobile and desktop
- Use proper D&D terminology and mechanics
- Structure components modularly for maintainability

## Data Models
- World: fantasy settings with plot hooks
- Character: D&D stats, race, class, personality, quirks
- Party: balanced group of 4 characters
- Quest: main and side quests with difficulty classes
- Action: player inputs and dice roll results

## API Integration Notes
- Grok API for AI DM responses
- Stable Diffusion for world imagery
- Supabase for data persistence
- Proper error handling and rate limiting needed
