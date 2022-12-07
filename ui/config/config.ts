import MonacoEditorWebpackPlugin from "monaco-editor-webpack-plugin";
import { defineConfig } from "umi";
import defaultSettings from "./defaultSettings";
import proxy from "./proxy";
import routes from "./routes";

const { REACT_APP_ENV } = process.env;

export default defineConfig({
  define: {
    "process.env.PUBLIC_PATH": process.env.PUBLIC_PATH || "/",
  },
  hash: true,
  publicPath: process.env.PUBLIC_PATH || "/",
  base: process.env.PUBLIC_PATH || "/",
  antd: {},
  dva: {},
  layout: {
    locale: true,
    siderWidth: 208,
    ...defaultSettings,
    title: "UmiJS",
  },
  locale: {
    antd: true,
    baseNavigator: true,
    default: "zh-CN",
  },
  targets: {
    chrome: 79,
  },
  routes,
  theme: {
    "primary-color": "hsl(21, 85%, 56%)",
    "border-radius-base": "8px",
  },
  fastRefresh: true,
  title: "",
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || "dev"],
  manifest: {
    basePath: "/",
  },
  mock: {
    include: ["src/pages/**/_mock.ts"],
  },
  model: {},
  request: {},
  initialState: {},
  exportStatic: {},
  codeSplitting: {
    jsStrategy: "granularChunks",
  },
  chainWebpack: (config) => {
    config.plugin("monaco-editor").use(MonacoEditorWebpackPlugin, [
      {
        languages: ["json", "ini", "yaml", "sb", "sql", "mysql"],
        features: [
          "coreCommands",
          "find",
          "comment",
          "format",
          "bracketMatching",
          "wordOperations",
          "suggest",
          "multicursor",
          "links",
        ],
      },
    ]);
    return config;
  },
});
