const {
  CharacterModel,
} = require('../dist/src/models/Character/character.model');
const { GameModel } = require('../dist/src/models/Game/game.model');
/**
 * Make any changes you need to make to the database here
 */

async function up() {
  const CHARACTERS = [
    ['banjo', 'Banjo & Kazooie'],
    ['bowser_jr', 'Bowser Jr.'],
    ['bowser', 'Bowser'],
    ['byleth', 'Byleth'],
    ['chrom', 'Chrom'],
    ['cloud', 'Cloud'],
    ['corrin', 'Corrin'],
    ['daisy', 'Daisy'],
    ['dark_pit', 'Dark Pit'],
    ['dark_samus', 'Dark Samus'],
    ['diddy_kong', 'Diddy Kong'],
    ['donkey_kong', 'Donkey Kong'],
    ['dr_mario', 'Dr. Mario'],
    ['duck_hunt', 'Duck Hunt'],
    ['falco', 'Falco'],
    ['falcon', 'Falcon'],
    ['fox', 'Fox'],
    ['game_and_watch', 'Game & Watch'],
    ['ganon', 'Ganondorf'],
    ['greninja', 'Greninja'],
    ['hero', 'Hero'],
    ['ice_climbers', 'Ice Climbers'],
    ['ike', 'Ike'],
    ['incineroar', 'Inceneroar'],
    ['inkling', 'Inkling'],
    ['isabelle', 'Isabelle'],
    ['jigglypuff', 'Jigglypuff'],
    ['joker', 'Joker'],
    ['ken', 'Ken'],
    ['king_dedede', 'King Dedede'],
    ['king_k_rool', 'King K Rool'],
    ['kirby', 'Kirby'],
    ['link', 'Link'],
    ['little_mac', 'Little Mac'],
    ['lucario', 'Lucario'],
    ['lucas', 'Lucas'],
    ['lucina', 'Lucina'],
    ['luigi', 'Luigi'],
    ['mario', 'Mario'],
    ['marth', 'Marth'],
    ['mega_man', 'Mega Man'],
    ['meta_knight', 'Meta Knight'],
    ['mewtwo', 'Mewtwo'],
    ['mii', 'Mii Fighter'],
    ['min_min', 'Min Min'],
    ['ness', 'Ness'],
    ['olimar', 'Olimar'],
    ['pac_man', 'Pac-Man'],
    ['palutena', 'Palutena'],
    ['peach', 'Peach'],
    ['pichu', 'Pichu'],
    ['pikachu', 'Pikachu'],
    ['piranha_plant', 'Piranha Plant'],
    ['pit', 'Pit'],
    ['pokemon_trainer', 'Pokemon Trainer'],
    ['pyra', 'Pyra'],
    ['richter', 'Richter'],
    ['ridley', 'Ridley'],
    ['rob', 'R.O.B.'],
    ['robin', 'Robin'],
    ['rosalina', 'Rosalina'],
    ['ryu', 'Ryu'],
    ['roy', 'Roy'],
    ['samus', 'Samus'],
    ['sephiroth', 'Sephiroth'],
    ['sheik', 'Sheik'],
    ['shulk', 'Shulk'],
    ['simon', 'Simon'],
    ['snake', 'Snake'],
    ['sonic', 'Sonic'],
    ['steve', 'Steve'],
    ['terry', 'Terry'],
    ['toon_link', 'Toon Link'],
    ['villager', 'Villager'],
    ['wario', 'Wario'],
    ['wii_fit_trainer', 'Wii Fit Trainer'],
    ['wolf', 'Wolf'],
    ['yoshi', 'Yoshi'],
    ['young_link', 'Young Link'],
    ['zelda', 'Zelda'],
    ['zero_suit_samus', 'Zero Suit Samus'],
  ];
  // Write migration here
  const gameRes = await this('game').find({ name: 'ultimate' });
  const gameId = gameRes[0]._id;
  for (let i = 0; i < CHARACTERS.length; i++) {
    const char = CHARACTERS[i];
    const character_ref = await this('character').find({
      name: char[0],
      game: gameId,
    });
    if (character_ref.length < 1) {
      await this('character').create({
        name: char[0],
        display_name: char[1],
        game: gameId,
      });
    }
  }
}

/**
 * Make any changes that UNDO the up function side effects here (if possible)
 */
async function down() {
  // Write migration here
}

module.exports = { up, down };
