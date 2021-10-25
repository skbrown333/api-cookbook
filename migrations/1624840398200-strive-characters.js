const {
  CharacterModel,
} = require('../dist/src/models/Character/character.model');
const { GameModel } = require('../dist/src/models/Game/game.model');
/**
 * Make any changes you need to make to the database here
 */

async function up() {
  const CHARACTERS = [
    ['axl', 'Axl'],
    ['chipp', 'Chipp'],
    ['faust', 'Faust'],
    ['giovanna', 'Giovanna'],
    ['ky', 'Ky'],
    ['leo', 'leo'],
    ['may', 'May'],
    ['millia', 'Millia'],
    ['nagoriyuki', 'Nagoriyuki'],
    ['potemkin', 'Potemkin'],
    ['ramlethal', 'Ramlethal'],
    ['sol', 'Sol'],
    ['zato', 'Zato'],
  ];
  // Write migration here
  let gameRes = await this('game').find({
    name: 'strive',
    display_name: 'Guilty Gear Strive',
    subdomain: 'strive',
  });
  if (!gameRes && !gameRes.length) {
    gameRes = await this('game').create({
      name: 'strive',
      display_name: 'Guilty Gear Strive',
      subdomain: 'strive',
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
