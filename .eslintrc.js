module.exports = {
  env: {
    es2020: true,
  },
  extends: ["react-app", "plugin:jsx-a11y/recommended"],
  plugins: ["jsx-a11y"],
  rules: {
    "import/no-anonymous-default-export": "error",
    "import/no-webpack-loader-syntax": "off",
    // React is always in scope with Blitz
    "react/react-in-jsx-scope": "off",
    //Doesn't play well with Blitz/Next <Link> usage
    "jsx-a11y/anchor-is-valid": "off",
    "jsx-a11y/accessible-emoji": "off",
  },
};
