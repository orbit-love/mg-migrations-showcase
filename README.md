# Memgraph Migrations Showcase

## Running a task

Tasks are defined under the `tasks` directory

You can create a task at any nesting level and run it with:

```
yarn task path:to:task --arg1=1 --arg2=2
```

For instance

```sh
yarn task examples:echo --foo=bar --baz=3
```

Should print out the arguments

To create your own task, simply follow the same pattern as the example one.

## Migrations

Migrations are controlled by a set of 3 tasks

### Generate

```sh
yarn task migrate:gen --name my_new_migration
```

### Run

```sh
yarn task migrate:up
```

It'll check in the graph DB a `Version` node and try to run the `up` methods of the migrations added after said version.

### Revert

```sh
yarn task migrate:down
```

It'll run the `down` method of the most recent migration and update the `Version` node
