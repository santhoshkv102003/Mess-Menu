const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { exec } = require('child_process');
const util = require('util');

dotenv.config();

const execPromise = util.promisify(exec);

const runScript = async (scriptName) => {
    console.log(`\n>>> Running ${scriptName}...`);
    try {
        const { stdout, stderr } = await execPromise(`node ${scriptName}`);
        console.log(stdout);
        if (stderr) console.error(stderr);
    } catch (error) {
        console.error(`Error running ${scriptName}:`, error);
        process.exit(1);
    }
};

const seedFull = async () => {
    // 1. Basic Seed (Food Items)
    await runScript('seed.js');

    // 2. Restore Images (General)
    await runScript('restore_all_images.js');

    // 3. Fix Missing/Fuzzy Images
    await runScript('fix_missing_fuzzy.js');

    // 4. Fix Specific Manual Items
    await runScript('fix_remaining_2.js');

    // 5. Fix Redirects/Links (Upma/Fried Rice mismatched)
    await runScript('fix_links.js');

    // 6. Update Diet Type (Veg/Non-Veg)
    await runScript('update_diet_type.js');

    // 7. Generate Menu
    await runScript('seed_menu.js');

    // 8. Ensure Upma in Menu
    await runScript('ensure_upma.js');

    console.log('\n>>> Full Population Complete!');
};

seedFull();
