const express = require('express');
const morgan = require('morgan');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const { database } = require('./configs/db.config');

const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

// Intializations
const app = express();
require('./controllers/authController');

// Settings
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));




app.engine('.hbs', exphbs.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs'
  }))
  app.set('view engine', '.hbs');


// Middlewares
app.use(morgan('dev'));
app.use(passport.initialize());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(flash());

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  store: new MySQLStore(database)
}));
app.use(passport.initialize());
app.use(passport.session());

// VARIABLES GLOBALES
app.use((req, res, next) => {
  app.locals.message = req.flash('message');
  app.locals.success = req.flash('success');
  app.locals.user = req.user;
  next();
});


// RUTAS
app.use(require('./routes'));
app.use(require('./routes/auth'));
app.use(require('./routes/user'));

// Public
app.use(express.static(path.join(__dirname, 'public')));

app.listen(app.get('port'), () => {
    console.log('Servidor ejecutandose en el puerto', app.get('port'));
});