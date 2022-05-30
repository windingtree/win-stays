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
  salt [options]      Returns a random salt string (bytes32)
  wallet              Wallet account information
  login [options]     Makes login with password
  storage [options]   Uploads files to storage
  addresses           Returns addresses of service provider roles
  sp [options]        Service provider operations
  help [command]      display help for command
```

## Configuration

```bash
lpms config --add apiUrl --value http://localhost:5000
lpms config --add providerUri --value https://sokol.poa.network
lpms config --get providerUri
```

### Full list of config properties

- `apiUrl`: `lpms-server` API URI
- `providerUri`: Blockchain provider URI
- `mnemonic`: Wallet mnemonic. Can be generated and saved with the `mnemonic` command
- `defaultAccountIndex`: Default wallet account index. `0` by default
- `salt`: Unique salt string, Required for creation and registration of the service provider. Can be generated and saved with the `sale` command
- `metadataUri`: Storage Id (IPFS CID) of the signed metadata file of the service provider. Obtained with `storage --save --metadata` command
- `registry`: Address of the smart contract of the Service PRoviders Registry (`Videre` protocol)

## Login

```bash
lpms login --login manager --password winwin
```

```
"manager" user has been successfully logged in
```

## Wallet mnemonic generation

```bash
lpms mnemonic
lpms mnemonic --save
lpms mnemonic --save --index 0
```

- `--save` saves the mnemonic to the CLI config
- `--index` sets the default account index

```
history pudding dynamic dynamic staff village pupil prison nut father goose column lonely meadow effort aunt sure biology surround echo bachelor mechanic artwork void

Mnemonic has been successfully saved to the CLI config
```

## Wallet status information

```bash
lpms wallet
lpms wallet --index 1
lpms wallet --index 1 --keys
```

- `--index` specifies the idex of the account to display
- `--keys` export of the public and private keys

```
Account idex: 0
Wallet account: 0xcF76325B47a0edF0723DC4071A73C41B4FBc44eA (0.0 xDAI)
Public key: 0x048498a9f26844c54f88...e6b7a836bd25487ef1994bf291979e9dbc8
Private key: 0xa0d132baf98616634f19a368bc99e8e4bc6f4f140eefb31dc8b80096c0c24f8b
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
lops storage --metadata ./path/to/metadata.json --save
```

> `--save` option is optional, if enabled then returned storage Id will be saved to the CLI config

```
./README.md has been uploaded successfully. Storage Id: bafkreiddp6nksmdoe6rw7rakpwrr3yosh6hnzzkwrc2nuuiemk74aa3mqy
```

## Salt string generation

```bash
lpms salt
lpms salt --save
```

```
Random salt string: 0x18b6369b08e7e3b3776ba41653c39d7ec3f4806eeab047518d1c06479d178ec7
```

## Registration of a service provider

### Creation and signing of metadata

> This is a temporary method of metadata creation until the reach UI will be created in the context of `lpms-web` application

- To view your service provider Id you can use `sp` command (will require `salt` option if not created before)
- Edit the content of the `./scripts/facility.ts` file (do not forget to add there your service provider Id)
- Run the command `npx ts-node ./test/facility.ts`

The binary file with provider metadata will be created by path `./facility.bin`

This metadata is unsigned and cannot be used in `Videre` protocol as valid service provider metadata. To be valid this metadata should be signed with a proper private key. To apply signature this file should be uploaded to the `lpms-server`.

When the metadata file is created it should be uploaded to the `lpms-server` storage using `storage --metadata` CLI command. When you add `--save` option, returned storage Id will be saved in the CLI config

### Registration

- Registration of the service provider can be started by `sp --register` command. Will require `--salt` and `--meta` options if these are not been created and **saved** to config before.

### `dataURI` update

- Registration of the service provider can be started by `sp --update` command. Will require  `--meta` options if these are not been created and **saved** to config before. Also require config option `serviceProviderId` to be initialized (usually this property should be automatically initialized as the `--register` command result).

### Reset

- If you want to wipe information about the registered service provided from the CLI config you can use `sp --reset` command.

```bash
lpms sp --reset
```
