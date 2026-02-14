# Restaurant API

## create-database 
>Run Database Creation and db seeding (optionnal with --help/-h)

**OPTIONS**
* seed
  * flags: -s --seed
  * desc : seed the database after creation

```bash
SHOULD_SEED=$seed node database/database_creator.js
```

## launch-server
>Launch the server

```bash
node api/server.js
```