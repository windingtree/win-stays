import type { Command } from 'commander';

export interface ConfigOptions {
  apiUrl?: string;
  mnemonic?: string;
  login?: {
    accessToken: string;
    refreshToken: string;
  };
}

export type ConfigKeys = keyof ConfigOptions;

export interface CliOptions {
  save?: boolean;
  add?: ConfigKeys;
  remove?: ConfigKeys;
  value?: ConfigOptions[ConfigKeys];
  login?: string;
  password?: string;
}

export type ActionController = (options: CliOptions, program: Command) =>
  void | Promise<void>;
