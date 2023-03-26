## Running project for the first time

> Requirements: Node.js, Postgres


1. `npm install`
2. Update `DATABASE_URL` in `.env` file with credentials to your local **empty** DB in Postgres. Format: `postgresql://user:password@localhost:port/db_name?schema=public` 
3. Run `npx prisma migrate dev --name init`
4. Check if the migration was sucessful (Your local DB should have some tables now) 
5. Run `npx prisma db seed` to fill new generated tables with sample data
6. Run server by `npm run dev`
7. Check if server is running

