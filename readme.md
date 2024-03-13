# 1. set-up

- Init yarn project
```bash
yarn init -y
```
&nbsp;

- create and configure `.prettierrc`

```text
{
    "trailingComma": "es5",
    "tabWidth": 4,
    "semi": false,
    "singleQuote": true,
    "overrides": [
        {
            "files": ["*.ts", "*.js"],
            "options": {
                "semi": true,
                "tabWidth": 2,
                "singleQuote": false,
                "printWidth": 100
            }
        }
    ]
}

```
&nbsp;

- install ts related packages

```bash
yarn add ts-node @types/node typescript

```

&nbsp;

- create and configure `tsconfig.json`

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "target": "es5",
    "lib": ["es6", "dom"],
    "sourceMap": true,
    "allowJs": true,
    "jsx": "react",
    "esModuleInterop": true,
    "moduleResolution": "node",
    "noImplicitReturns": true,
    "noImplicitThis": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "suppressImplicitAnyIndexErrors": true,
    "noUnusedLocals": true
  },
  "exclude": ["node_modules", "build", "scripts", "index.js"]
}
```

&nbsp;

- create and configure `index.js`

```js
require("ts-node/register");
require("./server");
```

&nbsp;

- create and configure `server.ts`

```ts
console.log("hi");
```

&nbsp;

- configure `package.json - scripts`
```json
  "scripts": {
    "start": "node index.js",
    "dev": "ts-node-dev server.ts",
    "test": "jest",
  },
```

&nbsp;

- configure `.env` and `.env.sample`
```yaml
NODE_ENV=development

DB_NAME=
DB_USERNAME=
DB_PASSWORD=

TESTDB_NAME=
```

&nbsp;

- create and configure `.gitignore`

```text
node_modules
.DS_Store

.env

```

&nbsp;

# 2. express, express-session, multer, .env, pg, socket-io, logger, hash,  set-up

```bash
yarn add express @types/express
yarn add express-session @types/express-session
yarn add multer @types/multer
yarn add pg @types/pg dotenv @types/dotenv
yarn add socket.io
yarn add winston
yarn add bcryptjs @types/bcryptjs
yarn add ts-node-dev
yarn add knex @types/knex pg @types/pg
```

```ts
import express from 'express';
import expressSession from "express-session";
import http from 'http';
import {Server as SocketIO} from 'socket.io';
import path from "path";
import multer from "multer";
import { Client } from "pg";
import dotenv from "dotenv";
dotenv.config();
//....
const app = express();

const sessionMiddleware = expressSession({

    secret: "Tecky Academy teaches typescript",
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false },
});

app.use(sessionMiddleware);
app.use(express.json());

//pg client
export const client = new Client({
    database: process.env.DB_NAME,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
});
client.connect();


// Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve("./uploads"));
    },
    filename: function (req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}.${file.mimetype.split("/")[1]}`);
    }
});

export const upload = multer({ storage });

const server = new http.Server(app);
const io = new SocketIO(server);

io.on("connection", function (socket) {
  console.log(`Socket: ${socket.id} is connected`);
});
//....
const PORT = 8080;
server.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}/`);
});
```

&nbsp;

# 3. knex  set-up

# migration

```bash
yarn knex init -x ts
yarn add knex @types/knex pg @types/pg
```
```ts
yarn knex migrate:make [options] <name>
yarn knex migrate:latest [options]                
yarn knex migrate:up [<name>]                     
yarn knex migrate:rollback [options]              
yarn knex migrate:down [<name>]                   
yarn knex migrate:currentVersion                 
yarn knex migrate:list|migrate:status             
yarn knex migrate:unlock                          
```


# seed

```bash
yarn knex seed:make -x ts create-teachers-and-students
yarn knex seed:run
```

# knex env configuration

```ts
import type { Knex } from "knex";
import dotenv from "dotenv";
dotenv.config();
// Update with your config settings.

const config: { [key: string]: Knex.Config } = {
  development: {
    debug: false, // <-- here
    client: "postgresql",
    connection: {
      database: process.env.DB_NAME,
      user:     process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    }
},

  test: {
    client: 'postgresql',
    connection: {
      database: process.env.TESTDB_NAME,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  staging: {
    client: "postgresql",
    connection: {
      database: "my_db",
      user: "username",
      password: "password"
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    }
  },

  production: {
    client: "postgresql",
    connection: {
      database: "my_db",
      user: "username",
      password: "password"
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    }
  }

};

module.exports = config;
```


&nbsp;

# 4. yarn test set-up

```bash
yarn init -y
yarn add --dev jest
yarn add --dev typescript ts-jest @types/jest @types/node ts-node ts-node-dev
yarn ts-jest config:init
```

&nbsp;

# 5. advanced-memo-wall Folder Structure
```
movie
├── node_modules
├── protected
│   ├── protected
│   │   ├── css
│   │   │   └── home.css
│   │   │   └── watchList.css
│   │   │   └── movieDetail.css
│   │   │   └── genre.css
│   │   │   └── watchRecord.css (optional)
│   │   │   └── Admin.css (optional)
│   │   ├── js
│   │   │   └── home.js
│   │   │   └── watchList.js
│   │   │   └── movieDetail.js
│   │   │   └── genre.js
│   │   │   └── watchRecord.js (optional)
│   │   │   └── Admin.js (optional)
│   │   ├── html
│   │   │   └── home.html
│   │   │   └── watchList.html
│   │   │   └── movieDetail.html
│   │   │   └── genre.html
│   │   │   └── watchRecord.html (optional)
│   │   │   └── Admin.html (optional)
├── public
│   ├── css
│   │   └── index.css
│   │   └── signUp.css
│   │
│   ├── js
│   │   └── index.js
│   │   └── signUp.js
│   │
│   ├── 404.html
│   ├── index.html (sign in + sign up button)
│   ├── signUp.html
│   │
├── utils
│   │   └── guard.ts
│   │   └── hash.ts
│   │   └── model.ts
│   │   └── logger.ts
│   │
├── migration
│   │   └── table-1.0.ts
│   │
├── seed
│   │   └── initData.ts
│   │
├── controllers
│   │   └── movieRouters.ts
│   │   └── movieRouters.test.ts
│   │   └── userRouters.ts
│   │   └── userRouters.test.ts
│   │
├── services
│   │   └── movieRouters.ts
│   │   └── movieRouters.test.ts
│   │   └── userRouters.ts
│   │   └── userRouters.test.ts
│   │
├── routers
│   │   └── movieRouters.ts
│   │   └── userRouters.ts
│   │
├─ .gitignore
├─ .prettierrc
├─ server.ts
├─ index.js
├─ knexfile.ts
├─ playwright.ts
├─ redis.ts
├─ package.json
├─ tsconfig.json
└─ yarn.lock
```

# useful link
1. https://www.w3schools.com/howto/howto_js_fullscreen.asp
(change video full screen)

# psql command
1. each film's category
```sql
SELECT films.film_name, categories.category
FROM film_categories
LEFT JOIN films
ON film_id = films.id
RIGHT JOIN categories
ON category_id = categories.id;
```

|router|method|service|controller|html|comment|
|---|---|---|---|---|---|
|"moveDetailRoutes/movieDetail"|get|(getMovie) select films(id,film_name,image)+films_category(id,category) where fid = ?|(getMovie)->getMovie|movieDetail.html{(home.html -> onclick function + fid) & (genre.html -> onclick function + fid) & (movieDetail.html"you may like..." -> onclick function + fid) & (watchRecord.html -> onclick function + fid)|"/movieDetail/:fid"(selectMovie)->getMovie
|"moveDetailRoutes/getCategoryId"|get|(getCategoryId) select categories(id,category)|(getCategoryId)->getCategoryId|movieDetail.html|use "/categories"(selectCategoryId)->getCategoryId
|"moveDetailRoutes/insertCategoryIdAndUser"|post|(insertCategoryId) insert users(id) categories(id)|(insertCategoryId)->insertCategoryId|movieDetail.html|use "/categories"(insertCategoryId)->postCategoryId
|"categoryMoviesRoutes/"|get|A1: (selectCategoryMovies) select films(id,film_name,image)+films_category(id,category)|(selectCategoryMovies)->getFiveLatestCategoryMovies|home.html|
|"categoryMoviesRoutes/:cid"|get|A2: (selectCategoryMovies) select films(id,film_name,image)+films_category(id,category)|(selectCategoryMovies)->getAllCategoryMovies|home.html & (navbar component onclick function + sid)|
|"WatchRecordRoutes/"|get|(selectCollection) select collections(id,film_name,image)+users(id) where users.id=req.session|(selectCollection)->getCollection|watchRecord.html|
|"WatchRecordRoutes/"|post|(insertCollection) select collections(id,film_name,image)+users(id) where users.id=req.session, films_id = fid|(insertCollection)->postCollection|MovieDetails.html (+ addWatchList button)|
|"WatchRecordRoutes/"|delete|(deleteCollection) delete from collections(id,film_name,image)+users(id) where users.id=req.session|(deleteCollection)->deleteCollection|watchRecord.html|


#new one

|router|method|service|controller|html|comment|
|---|---|---|---|---|---|
|"movie/:fid"|get|(selectMovie) select films(id,film_name,image)+films_category(id,category) where fid = ?|(selectMovie)->getMovie|movieDetail.html{(home.html -> onclick function + fid) & (genre.html -> onclick function + fid) & (watchList.html -> onclick function + fid) & (movieDetail.html"you may like..." -> onclick function + fid)|
|"movie/categories"|get|(selectCategoryId) select categories(id,category)|(selectCategoryId)->getCategoryId|movieDetail.html|
|"movie/categories"|post|(insertCategoryId) insert users(id) categories(id)|(insertCategoryId)->postCategoryId|movieDetail.html|
|"movie/categoryWithMovies"|get|A1: (selectCategoryMovies) select films(id,film_name,image)+films_category(id,category)|(selectCategoryMovies)->getFiveLatestCategoryMovies|home.html|
|"movie/CategoryWithMovies:cid"|get|A2: (selectCategoryMovies) select films(id,film_name,image)+films_category(id,category)|(selectCategoryMovies)->getAllCategoryMovies|home.html & (navbar component onclick function + sid) & genre.html|
|"movie/RatingRoutes/"|post|(insertRating) insert into ratings(id,user_id, film_id, rating) where users.id=req.session, films_id = fid|(insertRating)->postRating|MovieDetails.html|
|"movie/WatchRecordRoutes/"|get|(selectCollection) select collections(id,film_name,image)+users(id) where users.id=req.session|(selectCollection)->getCollection|watchRecord.html|
|"movie/WatchRecordRoutes/"|post|(insertCollection) select collections(id,film_name,image)+users(id) where users.id=req.session, films_id = fid|(insertCollection)->postCollection|MovieDetails.html (+ addWatchList button)|
|"movie/WatchRecordRoutes/"|delete|(deleteCollection) delete from collections(id,film_name,image)+users(id) where users.id=req.session|(deleteCollection)->deleteCollection|watchRecord.html|



