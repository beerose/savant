// @ts-check

const {
  sessionMiddleware,
  unstable_simpleRolesIsAuthorized,
} = require("@blitzjs/server");
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");

/**
 * @typedef {import("webpack").Configuration} Configuration
 * @typedef {import("webpack").RuleSetCondition} RuleSetCondition
 * @typedef {import("webpack").RuleSetConditions} RuleSetConditions
     
 * @typedef {Extract<import("webpack").RuleSetCondition, { include?: import("webpack").RuleSetCondition }>} RuleSetConditionObject
 */

/**
 * @param {Configuration} config
 */
function configureMonaco(config) {
  // #region include Monaco CSS

  /**
   * @param {RuleSetCondition} rsc
   * @returns {rsc is RuleSetConditionObject }
   */
  const isRuleSetConditionObject = (rsc) =>
    typeof rsc === "object" && !("test" in rsc) && !Array.isArray(rsc);

  /**
   * @param {RuleSetCondition} rsc
   * @returns {rsc is RuleSetConditions}
   */
  const isRuleSetConditions = (rsc) =>
    typeof rsc === "object" && Array.isArray(rsc);

  const cssRule = config.module.rules
    .find((rule) => rule.oneOf)
    .oneOf.find(
      /**
       * @returns {r is { issuer: RuleSetConditionObject & { include: RuleSetConditions } }}
       */
      (r) =>
        // Find the global CSS loader
        // I copied this code from swyx's blog.
        // I don't really trust this code. I think it may be too specific.
        // Aren't there any utils to find a rule?
        r.issuer &&
        isRuleSetConditionObject(r.issuer) &&
        isRuleSetConditions(r.issuer.include) &&
        r.issuer.include.includes("_app")
    );

  if (cssRule) {
    cssRule.issuer.include = [
      cssRule.issuer.include,
      // Allow `monaco-editor` to import global CSS:
      /[\\/]node_modules[\\/]monaco-editor[\\/]/,
    ];
  }

  // #endregion include Monaco CSS

  config.plugins.push(
    new MonacoWebpackPlugin({
      languages: ["json", "markdown", "typescript"],
      filename: "static/[name].worker.js",
    })
  );
}

module.exports = {
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

    return config;
  },
};
