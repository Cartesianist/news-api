# Northcoders News API

## What is this repo???

It is a backend API built with Node.js and postgres, and was created as part of the Northcoders course curriculum. The API is built for the purpose of accessing application data programmatically.

## Requirements

- Node.js: `node -v | v18.4.0`
- postgres: `psql -v | 8.7.3`

## Getting started

1. Cloning this repository
2. Install project dependencies with `npm install`
3. Add the following files:

   - .env.test : `PGDATABASE=nc_news_test`
   - .env.development : `PGDATABASE=nc_news`

4. Run the database setup script `npm run setup-dbs`
5. Seed the database `npm run seed-prod`
6. Run the tests `npm t`
