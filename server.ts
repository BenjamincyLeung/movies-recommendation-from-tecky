import express from "express";
import expressSession from "express-session";
import http from "http";
import { Server as SocketIO } from "socket.io";
import path from "path";
import grant from 'grant';
import { Client } from "pg";
import multer from "multer";
import dotenv from "dotenv";
import Knex, { Knex as knexType } from "knex";
import * as knexConfigs from "./knexfile";

dotenv.config();

export const client = new Client({
  database: process.env.DB_NAME,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
});
client.connect();
//for google login
const grantExpress = grant.express({
  "defaults": {
    "origin": "http://localhost:8080",
    "transport": "session",
    "state": true,
  },
  "google": {
    "key": process.env.GOOGLE_CLIENT_ID || "",
    "secret": process.env.GOOGLE_CLIENT_SECRET || "",
    "scope": ["profile", "email"],
    "callback": "/api/user/login/google"
  }
});


// Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve("./uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}.${file.mimetype.split("/")[1]}`);
  },
});

export const upload = multer({ storage });

const knex = Knex(knexConfigs[process.env.NODE_ENV || "development"]) as knexType;



import { isLoggedIn } from "./utils/guards";
import { UserController } from "./controllers/userController";
import { UserService } from "./services/userService";
import { MovieDetailService } from "./services/moviedetailService";
import { MovieDetailController } from "./controllers/moviedetailController";


const app = express();
const server = new http.Server(app);
const io = new SocketIO(server); 4
io.on("connection", function (socket) {
  console.log(`Socket: ${socket.id} is connected`);
});
// app.use(cookieParser());5
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const sessionMiddleware = expressSession({
  secret: "Tecky Academy teaches typescript",
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false },
});

app.use(sessionMiddleware);



//app.use(cookieParser());
app.use(grantExpress as express.RequestHandler);
const movieDetailService = new MovieDetailService(knex);
export const userService = new UserService(knex);
export const movieDetailController = new MovieDetailController(movieDetailService);
export const userController = new UserController(userService);

import { FlaskRecommendationService } from "./services/flaskRecommendationService";
import { FlaskRecommendationController } from "./controllers/flaskRecommendationController";

const flaskRecommendationService = new FlaskRecommendationService('http://localhost:5000/');
export const flaskRecommendationController = new FlaskRecommendationController(flaskRecommendationService);
import { routes } from "./routes";
app.use("/api", routes);




app.get('/logout', (req, res) => {
  console.log("logout---")
  res.clearCookie('session-token');
  res.redirect('/index')

})


app.use(express.static(path.join(__dirname, "public")));
app.use(isLoggedIn, express.static(path.join(__dirname, "protected")));

app.use((req, res) => {
  res.sendFile(path.resolve("./public/404.html"));
});

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}/`);
});






