# Utils

## Description

This is not a service, it contains code common to all the services.

For more details on some of the utilities defined, see the `README.md` files for the `sessions` and `articles` services.

## Tutorial

For development, the `link_utils.sh` script can be used to create hard links in all the service directories (beware that git can break these links so it may need to be run repeatedly). Alternatively the directory can be copied in manually.

For deployment, the `docker-compose.yml` is configured to copy this directory into each continer.
