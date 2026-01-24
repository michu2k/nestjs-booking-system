<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# NestJS booking system

A simple booking system built with NestJS 11 & Prisma. This project was created to test the NestJS framework, and additional changes or new features may appear over time.

The project uses a PostgreSQL database running in Docker. Authentication has been implemented using the Google Auth0 with the JWT tokens. Each module features multiple unit and e2e tests.

## Requirements

This project requires [Node.js 20+](https://nodejs.org/en), [pnpm 10+](https://pnpm.io/) and [Docker](https://www.docker.com/) to run.

## Getting started

1. Clone the repository and install all dependencies using pnpm
2. Copy the values from the `.env.example` to the `.env` file and update the variables
3. Start the database using the `docker:db` script
4. Push the prisma schema to the database `npx prisma db push`
5. Start the development server `pnpm run start:dev`
6. If necessary, run prisma studio to check the db data `pnpm run prisma:studio`
7. You can also populate the database with test data using `pnpm run prisma:seed`

## Database diagram

Each time you run the `prisma:gen` command, a new DBML diagram will be generated in the `prisma/schema.dbml` file. You can use [dbdiagram.io](https://dbdiagram.io/home) to visualize the database schema as an Entity-Relationship diagram.

## License

This project is under the MIT license.
