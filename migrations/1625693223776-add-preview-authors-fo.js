const { CookbookModel } = require('../dist/src/models/Cookbook/cookbook.model');
/**
 * Make any changes you need to make to the database here
 */
async function up() {
  // Write migration here
  await this('cookbook').updateMany({}, [
    { $set: { preview: true, show_authors: true } },
  ]);
}

/**
 * Make any changes that UNDO the up function side effects here (if possible)
 */
async function down() {
  // Write migration here
  await this('cookbook').updateMany(
    {},
    { $unset: { preview: {}, show_authors: {} } },
  );
}

module.exports = { up, down };
