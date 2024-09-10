module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
  },
  extends: ["plugin:vue/vue3-essential", "eslint:recommended"],
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@babel/eslint-parser",
    sourceType: "module",
    ecmaVersion: 2020,
    requireConfigFile: false,
  },
  rules: {
    "vue/multi-word-component-names": "off", // Parfois utile pour ignorer les erreurs sur les noms à un seul mot
  },
};
