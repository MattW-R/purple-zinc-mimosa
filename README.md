# purple-zinc-mimosa

## Requirements

- Have yarn CLI installed (version 1.22.17 used).
- Have docker-compose (standalone) CLI installed (version 2.26.1 used).

## Install Dependencies

```bash
yarn install
```

## Run in Development Mode

Must have installed dependencies.

```bash
sudo docker-compose -f docker-compose.dev.yml up --build
```

## Run in Production Mode

```bash
sudo docker-compose up --build
```

## Demonstrate Routes

Must have installed dependencies.
When running in development or production mode:

```bash
yarn demo
```

## Lint Project

Must have installed dependencies.

```bash
yarn lint
```

## Format Project

Must have installed dependencies.

```bash
yarn format
```
