const express = require('express');
const compression = require('compression');
const logger = require('morgan');
const chalk = require('chalk');
const errorHandler = require('errorhandler');
const lusca = require('lusca');
const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');
const expressStatusMonitor = require('express-status-monitor');

const pixelController = require('./controllers/pixel');

const app = express();
const server = require('http').Server(app);

if (app.get('env') === 'development') {
    dotenv.load({ path: '.env.dev' });
} else {
    dotenv.load({ path: '.env.prod' });
}

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGOLAB_URI);
mongoose.connection.on('error', (err) => {
    console.error(err);
    console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
    process.exit();
});

app.use(expressStatusMonitor());
app.use(compression());
app.use(logger('dev'));

app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));

app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

app.get('/pixel', pixelController.setEmailPixel);

app.get('/test', function (req, res) {
  res.sendFile(path.join(__dirname, 'public/test/email/index.html'));
});

app.use(errorHandler());

const SERVER_PORT = 5000;
server.listen(process.env.PORT || SERVER_PORT, () => {
    console.log('Express server listening on port %d in %s mode.', SERVER_PORT, app.get('env'));
});
