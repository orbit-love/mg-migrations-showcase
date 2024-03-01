// Basic template litteral that mimics the default behavior of simple backticks
// The goal is to get syntax highlights when used in vscode
export default function cypher(strings, ...values) {
  let result = "";
  for (let i = 0; i < values.length; i++) {
    result += strings[i];
    result += values[i];
  }
  result += strings[strings.length - 1];
  return result;
}
