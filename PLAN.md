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
- [ ] formatted project to match formatting settings
- [ ] set up git hooks using husky \
*Using git hooked styling tools to ensure code is formatted consistently.*
### Schema Library
- [ ] moved data models to models package and exposed as exports
- [ ] exposed typescript types alongside json-schema models \
*Doing this will prevent repetition of type declarations and schema declarations.*
### Data Seeding
- [ ] set up initial TypeScript seeding service
- [ ] added json file imports to seeding service
- [ ] added per-document schema validation to seeding service
*Gracefully handle each document.*
- [ ] added MongoDB collection imports to seeding service
### API
- [ ] set up initial TypeScript express API \
*Using express due to familiarity and diversity of available packages to expand on it.*
- [ ] created basic db service function for retrieving a single company's data
- [ ] created basic controller and route for retrieving a single company's data
- [ ] created basic db service function for retrieving multiple companies' data
- [ ] created basic controller and route for retrieving multiple companies' data
- [ ] added pagination to GET /companies controller and related db service
- [ ] added pagination metadata to GET /companies controller response
- [ ] added optional employee data to GET /companies controller response and related db service
- [ ] added company name filtering to GET /companies controller and related db service
- [ ] added active status filtering to GET /companies controller and related db service
- [ ] added employee name filtering to GET /companies controller and related db service
### Finish & Tidy Up
- [ ] added JSDoc blocks to functions
- [ ] added JSDoc blocks to controllers
- [ ] added production mode to project
- [ ] added project README
- [ ] added route documentation
- [ ] added newman cli support for demonstrating endpoints
### Extension
- [ ] added support to GET /companies/{id} route for multiple ids

## Notes

- My understanding is that tests are not included in the task itself but only a subject of discussion, so I have not created any here.
- Tested endpoints locally using Postman during development.
- Tested db content locally using MongoDB Compass during development.
