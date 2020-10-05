import classNames from "./spectrum-theme.module.css";

if (Object.keys(classNames).length === 0) {
  throw new Error("css modules failed to load");
}

export const theme = {
  reusableTokensClassName: classNames.tokens,
  global: {
    spectrum: classNames.spectrum,
    "spectrum--medium":
      /* classNames["common-medium"] */ classNames["common-large"],
    "spectrum--large": classNames["common-large"],
    "spectrum--darkest": classNames["common-darkest"],
    "spectrum--dark": classNames["common-dark"],
    "spectrum--light": classNames["common-light"],
    "spectrum--lightest": classNames["common-lightest"],
  },
  light: { "spectrum--light": classNames.light },
  dark: { "spectrum--darkest": classNames.darkest },
  medium: { "spectrum--medium": /* classNames.medium */ classNames.large },
  large: { "spectrum--large": classNames.large },
};
