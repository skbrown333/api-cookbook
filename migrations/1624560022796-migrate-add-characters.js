const {
  CharacterModel,
} = require('../dist/src/models/Character/character.model');
const { GameModel } = require('../dist/src/models/Game/game.model');
/**
 * Make any changes you need to make to the database here
 */
async function up() {
  const CHARACTERS = [
    ['bowser', 'Bowser'],
    ['donkey_kong', 'Donkey Kong'],
    ['dr_mario', 'Dr. Mario'],
    ['falco', 'Falco'],
    ['falcon', 'Falcon'],
    ['fox', 'Fox'],
    ['game_and_watch', 'Game & Watch'],
    ['ganon', 'Ganondorf'],
    ['ice_climbers', 'Ice Climbers'],
    ['jiggly_puff', 'Jigglypuff'],
    ['kirby', 'Kirby'],
    ['link', 'Link'],
    ['luigi', 'Luigi'],
    ['mario', 'Mario'],
    ['marth', 'Marth'],
    ['mew_two', 'Mewtwo'],
    ['ness', 'Ness'],
    ['peach', 'Peach'],
    ['pichu', 'Pichu'],
    ['pikachu', 'Pikachu'],
    ['roy', 'Roy'],
    ['samus', 'Samus'],
    ['sheik', 'Sheik'],
    ['yoshi', 'Yoshi'],
    ['young_link', 'Young Link'],
    ['zelda', 'Zelda'],
    ['wireframe', 'Wireframe'],
    ['sandbag', 'sandbag'],
  ];
  // Write migration here
  let gameRes = await this('game').find({ name: 'melee' });
  if (!gameRes && !gameRes.length) {
    gameRes = await this('game').create({
      name: 'melee',
      display_name: 'Super Smash Bros. Melee',
      subdomain: 'melee',
    });
  }
  const gameId = gameRes && gameRes.length ? gameRes[0]._id : gameRes._id;
  for (let i = 0; i < CHARACTERS.length; i++) {
    const char = CHARACTERS[i];
    const character_ref = await this('character').find({ name: char[0] });
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
