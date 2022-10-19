const express = require('express')
const {create} = require('express-handlebars')
const path = require('path')
const session = require('express-session')
const MySQLStore = require('express-mysql-session')(session)
const { database } = require('./keys')
const passport = require('passport')
const validator = require('express-validator')
const bodyParser = require('body-parser')
const flash = require('connect-flash')
const app = express()
require('./lib/passport');


// Settings
app.set('port', process.env.PORT || 4000);
app.set("views", path.join(__dirname, "views"));
const exphbs = create({
  extname: '.hbs',
  layoutsDir: path.join(app.get("views"), "layouts"),
  partialsDir: path.join(app.get("views"), "partials"),
  helpers: require('./lib/handlebars'),
  defaultLayout:'main'
});
app.engine(".hbs", exphbs.engine);
app.set("view engine", ".hbs");

// Midlewars
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(session({
    secret: 'myaplicationweb',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
  }));
app.use(passport.initialize());
app.use(passport.session());
app.use(validator());
app.use(flash());

//seteamos la carpeta public para archivos estáticos
app.use(express.static(path.join(__dirname, '/public/')));

//para procesar datos enviados desde forms
app.use(express.urlencoded({extended:true}))
app.use(express.json())

// Global variables
app.use((req, res, next) => {
  app.locals.message = req.flash('message');
  app.locals.success = req.flash('success');
  app.locals.user = req.user;
  next();
});

//llamar al router
app.use(require('./routes/index'))
app.use(require('./routes/authentication'))
app.use(require('./routes/panel'));
app.use(require('./routes/armeria'));
app.use(require('./routes/editar_informacion'));
app.use(require('./routes/agentes'));

//Para eliminar la cache 
app.use(function(req, res, next) {
    if (!req.user)
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    next();
});


app.listen(app.get('port'), () => {
    console.log('Server is in port', app.get('port'));
  });