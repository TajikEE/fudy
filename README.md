## Description

Simple api service for creating and authenticating user.
Swagger docs can be viewed here: http://localhost:4005/api

## Running the app on Docker

Simply make a .env file from .env.example and then run it on docker.

```bash
# Run from project root
$ cp .env.example .env
$ docker-compose up --build
```

## Test

There are unit tests as well as a couple of e2e tests.

```bash
# unit tests
$ docker exec -it nest-docker-postgres npm run test

# e2e tests
$ docker exec -it nest-docker-postgres npm run test:e2e
```

## pgAdmin
You can visit: http://localhost:5050/ and use the credentials from .env file to login and view the database.