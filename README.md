# Postgres in a NoSQL World

> "What is a NoSQL world?"
> It's a world where people no longer know SQL.

# Getting Started

In order to perform the following examples, you'll need these
applications installed:

* Postgres
```
mkdir -p data/postgres
initdb -D data/postgres
postgres -D data/postgres
```

* MongoDB
```
mkdir -p data/mongodb
mongod --dbpath data/mongodb
```

* Redis
```
mkdir -p data/redis
redis-server redis.conf
```
* Node.js + `npm install pg`

# Examples

* Key-value store - Postgres & Redis
* Pub / Sub - Postgres & Redis
* Semi-structured data - Postgres & Mongo
* Semi-structured indexes - Postgres & Mongo
* JSON v. SQL - Postgres & Mongo
