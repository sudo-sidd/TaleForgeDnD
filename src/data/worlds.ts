import type { World } from '../types/game';

export const FANTASY_WORLDS: World[] = [
  {
    id: 'shattered-isles',
    name: 'The Shattered Isles',
    description: 'A tropical archipelago of floating islands suspended by ancient magic, surrounded by stormy seas and glowing coral reefs.',
    inhabitants: 'Merfolk traders, sky-pirate humans, and sentient storm elementals. Ruled by the Coral Queen, a merfolk sorceress.',
    backstory: 'The isles were once a single continent, shattered by a forgotten god\'s wrath. Ancient ruins hold clues to restoring the land.',
    plotHook: 'The Coral Queen seeks adventurers to recover a lost relic from a sunken ruin, but sky pirates and a rogue elemental conspire to claim it.',
    theme: 'tropical-magical'
  },
  {
    id: 'emberfall',
    name: 'Emberfall',
    description: 'A volcanic wasteland dotted with ash-choked cities and glowing lava rivers, illuminated by a crimson sky.',
    inhabitants: 'Fire-resistant dwarves, ashkin nomads, and draconic beasts. Governed by the Ember Council, a group of dwarven smiths.',
    backstory: 'A cataclysmic eruption buried the old empire, leaving survivors to rebuild amid constant volcanic threats.',
    plotHook: 'A mysterious ashkin prophet foretells a second eruption unless a sacred forge is relit in the heart of a volcano.',
    theme: 'volcanic-apocalyptic'
  },
  {
    id: 'verdant-hollow',
    name: 'Verdant Hollow',
    description: 'A lush forest realm where colossal trees form natural cities, connected by vine bridges and glowing mushrooms.',
    inhabitants: 'Wood elves, treant guardians, and mischievous fey. Guided by the Elder Grove, a council of ancient treants.',
    backstory: 'The forest was once a battlefield for gods, leaving behind magical seeds that birthed the great trees.',
    plotHook: 'A blight is spreading, corrupting the trees. The Elder Grove tasks adventurers with finding its source in a fey-haunted glade.',
    theme: 'mystical-forest'
  },
  {
    id: 'crystal-veil',
    name: 'The Crystal Veil',
    description: 'A frozen tundra where crystalline spires refract auroras, hiding ancient ruins beneath the ice.',
    inhabitants: 'Frost giants, ice-elf scholars, and spectral wolves. Ruled by the Veil King, a reclusive giant mage.',
    backstory: 'The tundra was sealed by a magical veil to trap an ancient evil, but cracks are forming.',
    plotHook: 'The Veil King seeks heroes to investigate cracks in the crystal spires, uncovering a cult trying to free the trapped evil.',
    theme: 'arctic-mystical'
  },
  {
    id: 'starfall-expanse',
    name: 'Starfall Expanse',
    description: 'A desert of glass formed by a fallen star, dotted with nomadic camps and celestial ruins.',
    inhabitants: 'Nomadic gnomes, star-worshipping orcs, and sand elementals. Led by the Stargazer, a gnome oracle.',
    backstory: 'The star\'s fall brought magic to the desert, but also awakened a buried celestial beast.',
    plotHook: 'The Stargazer dreams of the beast stirring, sending adventurers to find a star-shard to pacify it.',
    theme: 'celestial-desert'
  },
  {
    id: 'ebon-depths',
    name: 'The Ebon Depths',
    description: 'A subterranean network of glowing caverns, filled with bioluminescent fungi and underground lakes.',
    inhabitants: 'Drow assassins, duergar miners, and sentient crystal spiders. Ruled by the Shadow Matron, a drow priestess.',
    backstory: 'The caverns were a refuge for exiles, but a dark ritual threatens to unleash an ancient horror.',
    plotHook: 'The Shadow Matron hires adventurers to stop a rogue drow from completing the ritual in a cursed cavern.',
    theme: 'underground-dark'
  },
  {
    id: 'skyhaven',
    name: 'Skyhaven',
    description: 'A realm of floating citadels above endless clouds, connected by magical skyships.',
    inhabitants: 'Aarakocra scouts, human artificers, and cloud dragons. Governed by the Sky Council, a mix of races.',
    backstory: 'The citadels were built to escape a flooded world below, but tensions rise over dwindling resources.',
    plotHook: 'A citadel is falling, and adventurers must find a lost sky crystal to restore its levitation magic.',
    theme: 'sky-floating'
  },
  {
    id: 'wailing-marshes',
    name: 'The Wailing Marshes',
    description: 'A misty swamp with twisted trees and ghostly lights, haunted by ancient spirits.',
    inhabitants: 'Lizardfolk shamans, will-o\'-wisp tricksters, and bog trolls. Led by the Marsh Oracle, a lizardfolk seer.',
    backstory: 'The marshes were cursed by a betrayed spirit, trapping souls in eternal unrest.',
    plotHook: 'The Marsh Oracle seeks heroes to appease the spirit by recovering its lost relic from a troll-infested ruin.',
    theme: 'haunted-swamp'
  },
  {
    id: 'ironcrag-mountains',
    name: 'Ironcrag Mountains',
    description: 'A rugged mountain range with fortified keeps and molten forges, scarred by ancient wars.',
    inhabitants: 'Goliath warriors, dwarf smiths, and fire drakes. Ruled by the Iron King, a goliath warlord.',
    backstory: 'The mountains were forged in a war between giants and dragons, leaving hidden armories.',
    plotHook: 'A drake-riding warband threatens the keeps, and the Iron King needs adventurers to find a legendary weapon.',
    theme: 'mountainous-warfare'
  },
  {
    id: 'twilight-enclave',
    name: 'The Twilight Enclave',
    description: 'A mystical forest where day and night coexist, with glowing flora and shadow creatures.',
    inhabitants: 'Halfling druids, shadow elves, and moon beasts. Guided by the Twilight Circle, a druidic council.',
    backstory: 'The enclave exists in a magical balance, but a shadow rift threatens to consume it.',
    plotHook: 'The Twilight Circle tasks adventurers with closing the rift by finding a moonstone in a beast-filled grove.',
    theme: 'twilight-mystical'
  }
];

export function getRandomWorlds(count: number = 3): World[] {
  const shuffled = [...FANTASY_WORLDS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
