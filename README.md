<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# NestJS booking system

A simple booking system built with NestJS & Prisma ORM. This project was created to test the NestJS framework, and additional changes or new features may appear over time.

The project uses a PostgreSQL database running in Docker. Athentication has been implemented using the Google Auth0 with the JWT tokens. Each module features multiple unit and e2e tests.

## Requirements

This project requires [Node.js 20+](https://nodejs.org/en), [pnpm 9+](https://pnpm.io/) and [docker](https://www.docker.com/) to run.

## Getting started

1. Clone the repository and install all dependencies using pnpm
2. Copy the values from the `.env.example` to the `.env` file and update the variables
3. Start the database using the `docker:db` script
4. Push the prisma schema to the database `npx prisma db push`
5. Start the development server `pnpm run start:dev`
6. If necessary, run prisma studio to check the db data `pnpm run prisma:studio`

## License

This project is under the MIT license.
