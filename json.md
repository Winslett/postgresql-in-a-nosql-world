# JSON Data

## Setup
**postgres**
```
CREATE TABLE people (id SERIAL PRIMARY KEY, name VARCHAR, properties JSONB);
```

**mongodb**
```
# coffee break
```


## INSERT
**postgres**
```
INSERT INTO people (name, properties) VALUES ('Chris', '{"height":182,"weight":94,"hair":"brown"}');
```

**mongodb**
```
db.people.insert({name: "Chris", properties: {"height":182,"weight":94,"hair":"brown"}})
```

# Query
**postgres**
```
SELECT * FROM people WHERE properties ->> 'hair' = 'brown';
```

**mongodb**
```
db.people.find({"properties.hair": "brown"})
```

# Update
**postgres**
```
UPDATE people SET properties = jsonb_set(properties, '{hair}', '"blonde"', false) WHERE properties ->> 'hair' = 'brown';
```

**mongodb**
```
db.people.update({"properties.hair": "brown"}, {"$set": {"properties.hair": "blonde"}})
```

# Indexing JSON data
**postgres**
```SQL
CREATE INDEX people_hair_index ON people USING GIN ((properties -> 'hair'));
EXPLAIN SELECT * FROM people WHERE properties ->> 'hair' = 'blonde'; // WAT!

CREATE INDEX people_properties ON people USING GIN ((properties));
EXPLAIN SELECT * FROM people WHERE properties @> '{"hair":"blonde"}'; // WAT!
```

**mongodb**
```
db.people.ensureIndex({hair: 1});
db.people.find({hair: "brown"}).explain()
```

# Complex queries and multiple Indexes
**postgres**
```SQL
// Postgres will not use the indexes to make this query more efficient
CREATE INDEX people_weight_index ON people USING GIN ((properties -> 'weight'));
CREATE INDEX people_height_index ON people USING GIN ((properties -> 'height'));

EXPLAIN
SELECT
  *
FROM people
WHERE true
    AND properties ->> 'hair' = 'blonde'
    AND (properties ->> 'weight')::int > 80
    AND (properties ->> 'height')::int < 185;
```

**mongodb**
```json
// MongoDB will not use the indexes to make this query more efficient
db.people.find({
  "properties.hair": "blonde",
  "properties.weight": {$gt: 80},
  "properties.height": {$lt: 185}
});
```

# JSON Document Database versus Postgres

**With JSON data, the complexity is in the document and the application**:

```
{
  "name": "Chris Winslett",
  "properties": {
		"height": 182,
		"weight": 94,
		"hair": "brown"
  },
	"employer": {
		"name": "Compose",
		"role": "Programmer"
	},
	"pets": [
		{
			"type": "dog",
			"name": "Samson",
			"dob": new ISODate("2007-08-14")
		},
		{
			"type": "fish",
			"name": "Breeze",
			"dob": new ISODate("2015-06-14")
		}
	]
}
```

**With postgres, the complexity is in the defined schema and the query:**
```SQL
CREATE TABLE users (id SERIAL PRIMARY KEY, name VARCHAR(255));
CREATE TABLE properties (id SERIAL PRIMARY KEY, user_id INT, key VARCHAR(255), value VARCHAR(255));
CREATE TABLE employees (id SERIAL PRIMARY KEY, user_id INT, employer_id INT, role VARCHAR(255));
CREATE TABLE employers (id SERIAL PRIMARY KEY, name VARCHAR(255));
CREATE TABLE pets (id SERIAL PRIMARY KEY, user_id INT, name VARCHAR(255), type VARCHAR(255), dob TIMESTAMP);

WITH inserted_user AS (
  INSERT INTO users (name) VALUES ('Chris') RETURNING *
), inserted_employer AS (
  INSERT INTO employers (name) VALUES ('Compose') RETURNING *
)
INSERT INTO properties (user_id, key, value) VALUES ((SELECT id FROM inserted_user), 'height', 182);

INSERT INTO properties (user_id, key, value) VALUES ((SELECT id FROM user), 'weight', 94);
INSERT INTO properties (user_id, key, value) VALUES ((SELECT id FROM user), 'hair', "brown");
INSERT INTO employees (user_id, employer_id, role) VALUES ((SELECT id FROM user), (SELECT id FROM employer) 'programmer');
INSERT INTO pets (user_id, name, type, dob) VALUES ((SELECT id FROM user), 'Samson', 'dog', '2007-08-14');
INSERT INTO pets (user_id, name, type, dob) VALUES ((SELECT id FROM user), 'Breeze', 'fish', '2015-06-14');

SELECT
	*
FROM users
	LEFT JOIN properties ON users.id = properties.user_id
	LEFT JOIN employees ON users.id = employees.user_id
	LEFT JOIN employers ON employees.employer_id = employers.id
	LEFT JOIN pets ON pets.id = employees.user_id;
```
