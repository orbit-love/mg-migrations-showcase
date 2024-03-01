import { withinSession, withinWriteTransaction } from "./index.js";
import cypher from "./cypher.js";

export async function getCurrentVersion() {
  const { records } = await withinSession(
    async (s) =>
      await s.run(cypher`MATCH (v:Version) RETURN v.key as key LIMIT 1`)
  );
  return records[0]?.get("key");
}

export async function updateVersion(key) {
  await withinWriteTransaction(
    async (tx) =>
      await tx.run(cypher`MERGE (v:Version) SET v.key = $key`, { key })
  );
}
