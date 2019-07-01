const fs = require("fs");
const path = require("path");
const { rollup } = require("rollup");
const virtual = require("rollup-plugin-virtual");

const handleExit = errorMessage => {
  console.error(errorMessage);
  process.exitCode = 1;
  return;
};

const getEntryFromPackageJSON = () => {
  if (!fs.existsSync("package.json")) {
    handleExit("Failed - package.json is not available");
    return;
  }
  const pkg = JSON.parse(fs.readFileSync("package.json"), "utf-8");

  const entry = pkg.module || pkg.main;

  if (entry === undefined) {
    handleExit("Failed - module or main entry point is missing");
    return;
  }
  return entry;
};

const bundleCodeIntoESM = entry => {
  const resolvedEntry = path.resolve(entry);
  console.info("********** reading files **********");

  return rollup({
    input: "treeshake",
    plugins: [
      virtual({
        treeshake: `import ${JSON.stringify(resolvedEntry)}`
      })
    ],
    onwarn: (warning, handle) => {
      if (warning.code !== "EMPTY_BUNDLE") handle(warning);
    }
  })
    .then(bundle => bundle.generate({ format: "esm" }))
    .then(output => {
      const trimmedCodeOutput = output.code.trim();
      const fullyTreeShakeable = trimmedCodeOutput === "";

      if (fullyTreeShakeable) {
        console.info("Awesome! Code is 100% tree-shakeable");
        return;
      }
      const outputModuleKeys = Object.keys(output.modules).slice(0, -1);

      console.info("Unshaken files: ");
      outputModuleKeys.forEach(outputModuleKey => {
        const outputModule = output.modules[outputModuleKey];
        console.log(`\n${outputModuleKey}`);
      });

      console.info("\n********** reading codes **********");
      console.info("Unshaken codes:");
      console.info(output.code);

      console.info("********** Finished Reading **********");
      return output;
    });
};
module.exports = { getEntryFromPackageJSON, bundleCodeIntoESM };
