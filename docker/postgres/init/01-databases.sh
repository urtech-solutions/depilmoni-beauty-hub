#!/bin/sh
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
  CREATE DATABASE depilmoni_payload;
  CREATE DATABASE depilmoni_medusa;
EOSQL
