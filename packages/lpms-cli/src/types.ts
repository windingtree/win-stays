import type { Command } from 'commander';

export interface LoginTokens {
  accessToken: string;
  refreshToken: string;
}

export interface ConfigOptions {
  apiUrl?: string;
  providerUri?: string;
  mnemonic?: string;
  login?: LoginTokens;
}

export type ConfigKeys = keyof ConfigOptions;

export interface CliOptions {
  save?: boolean;
  add?: ConfigKeys;
  remove?: ConfigKeys;
  value?: ConfigOptions[ConfigKeys];
  login?: string;
  password?: string;
  metadata?: string;
  file?: string;
}

export type ActionController = (options: CliOptions, program: Command) =>
  void | Promise<void>;
