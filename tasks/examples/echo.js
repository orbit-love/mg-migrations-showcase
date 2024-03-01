export default {
  name: "examples:echo",
  desc: "Just an example, echoes the args. Run with yarn task examples:echo --foo=bar",
  async run(args) {
    console.log(args);
  },
};
