// @ts-check

const {
  sessionMiddleware,
  unstable_simpleRolesIsAuthorized,
} = require("@blitzjs/server");
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
const withTranspiledModules = require("next-transpile-modules");

/**
 * `pirates` breaks `css-loader`
 * @see https://github.com/webpack/webpack/issues/1754#issuecomment-547750308
 */
require.extensions[".css"] = () => {
  return;
};

/**
 * @template T
 *
 * @param {T[]} arr1
 * @param {T[]} arr2
 */
const union = (arr1, arr2) => {
  const result = [...arr1];
  arr2.forEach((x) => {
    if (!result.includes(x)) {
      result.push(x);
    }
  });
  return result;
};

/**
 * @typedef {import("webpack").Configuration} Configuration
 * @typedef {import("webpack").RuleSetCondition} RuleSetCondition
 * @typedef {import("webpack").RuleSetConditions} RuleSetConditions

 * @typedef {Extract<import("webpack").RuleSetCondition, { include?: import("webpack").RuleSetCondition }>} RuleSetConditionObject
 */

/**
 * @type {{ issuer: RuleSetConditionObject }}
 */
let _cssRule;

/**
 * @param {Configuration} config
 * @param {(string | RegExp)[]} newCssPath
 */
function appendCSSPath(config, newCssPath) {
  if (!_cssRule) {
    /**
     * @param {RuleSetCondition} rsc
     * @returns {rsc is RuleSetConditionObject }
     */
    const isRuleSetConditionObject = (rsc) =>
      typeof rsc === "object" && !("test" in rsc) && !Array.isArray(rsc);

    _cssRule = config.module.rules
      .find((rule) => rule.oneOf)
      .oneOf.find(
        /**
         * @hack r is recursive and until we write DFS this code can crash on every nextjs or blitzjs update
         *
         * @returns {r is { issuer: RuleSetConditionObject }}
         */
        (r) => {
          if (
            r &&
            r.test &&
            r.test.toString() === /(?<!\.module)\.css$/.toString()
          ) {
            if (!r.issuer || !isRuleSetConditionObject(r.issuer)) {
              return false;
            }
            const paths = r.issuer.and || r.issuer.include;
            if (
              Array.isArray(paths) &&
              paths.some((s) => typeof s === "string" && s.includes("_app"))
            ) {
              return true;
            }
          }
          return false;
        }
      );
  }

  if (_cssRule) {
    // hack
    const paths = _cssRule.issuer.and || _cssRule.issuer.include;
    _cssRule.issuer = {
      include: union(/** @type {RuleSetConditions} */ (paths), newCssPath),
    };
  }

  return _cssRule;
}

/**
 * @param {Configuration} config
 */
function configureMonaco(config) {
  // #region include Monaco CSS

  appendCSSPath(config, [/[\\/]node_modules[\\/]monaco-editor[\\/]/]);

  // #endregion include Monaco CSS

  config.plugins.push(
    new MonacoWebpackPlugin({
      languages: ["json", "markdown", "typescript"],
      filename: "static/[name].worker.js",
    })
  );
}

// TODO: Copy withTranspiledModules source to the bottom of this file and debug it
// We're getting "Global CSS cannot be imported from files other than your Custom <App>."
// but it should be disabled by `withTranspiledModules`
module.exports = withTranspiledModules([
  "@spectrum-icons/.*",
  "@react-spectrum/.*",
])(() => ({
  middleware: [
    sessionMiddleware({
      unstable_isAuthorized: unstable_simpleRolesIsAuthorized,
    }),
  ],
  /**
   * @param {Configuration} config
   */
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    configureMonaco(config);

    appendCSSPath(config, [
      // /[\\/]node_modules[\\/]@adobe\/react-spectrum[\\/]/,
      /[\\/]node_modules[\\/]@react-spectrum[\\/]/,
      /[\\/]node_modules[\\/]handsontable[\\/]/,
    ]);

    return config;
  },
}));
