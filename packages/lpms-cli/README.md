# LPMS CLI
Console utility for ease access to LPMS APIs

## Setup

```bash
yarn add @windingtree/lpms-cli
lpms
```

```
Usage: lpms [options] [command]

LPMS API CLI

Options:
  -V, --version       output the version number
  -h, --help          display help for command

Commands:
  config [options]    Adds or removes configuration properties
  mnemonic [options]  Generates random 24 word mnemonic
  login [options]     Makes login with password
  help [command]      display help for command
```

## Configuration

```bash
lpms config --add apiUrl --value http://localhost:5000
lpms config --add providerUri --value https://sokol.poa.network
```

## Login

```bash
lpms login --login manager --password winwin
```

```
"manager" user has been successfully logged in
```

## Wallet mnemonic generation

```bash
lpms mnemonic --save
```

```
history pudding dynamic dynamic staff village pupil prison nut father goose column lonely meadow effort aunt sure biology surround echo bachelor mechanic artwork void

Mnemonic has been successfully saved to the CLI config
```

## Wallet status information

```bash
lpms wallet
```

```
Wallet account: 0xfe8E6f7c7972f217d8728A52CfaBb7a2025A0886 (0.0 xDAI)
```

## Testing

```bash
yarn test
```
