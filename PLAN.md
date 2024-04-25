# Plan

## Initial Plan

Written in the form of git commit messages:

### Initial Setup
- [X] set up git repo
- [X] set up development docker-compose configuration with MongoDB \
*Using MongoDB as I am most familiar with this database engine and the data schemas will comfortably fit this.*
- [X] set up lerna monorepo
- [X] set up initial TypeScript schemas shared library package \
*Using monorepo in order to share schema between api & a seeding service. Using separate service so seeding can be separated from production & only run once.*
- [X] set up linting and formatting tooling
- [X] formatted project to match formatting settings
- [X] set up git hooks using husky \
*Using git hooked styling tools to ensure code is formatted consistently.*
### Schema Library
- [X] moved data models to models package and exposed as exports
- [X] exposed typescript types alongside json-schema models \
*Doing this will prevent repetition of type declarations and schema declarations.*
### Data Seeding
- [X] set up initial TypeScript seeding service
- [X] added json file imports to seeding service
- [X] added per-document schema validation to seeding service
*Gracefully handle each document.*
- [X] added MongoDB collection imports to seeding service
### API
- [X] set up initial TypeScript express API \
*Using express due to familiarity and diversity of available packages to expand on it.*
- [X] created basic db service function for retrieving a single company's data
- [X] created basic controller and route for retrieving a single company's data
- [X] created basic db service function for retrieving multiple companies' data
- [X] created basic controller and route for retrieving multiple companies' data
- [X] added pagination to GET /companies controller and related db service
- [X] added pagination metadata to GET /companies controller response
- [ ] ~~added optional employee data to GET /companies controller response and related db service~~
- [X] added company name filtering to GET /companies controller and related db service
- [X] added active status filtering to GET /companies controller and related db service
- [X] added employee name filtering to GET /companies controller and related db service
### Finish & Tidy Up
- [X] added JSDoc blocks to functions
- [X] added JSDoc blocks to controllers
- [X] added production mode to project
- [X] added project README
- [ ] added route documentation
- [ ] added newman cli support for demonstrating endpoints
### Extension
- [X] added support to GET /companies/{id} route for multiple ids

## Updated Plan

- [X] refactored repeated json file import logic into helper function
- [X] fixed mongo instance still holding seeded data between restarts
- [X] added no method fallback response to api
- [X] added graceful error handling in controllers

## Notes

- My understanding is that tests are not included in the task itself but only a subject of discussion, so I have not created any here.
- Tested endpoints locally using Postman during development.
- Tested db content locally using MongoDB Compass during development.
