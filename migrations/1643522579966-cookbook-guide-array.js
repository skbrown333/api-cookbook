const { CookbookModel } = require('../dist/src/models/Cookbook/cookbook.model');
const { GuideModel } = require('../dist/src/models/Guide/guide.model');

/**
 * Make any changes you need to make to the database here
 */
async function up() {
  // Write migration here
  const cookbooks = await this('cookbook').find();
  for (let i = 0; i < cookbooks.length; i++) {
    const cookbook = cookbooks[i];
    const guides = await this('guide').find({ cookbook: cookbook._id });

    if (!guides || !guides.length) {
      continue;
    }

    cookbook.guides = guides.map((guide) => guide._id);
    await cookbook.save();
  }
}

/**
 * Make any changes that UNDO the up function side effects here (if possible)
 */
async function down() {
  // Write migration here
}

module.exports = { up, down };
