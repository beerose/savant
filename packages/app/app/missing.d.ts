// generate .d.ts later only if needed
declare module "*.module.css" {
  const classNames: Record<string, string>;
  export default classNames;
}
