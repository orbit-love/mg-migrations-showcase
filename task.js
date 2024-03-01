import "dotenv/config";
import yargs from "yargs";
import _ from "lodash";
import { hideBin } from "yargs/helpers";

const argv = yargs(hideBin(process.argv)).argv;

if (!argv._) {
  throw new Error("No task provided");
}

const name = argv._[0].replace(/\:/g, "/");

const scriptModule = await import(`./tasks/${name}.js`);
const script = scriptModule.default;

if (!script) {
  throw new Error("Undefined task");
}

const args = _.omit(argv, ["_", "$0"]);

if (script.requiredArgs) {
  for (const argName of script.requiredArgs) {
    if (!(argName in args)) {
      console.log("Required args are:", script.requiredArgs);
      throw new Error(`Argument missing: ${argName}`);
    }
  }
}

console.log("Running", script.name);
console.log(script.desc);
await script.run(args);

process.exit(0);
