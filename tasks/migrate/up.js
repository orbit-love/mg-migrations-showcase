import fg from "fast-glob";

import _ from "lodash";
import { getCurrentVersion, updateVersion } from "../../src/memgraph/version.js";

export default {
  name: "migrate:up",
  desc: "Run migrations against the graph DB",
  async run() {
    const pendingVersions = await checkMigrations();
    if (pendingVersions.length) {
      console.log(`== Found ${pendingVersions.length} pending migrations`);
      await runMigrations(pendingVersions);
    } else {
      console.log("== No pending migration found.");
    }
  },
};


async function checkMigrations() {
  const migrationFiles = await fg.glob("./migrations/*.js");

  const versions = _.sortBy(
    migrationFiles.map((file) => [file.split("/")[2].split("_")[0], file]),
    (v) => v[0]
  );

  const currentVersion = (await getCurrentVersion()) || "19700101000000";

  const pendingVersions = _.takeRightWhile(versions, (v) => v[0] > currentVersion);

  return pendingVersions;
}

async function runMigrations(pendingVersions) {
  for (const pendingVersion of pendingVersions) {
    const key = pendingVersion[0];
    const file = pendingVersion[1];
    console.log(`== Running migration ${file}`);

    const m = (await import(`../../${file}`)).default;

    try {
      await m.up();
      console.log("=== Success!");
    } catch (e) {
      console.error("=== Failure!");
      console.error(e);
      console.log(e.stack);
      break;
    }

    try {
      await updateVersion(key);
      console.log("=== Version key updated");
    } catch (e) {
      console.error("=== Failed to update the version number");
      console.error(e);
      if (m.down) {
        console.log("=== Attempting to manually revert the migration");
        await m.down();
      }
      break;
    }
  }
}

