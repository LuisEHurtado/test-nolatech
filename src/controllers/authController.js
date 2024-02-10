const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('../services/database');
const helpers = require('./helpers');


/* LOGIN */
passport.use('local.signin', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, username, password, done) => {
  let query = await pool.query('SELECT * FROM users WHERE username = ? OR email = ?', [username,username]);
  if (query.length > 0) {
    const user = query[0];
    const validPassword = await helpers.comparePassword(password, user.password)
    if (validPassword) {
      done(null, user, req.flash('success', 'Bienvenido ' + user.username));
    } else {
      done(null, false, req.flash('message', 'Contraseña inocrrecta'));
    }
  } else {
    return done(null, false, req.flash('message', 'El usuario no existe.'));
  }
}));


/* REGISTRO DE USUARIO */
passport.use('local.signup', new LocalStrategy({
  username_field: 'username',
  password_field: 'password',
  passReqToCallback: true
}, async (req, username, password, done) => {
  const  user  = req.body;
  let newUser = {
    first_name:user.firstName,
    last_name:user.lastName,
    email:user.email,
    username,
    password
  };

  let rows = await pool.query('SELECT * FROM users WHERE username = ? OR email = ?', [username,user.email]);
  if (rows.length > 0) {
      done(null, false, req.flash('message', 'Ese usuario ya ha sido registrado, por favor intente con otro'));
  } else{
    newUser.password = await helpers.encryptPassword(password);
    const result = await pool.query('INSERT INTO users SET ? ', newUser);
    newUser.id = result.insertId;
    return done(null, newUser,);

  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const rows = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
  done(null, rows[0]);
});