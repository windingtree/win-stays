import type { Command } from 'commander';

export interface LoginTokens {
  accessToken: string;
  refreshToken: string;
}

export interface ConfigOptions {
  apiUrl?: string;
  providerUri?: string;
  mnemonic?: string;
  defaultAccountIndex?: number;
  login?: LoginTokens;
  salt?: string;
  metadataUri?: string;
  registry?: string;
  serviceProviderId?: string;
}

export type ConfigKeys = keyof ConfigOptions;

export interface CliOptions {
  save?: boolean;
  get?: ConfigKeys;
  add?: ConfigKeys;
  remove?: ConfigKeys;
  value?: ConfigOptions[ConfigKeys];
  reset?: boolean;
  login?: string;
  password?: string;
  metadata?: string;
  file?: string;
  salt?: string;
  meta?: string;
  register?: boolean;
  update?: boolean;
  index?: number;
  keys?: number;
  id?: boolean;
}

export type ActionController = (options: CliOptions, program: Command) =>
  void | Promise<void>;
