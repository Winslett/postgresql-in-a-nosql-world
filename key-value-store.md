# Key-value store

Postgres has an extension called HSTORE. It's key-value pairs within a
field.

## Postgres Setup
```
**postgres**
CREATE DATABASE nosql_test;
\connect nosql_test
CREATE EXTENSION hstore;
CREATE TABLE kv_store (key varchar(12) PRIMARY KEY, value HSTORE);
```

## Redis Setup
```
# coffee break
```

## Inserts

**Postgres**
```
INSERT INTO kv_store (key, value) VALUES ('batman', '"name" => "robin"');
```

**Redis**
```
SET batman robin
```

## Read
**Postgres**
```
SELECT * FROM kv_store WHERE key = 'batman';
SELECT value -> 'name' FROM kv_store WHERE key = 'batman';
```

**Redis**
```
GET batman
```

## Upsert
**postgres**
```
INSERT INTO kv_store (key, value) VALUES ('batman', '"name" => "alfred"') ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
```

**redis**
```
SET batman alfred
```

## DELETE
**postgres**
```
DELETE FROM kv_store WHERE key = 'batman';
```
**redis**
```
DEL batman
```

# More information

* Postgres capabilities with HSTORE, see http://www.postgresql.org/docs/9.5/static/hstore.html
* Redis capabilities, see http://redis.io/commands
