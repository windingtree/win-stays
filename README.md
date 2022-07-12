# Stays Dapp

## Setup

This is a win dapp.
All dependencies have to be installed via `yarn` from the root of repository.

## Development

Create proto folder in `src/` and run `yarn`
```bash
mkdir src/proto
yarn
```

Create  `.env` file in the root of repository with content like in the file `.env.example`. To start project locally please rum this command.
```bash
yarn start
```

## Production build

```bash
yarn build
```

## Development documentation

- [Custom react hooks](docs/hooks.md)
- [Combining reducers](docs/combineReducers.md)
- [Persistent state reducer](docs/localStorage.md)
- [Records reducer](docs/records.md)
- [Dapp routes](docs/routes.md)
