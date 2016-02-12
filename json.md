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
```
CREATE INDEX people_hair_index ON people USING GIN ((properties -> 'hair'));
```

**mongodb**
```
db.people.ensureIndex({hair: 1});
```

# JSON Document Database versus Postgres
Postgres can handle relational data or JSON data.  MongoDB / CouchDB can only handle JSON data.  Scaling relational data in a  NoSQL database ends in a bad time.

**With JSON data, the complexity is in the document and the application**:

```
{
  user: Chris Winslet
  properties: {
		height: 82,
		weight: 94,
		hair: brown
  },
	employer: {
		name: Compose,
		role: Programmer
	},
	pets: [
		{
			type: dog,
			name: Samson,
			dob: 8/1/2007
		},
		{
			type: fish,
			name: Breeze,
			dob: 6/14/2015
		}
	]
}
```

**With postgres, the complexity is in the defined schema and the query:
```
SELECT
	*
FROM users
	LEFT JOIN properties ON users.id = properties.user_id
	LEFT JOIN employee ON users.id = employee.user_id
		LEFT JOIN employer ON employee.employer_id = employers.id
	LEFT JOIN pets ON pets.id = employee.user_id
```
