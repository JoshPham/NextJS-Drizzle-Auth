# NextJS-Drizzle-Auth

To get started, make sure you have a PostgreSQL server running 
under the env variable DATABASE_URL. It should be in the form:

```
postgres://username:password@host:port/database
```

Also, obviously run:
```
npm i
```

If that doesn't work, run:
```
npm i --legacy-peer-deps
```

Finally, make sure the database is updated with the migrations by running:
```
npx drizzle-kit push
```
