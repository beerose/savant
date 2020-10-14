// @ts-check

const {
  sessionMiddleware,
  unstable_simpleRolesIsAuthorized,
} = require('@blitzjs/server');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

/**
 * `pirates` breaks `css-loader`
 * @see https://github.com/webpack/webpack/issues/1754#issuecomment-547750308
 */
require.extensions['.css'] = () => {
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
 * @param {RuleSetCondition} r
 */
const findRuleDFS = (r) => {
  if (typeof r === 'string') {
    return r.includes('_app');
  }
  if (Array.isArray(r)) {
    return r.some(findRuleDFS);
  }
  if ('test' in r && r.test) {
    return findRuleDFS(r.test);
  }
  if ('and' in r && r.and) {
    return findRuleDFS(r.and);
  }
  if ('exclude' in r && r.exclude) {
    return findRuleDFS(r.exclude);
  }
  if ('include' in r && r.include) {
    return findRuleDFS(r.include);
  }
  if ('not' in r && r.not) {
    return findRuleDFS(r.not);
  }
  if ('or' in r && r.or) {
    return findRuleDFS(r.or);
  }
  return false;
};

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
     * @returns {rsc is RuleSetConditionObject}
     */
    const isRuleSetConditionObject = (rsc) =>
      typeof rsc === 'object' && !('test' in rsc) && !Array.isArray(rsc);

    _cssRule = config.module.rules
      .find((rule) => rule.oneOf)
      .oneOf.find(
        /**
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
            return findRuleDFS(r.issuer);
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
      languages: ['json', 'markdown', 'typescript'],
      filename: 'static/[name].worker.js',
    })
  );
}

// TODO: Copy withTranspiledModules source to the bottom of this file and debug it
// We're getting "Global CSS cannot be imported from files other than your Custom <App>."
// but it should be disabled by `withTranspiledModules`
module.exports = withTranspiledModules([
  '@spectrum-icons/.*',
  '@react-spectrum/.*',
])({
  middleware: [
    sessionMiddleware({
      unstable_isAuthorized: unstable_simpleRolesIsAuthorized,
    }),
  ],
  /**
   * @param {Configuration} config
   */
  webpack: (config) => {
    configureMonaco(config);

    appendCSSPath(config, [
      /[\\/]node_modules[\\/]@react-spectrum[\\/]/,
      /[\\/]node_modules[\\/]handsontable[\\/]/,
    ]);

    return config;
  },
});

// #region plugins

// Stolen from next-transpile-modules and adapted.

const path = require('path');
var PATH_DELIMITER = '[\\\\/]'; // match 2 antislashes or one slash

/**
 * Use me when needed
 *
 * @param {object} object
 */
// eslint-disable-next-line no-unused-vars
function inspect(object) {
  console.dir(object, { depth: Infinity });
  return object;
}

/**
 * On Windows, the Regex won't match as Webpack tries to resolve the
 * paths of the modules. So we need to check for \\ and /
 *
 * @param {string} module
 */
function safePath(module) {
  return module.split(/[\\/]/g).join(PATH_DELIMITER);
}

/**
 * Stolen from https://stackoverflow.com/questions/10776600/testing-for-equality-of-regular-expressions
 *
 * @param {RegExp} x
 * @param {RegExp} y
 */
const regexEqual = (x, y) => {
  return (
    x instanceof RegExp &&
    y instanceof RegExp &&
    x.source === y.source &&
    x.global === y.global &&
    x.ignoreCase === y.ignoreCase &&
    x.multiline === y.multiline
  );
};

/**
 * Actual Next.js plugin
 * @param {string[]} transpileModules
 * @param {{
 *   resolveSymlinks?: boolean;
 *   unstable_webpack5?: boolean;
 * }} tmOptions
 */
function withTranspiledModules(transpileModules = [], tmOptions = {}) {
  /**
   * @param {string[]} modules
   */
  const generateIncludes = (modules) => {
    return [
      new RegExp(`(${modules.map(safePath).join('|')})$`),
      new RegExp(
        `(${modules
          .map(safePath)
          .join('|')})${PATH_DELIMITER}(?!.*node_modules)`
      ),
    ];
  };

  /**
   * @param {string[]} modules
   */
  const generateExcludes = (modules) => {
    return [
      new RegExp(
        `node_modules${PATH_DELIMITER}(?!(${modules
          .map(safePath)
          .join('|')})(${PATH_DELIMITER}|$)(?!.*node_modules))`
      ),
    ];
  };

  /**
   * @param {{
   *   webpack?:
   *     | import("webpack").Configuration
   *     | ((config: any, options: any) => import("webpack").Configuration),
   *   webpackDevMiddleware?: object
   *   [key: string]: any
   * }} blitzConfig
   */
  const withTM = (blitzConfig = {}) => {
    if (transpileModules.length === 0) return blitzConfig;

    const resolveSymlinks = tmOptions.resolveSymlinks || false;
    const isWebpack5 = tmOptions.unstable_webpack5 || false;

    const includes = generateIncludes(transpileModules);
    const excludes = generateExcludes(transpileModules);

    const hasInclude = (ctx, req) => {
      return includes.find((include) =>
        req.startsWith('.')
          ? include.test(path.resolve(ctx, req))
          : include.test(req)
      );
    };

    return Object.assign({}, blitzConfig, {
      webpack(config, options) {
        // Safecheck for Next < 5.0
        if (!options.defaultLoaders) {
          throw new Error(
            'This plugin is not compatible with Next.js versions below 5.0.0 https://err.sh/next-plugins/upgrade'
          );
        }

        // Avoid Webpack to resolve transpiled modules path to their real path as
        // we want to test modules from node_modules only. If it was enabled,
        // modules in node_modules installed via symlink would then not be
        // transpiled.
        config.resolve.symlinks = resolveSymlinks;

        // Since Next.js 8.1.0, config.externals is undefined
        if (config.externals) {
          config.externals = config.externals.map((external) => {
            if (typeof external !== 'function') return external;

            return isWebpack5
              ? ({ context, request }, cb) => {
                  return hasInclude(context, request)
                    ? cb()
                    : external({ context, request }, cb);
                }
              : (ctx, req, cb) => {
                  return hasInclude(ctx, req) ? cb() : external(ctx, req, cb);
                };
          });
        }

        // Add a rule to include and parse all modules (js & ts)
        if (isWebpack5) {
          config.module.rules.push({
            test: /\.+(js|jsx|mjs|ts|tsx)$/,
            use: options.defaultLoaders.babel,
            include: includes,
          });
        } else {
          config.module.rules.push({
            test: /\.+(js|jsx|mjs|ts|tsx)$/,
            loader: options.defaultLoaders.babel,
            include: includes,
          });
        }

        // Support CSS modules + global in node_modules
        const nextCssLoaders = config.module.rules.find(
          (rule) => typeof rule.oneOf === 'object'
        );

        // .module.css
        if (nextCssLoaders) {
          const nextCssLoader = nextCssLoaders.oneOf.find(
            (rule) =>
              rule.sideEffects === false &&
              regexEqual(rule.test, /\.module\.css$/)
          );

          const nextSassLoader = nextCssLoaders.oneOf.find(
            (rule) =>
              rule.sideEffects === false &&
              regexEqual(rule.test, /\.module\.(scss|sass)$/)
          );

          if (nextCssLoader) {
            nextCssLoader.issuer.or = nextCssLoader.issuer.and
              ? nextCssLoader.issuer.and.concat(includes)
              : includes;
            nextCssLoader.issuer.not = excludes;
            delete nextCssLoader.issuer.and;
          }

          if (nextSassLoader) {
            nextSassLoader.issuer.or = nextSassLoader.issuer.and
              ? nextSassLoader.issuer.and.concat(includes)
              : includes;
            nextSassLoader.issuer.not = excludes;
            delete nextSassLoader.issuer.and;
          }

          // Hack our way to disable errors on node_modules CSS modules
          const nextErrorCssModuleLoader = nextCssLoaders.oneOf.find(
            (rule) =>
              rule.use &&
              rule.use.loader === 'error-loader' &&
              rule.use.options &&
              (rule.use.options.reason ===
                'CSS Modules \u001b[1mcannot\u001b[22m be imported from within \u001b[1mnode_modules\u001b[22m.\n' +
                  'Read more: https://err.sh/next.js/css-modules-npm' ||
                rule.use.options.reason ===
                  'CSS Modules cannot be imported from within node_modules.\nRead more: https://err.sh/next.js/css-modules-npm')
          );

          if (nextErrorCssModuleLoader) {
            nextErrorCssModuleLoader.exclude = includes;
          }

          const bothGlobalCssErrorLoaders = nextCssLoaders.oneOf.filter(
            (rule) =>
              rule.use &&
              rule.use.loader === 'error-loader' &&
              rule.use.options &&
              typeof rule.use.options.reason === 'string' &&
              rule.use.options.reason.startsWith('Global CSS')
          );

          bothGlobalCssErrorLoaders.forEach((rule) => {
            if (!rule.exclude) {
              rule.exclude = includes;
            } else {
              throw new Error(
                'invalid assumption! `rule.exclude` was empty when this code was written'
              );
            }
          });
        }

        // Overload the Webpack config if it was already overloaded
        if (typeof blitzConfig.webpack === 'function') {
          return blitzConfig.webpack(config, options);
        }

        return config;
      },

      // webpackDevMiddleware needs to be told to watch the changes in the
      // transpiled modules directories
      webpackDevMiddleware(config) {
        // Replace /node_modules/ by the new exclude RegExp (including the modules
        // that are going to be transpiled)
        // https://github.com/zeit/next.js/blob/815f2e91386a0cd046c63cbec06e4666cff85971/packages/next/server/hot-reloader.js#L335

        const ignored = isWebpack5
          ? config.watchOptions.ignored.concat(transpileModules)
          : config.watchOptions.ignored
              .filter(
                (pattern) =>
                  !regexEqual(pattern, /[\\/]node_modules[\\/]/) &&
                  pattern !== '**/node_modules/**'
              )
              .concat(excludes);

        config.watchOptions.ignored = ignored;

        if (typeof blitzConfig.webpackDevMiddleware === 'function') {
          return blitzConfig.webpackDevMiddleware(config);
        }

        return config;
      },
    });
  };

  return withTM;
}

// #endregion plugins
