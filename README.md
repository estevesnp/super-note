# `super-note`

An over-engineered note taking app

## Motivation

I created this project in order to both learn more about authentication by manually
implementing it using [JWTs](https://jwt.io/) and explore some Golang tools and
libraries, such as [gin](https://github.com/gin-gonic/gin) as an HTTP framework,
[sqlc](https://sqlc.dev/) for generating code from SQL queries and
[golang-migrate](https://github.com/golang-migrate/migrate) to perform database migrations.

## Overview

TODO

## Architecture

The backend is a Go HTTP server that provides REST endpoints for a simple frontend,
made in [SolidJS](https://www.solidjs.com/), and communicates with a PostgreSQL
database using the [pgx](https://github.com/jackc/pgx) driver for Go.
It also provides authentication using [JWTs](https://jwt.io/).

## Dependencies

- [`Go`](https://go.dev/) - version `1.23.4` or above
- [`PostgreSQL`](https://www.postgresql.org/) - tested using version `16.6`
- [`NodeJS`](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) - tested using version `v23.4.0`
- [`NPM`](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) - tested using version `11.0.0`
- [`sqlc`](https://sqlc.dev/) - code generation from SQL queries (optional)
- [`golang-migrate`](https://github.com/golang-migrate/migrate) - database migrations (optional)

## Run locally

### Backend

- Create a `.env` file in the project's root with the same schema as '.env.sample'
- Configure your `.env` with the propper values
- Build with `go build -o super-note ./cmd/server`
- Run it with `./super-note`

### Frontend

- `cd frontend`
- Create a `.env` file  with the same schema as '.env.sample'
- Configure your `.env` with the propper values
- Build with `npm run build`
- Run it with `npm run serve`

## TODO

- add tests
- add css
- add, remove, change, display lists and tasks
- add profile page?
- allow to configure host and port for FE
- figure out what to do with FE readme
