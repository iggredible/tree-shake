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
      /*
       *[Object: null prototype] {
  '/Users/iggy/bloc/write-code/tree-shake/index.js':
   { renderedExports: [],
     removedExports: [ 'default' ],
     renderedLength: 19,
     originalLength: 192 },
  '\u0000virtual:treeshake':
   { renderedExports: [],
     removedExports: [],
     renderedLength: 0,
     originalLength: 56 } }
       * */
      // first, determine whether it passes or not
      // second, if it does NOT pass, find EACH object keys that do not pass 100% render
      // third, display above filename, and how many % rendered
      const trimmedCodeOutput = output.code.trim();
      const fullyTreeShakeable = trimmedCodeOutput === "";
      console.log("trimmedCodeOutput: ", fullyTreeShakeable);
      if (fullyTreeShakeable) {
        console.log("Awesome! Code is 100% tree-shakeable");
        return;
      }
      const outputModuleKeys = Object.keys(output.modules);

      outputModuleKeys.forEach(outputModuleKey => {
        console.log("each key:");
        const outputModule = output.modules[outputModuleKey];
        console.log(outputModule);
        const renderedLength = outputModule.renderedLength;
        const originalLength = outputModule.originalLength;
        const percentRendered = (
          ((originalLength - renderedLength) / originalLength) *
          100
        ).toFixed(2);
        console.log("percentRendered: ", percentRendered);
        if (percentRendered < 100) {
          console.log(
            `${outputModuleKey} is ${percentRendered}% tree-shakeable`
          );
        }
      });
      console.log(output.modules);
      return output;
    });
};

const output = bundleCodeIntoESM(entry);
