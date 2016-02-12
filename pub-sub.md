# Asynchronous Messages

# Redis

**Open a Redis connection**
```
SUBSCRIBE hammertime
```

**Open a different Redis connection**
```
PUBLISH hammertime 'all around the world.'
```

# PostgreSQL

**Open a PSQL connection**
```SQL
LISTEN hammertime
// you'll need to run SELECT true; to since PSQL isn't asynchronous
```

**Open a new PSQL connection**
```SQL
SELECT pg_notify('hammertime', 'it is hammertime');
```

Or, from a Node.js application:
```bash
npm install pg
node subscribe-to-pg.js
```

Then, within Postgres, do the following:
```SQL
SELECT pg_notify('hammertime', 'it is hammertime');
```
