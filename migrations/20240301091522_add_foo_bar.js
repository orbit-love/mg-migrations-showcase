import { withinWriteTransaction } from "../src/memgraph/index.js";
import cypher from "../src/memgraph/cypher.js";

export default {
  desc: "Add FooBar node as an example. Although migrations can be useful, always keep in mind performance",
  async up() {
    // A good idea to run the graph mutations in a transaction
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
