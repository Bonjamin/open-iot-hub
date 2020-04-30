require('dotenv').config();

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '10mb'}));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

const mongoose = require('mongoose');
let mongooseUrl = 'mongodb://'
if (process.env.IOT_MONGO_USER && process.env.IOT_MONGO_PASSWORD) {
  mongooseUrl += `${process.env.IOT_MONGO_USER}:${process.env.IOT_MONGO_PASSWORD}@`;
}
mongooseUrl += process.env.IOT_MONGO_HOST || 'localhost'
if (process.env.IOT_MONGO_PORT) {
  mongooseUrl += `:${process.env.IOT_MONGO_PORT}`
}
mongooseUrl += '/iot'
mongoose.connect(mongooseUrl, { useNewUrlParser: true, useUnifiedTopology: true });

const session = require('express-session');
const redis = require('redis');
const redisClient = redis.createClient({
  host: process.env.IOT_REDIS_HOST || '127.0.0.1',
  port: process.env.IOT_REDIS_PORT || 6379
});
redisClient.unref();
redisClient.on('error', console.log);
const RedisStore = require('connect-redis')(session);
const maxAge = 1000 * 60 * 60 * 24 * 30;
app.use(session({
  secret: process.env.IOT_REDIS_SECRET || 'TODO:SET_REDIS_SECRET',
  resave: true,
  saveUninitialized: true,
  store: new RedisStore({client: redisClient}),
  cookie: {
    path: '/',
    httpOnly: true,
    maxAge: maxAge
  }
}))

app.use('/statics', express.static('public'))

app.set('views', __dirname + '/app/views')
app.set("view engine", "ejs")

const routes = require('./config/routes');
app.use('/', routes);

app.listen(3000, () => console.log('Example app listening on port 3000!'));