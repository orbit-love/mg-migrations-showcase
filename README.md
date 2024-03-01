# Memgraph Migrations Showcase

## Tasks

Tasks are defined under the `tasks` directory. You can create a task at any nesting level and run it with:

```
yarn task path:to:task --arg1=1 --arg2=2
```

For instance

```sh
yarn task examples:echo --foo=bar --baz=3
```

Should print out the arguments

To create your own task, simply follow the same pattern as `./tasks/examples/echo.js`.

## Migrations

Migrations are controlled by a set of 3 tasks

### Generate

```sh
yarn task migrate:new --name my_new_migration
```

This task will create a new timestamped file under `./migrations`, with the following content

```js
export default {
  desc: "Generated migration",
  async up() {},
  async down() {},
};
```

You'll just have to fill the `desc` field, as well as the `up` and `down` functions. Always keep in mind performance when doing so. If you are performing multiple writes at once, it's a good idea to batch them in a transaction.

```sh
yarn task migrate:up
```

It'll check in the graph DB a `Version` node and try to run the `up` methods of the migrations added after said version.

### Revert

```sh
yarn task migrate:down
```

It'll run the `down` method of the most recent migration and update the `Version` node
