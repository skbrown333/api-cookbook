const {
  CharacterModel,
} = require('../dist/src/models/Character/character.model');
const { PostModel } = require('../dist/src/models/Post/post.model');

/**
 * Make any changes you need to make to the database here
 */
async function up() {
  // Write migration here
  const posts = await this('post').find();
  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    const characters = await this('character').find({ name: post.character });

    if (!characters || !characters.length) {
      continue;
    }

    post.character = characters[0]._id;
    await post.save();
  }
}

/**
 * Make any changes that UNDO the up function side effects here (if possible)
 */
async function down() {
  // Write migration here
}

module.exports = { up, down };
