const { GuideModel } = require('../dist/src/models/Guide/guide.model');
/**
 * Make any changes you need to make to the database here
 */
async function up() {
  // Write migration here
  await this('guide').updateMany({}, [
    { $set: { slug: { $toString: '$_id' } } },
  ]);
}

/**
 * Make any changes that UNDO the up function side effects here (if possible)
 */
async function down() {
  // Write migration here
  await this('guide').updateMany({}, { $unset: { slug: {} } });
}

module.exports = { up, down };
