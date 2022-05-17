"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.green = void 0;
var chalk_1 = __importDefault(require("chalk"));
var log = console.log;
var green = function (string) { return log(chalk_1.default.green(string)); };
exports.green = green;
//# sourceMappingURL=print.js.map