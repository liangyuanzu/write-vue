module.exports = {
  create: {
    alias: "c",
    description: "create a new project powered by vue-cli-service",
    example: "lue-cli create <app-name>",
  },
  add: {
    alias: "a",
    description: "install a plugin and invoke its generator in an already created project",
    example: "lue-cli add [options] <plugin> [pluginOptions]",
  },
  "*": {
    alias: "",
    description: "",
    example: "",
  },
};
