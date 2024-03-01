import fs from "fs";

const defaultContent = `
export default {
  desc: "Generated migration",
  async up() {},
  async down() {},
};
`;

export default {
  name: "migrate:gen",
  desc: "Generates a new migration",
  async run(args) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Cannot generate a migration in production");
    }

    const { name = "new_migration" } = args;

    const fullName = `./migrations/${getCurrentUTCTime()}_${name}.js`;

    console.log("== Generating", fullName);
    fs.writeFileSync(fullName, removeBlankLines(defaultContent));
  },
};

function removeBlankLines(str) {
  return str.replace(/^\s*\n/gm, "");
}

function getCurrentUTCTime() {
  const now = new Date();

  const year = now.getUTCFullYear();
  const month = (now.getUTCMonth() + 1).toString().padStart(2, "0");
  const day = now.getUTCDate().toString().padStart(2, "0");
  const hour = now.getUTCHours().toString().padStart(2, "0");
  const minute = now.getUTCMinutes().toString().padStart(2, "0");
  const second = now.getUTCSeconds().toString().padStart(2, "0");

  return `${year}${month}${day}${hour}${minute}${second}`;
}
