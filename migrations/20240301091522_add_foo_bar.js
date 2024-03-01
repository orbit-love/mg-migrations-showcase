import { withinWriteTransaction } from "../src/memgraph/index.js";
import cypher from "../src/memgraph/cypher.js";

export default {
  desc: "Add a FooBar node as an example.",
  async up() {
    await withinWriteTransaction(async (tx) => {
      await tx.run(cypher`MERGE (f:FooBar { name: 'foo bar' })`);
    });
  },
  async down() {
    await withinWriteTransaction(async (tx) => {
      await tx.run(
        cypher`MATCH (f:FooBar { name: 'foo bar' }) DETACH DELETE f`
      );
    });
  },
};
