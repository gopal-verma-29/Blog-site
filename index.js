require('dotenv').config();

const express = require('express')
const expressLayout = require('express-ejs-layouts');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');
const session = require('express-session');

const app = express()
const port = 5000 || process.env.PORT;

//connect to db
const connectDB = require('./server/config/db.js')
const { isActiveRoute } = require('./server/helpers/routeHelpers.js')

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI
  })

}));

app.use(express.static('public'))


//Template engine
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

app.locals.isActiveRoute = isActiveRoute;

const mainRoutes = require('./server/routes/mainroutes');
const adminRoutes = require('./server/routes/adminroutes');
app.use('/', mainRoutes);
app.use('/', adminRoutes);


app.listen(port, () => {
  console.log(`App listening on port ${port}`)
});