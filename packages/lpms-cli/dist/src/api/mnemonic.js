"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMnemonic = void 0;
var ethers_1 = require("ethers");
// Generate random mnemonic (24 words)
var generateMnemonic = function () {
    return ethers_1.utils.entropyToMnemonic(ethers_1.utils.randomBytes(32));
};
exports.generateMnemonic = generateMnemonic;
//# sourceMappingURL=mnemonic.js.map