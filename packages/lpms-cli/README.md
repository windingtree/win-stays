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

## Getting addresses of servers roles

```bash
lpms addresses
```

```
┌─────────┬───────────┬──────────────────────────────────────────────┐
│ (index) │   role    │                   address                    │
├─────────┼───────────┼──────────────────────────────────────────────┤
│    0    │   'api'   │ '0x8c27Aa036fE743162A09Cbb46bf6AA98C60c103d' │
│    1    │ 'bidder'  │ '0x2760e234062C4a04494DE11b1521C36f947DbdE8' │
│    2    │ 'manager' │ '0xE67297b5556728499392B2fF72c3596A43d42800' │
│    3    │  'staff'  │ '0x8e811c0D0969865D6Cb632Fb820f2275396D7AA6' │
└─────────┴───────────┴──────────────────────────────────────────────┘
```

## Uploading files to storage

```bash
lpms storage --file ./path/to/README.md
lops storage --metadata ./path/to/metadata.json
```

```
./README.md has been uploaded successfully. Storage Id: bafkreiddp6nksmdoe6rw7rakpwrr3yosh6hnzzkwrc2nuuiemk74aa3mqy
```

## Testing

```bash
yarn test
```
