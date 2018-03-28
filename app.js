const express = require('express');
const logger = require('morgan');
const path = require('path');
const lusca = require('lusca');
const chalk = require('chalk');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const compression = require('compression');
const errorHandler = require('errorhandler');
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

app.use(lusca.xssProtection(true));

app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

app.use(errorHandler());

app.get('/pixel', pixelController.setEmailPixel);

app.get('/server/test', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/test/email/index.html'));
});

app.get('/server/errors', (req, res) => {
    res.send(errorLogs);
});


let errorLogs = [];
process.on('uncaughtException', (er) => {
    if (errorLogs.length == 2000) {
        process.exit(1);
        errorLogs.push({er, stack: er.stack});
    }
});

const SERVER_PORT = 5000;
server.listen(process.env.PORT || SERVER_PORT, () => {
    console.log('Express server listening on port %d in %s mode.', SERVER_PORT, app.get('env'));
});
