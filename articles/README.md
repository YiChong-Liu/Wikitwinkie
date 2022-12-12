# Articles service

Author: Neil Gupta ([@nog642](https://github.com/nog642))

## Description

[short description of the service]

## Endpoints

[details of each endpoint]

## Tutorial

This service is best run along with all the other services using `docker compose build` and then `docker compose up` at the root level of this repository.

To run the service on its own, use `link_utils.sh` in the repository root first to link in the `utils` directory, then run `npm install` in the `articles` directory, then run `npm start`. Note that the database needs to be running as well under the host name `articlesdb`, or this will fail.

## Architecture

[how the service interacts with other services]
