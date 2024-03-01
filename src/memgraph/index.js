import neo4j from "neo4j-driver";

export const memgraphConnection = neo4j.driver(
  process.env.MEMGRAPH_URI,
  neo4j.auth.basic(process.env.MEMGRAPH_USERNAME, process.env.MEMGRAPH_PASSWORD)
);

// Use to batch multiple writes together
export const withinWriteTransaction = async (operation) => {
  const session = memgraphConnection.session();

  try {
    return await session.executeWrite(async (tx) => await operation(tx), { timeout: 20_000 });
  } finally {
    await session.close();
  }
};


// Convenient way to use a session without worrying about closing it
export const withinSession = async (operation) => {
  const session = memgraphConnection.session();

  try {
    return await operation(session);
  } finally {
    await session.close();
  }
};
