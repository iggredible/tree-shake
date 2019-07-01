#!/usr/bin/env node

const path = require("path");
const fs = require("fs");
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
    handleExit(
      "Failed - module or main entry point is required inside package.json"
    );
    return;
  }
  return entry;
};

const entry = getEntryFromPackageJSON();

const bundleCodeIntoESM = entry => {
  const resolvedEntry = path.resolve(entry);
  console.info("********** reading code **********");

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

      outputModuleKeys.forEach(outputModuleKey => {
        const outputModule = output.modules[outputModuleKey];
        const renderedLength = outputModule.renderedLength;
        const originalLength = outputModule.originalLength;
        const percentRendered = (
          ((originalLength - renderedLength) / originalLength) *
          100
        ).toFixed(2);

        console.info(
          `${outputModuleKey} is ${percentRendered}% tree-shakeable`
        );
      });
      console.info("Responsible codes: ");
      console.info(output.code);

      console.info("********** Finished Reading **********");
      return output;
    });
};

const output = bundleCodeIntoESM(entry);
