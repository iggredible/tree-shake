#!/usr/bin/env node

const path = require("path");
const fs = require("fs");

const entry = require("./main").getEntryFromPackageJSON();
require("./main").bundleCodeIntoESM(entry);
