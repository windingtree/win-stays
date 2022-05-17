#!/usr/bin/env -S node --no-deprecation
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var commander_1 = require("commander");
var package_json_1 = __importDefault(require("../package.json"));
var print_1 = require("./utils/print");
var mnemonic_1 = require("./api/mnemonic");
var program = new commander_1.Command();
program
    .name('lpms')
    .description('LPMS API CLI')
    .version(package_json_1.default.version);
program
    .command('mnemonic')
    .description('Generates random 24 word mnemonic')
    .action(function () {
    (0, print_1.green)((0, mnemonic_1.generateMnemonic)());
});
program.parse();
//# sourceMappingURL=index.js.map