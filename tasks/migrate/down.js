import { updateVersion } from "../../src/memgraph/version.js";
import fg from "fast-glob";
import _ from "lodash";

export default {
  name: "migrate:down",
  desc: "Revert latest migration",
  async run() {
    const [previousMigration, lastMigration] = await checkMigrations();
    if (lastMigration) {
      console.log(`== Reverting ${lastMigration}`);
      await revertMigration(lastMigration);
      const key = previousMigration ? previousMigration[0] : "19700101000000";
      console.log(`== Updating the version to ${key}`);
      await updateVersion(key);
    } else {
      console.log("== No migration found.");
    }
  },
};

async function checkMigrations() {
  const migrationFiles = await fg.glob("./migrations/*.js");

  const versions = _.sortBy(
    migrationFiles.map((file) => [file.split("/")[2].split("_")[0], file]),
    (v) => v[0]
  );

  if (versions.length === 0) {
    return [null, null];
  }

  if (versions.length === 1) {
    return [null, versions[0]];
  }

  return _.takeRight(versions, 2);
}

async function revertMigration(migration) {
  const file = migration[1];
  console.log(`== Running down() of migration ${file}`);

  const m = (await import(`../../${file}`)).default;

  try {
    await m.down();
    console.log("=== Success!");
  } catch (e) {
    console.error("=== Failure!");
    throw e;
  }
}
