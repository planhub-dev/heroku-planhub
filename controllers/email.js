const path = require('path');
const User = require('../models/User');

exports.getTestPage = (req, res) => {
    //  TODO Validation required
    const resFileSrc = path.join(__dirname, '../public/test/email/index.html');
    return res.sendFile(resFileSrc);
};

exports.setEmail = (req, res) => {
    //  TODO Validation required
    const resFileSrc = path.join(__dirname, '../public/static/email-logo.png');
    const ip = req.header('x-forwarded-for') || req.connection.remoteAddress || 'N/A';
    const category = req.query.category || 'N/A';
    const email = req.query.email || 'N/A';
    const value = req.headers['user-agent'] || 'N/A';
    const time = Date.now();

    if (email && value) {
        const user = new User({
            email,
            userAgents: [{ category, time, value, ip }],
        });
        User.findOne({ email }, (err, existingUser) => {
            if (err) { return res.sendFile(resFileSrc); }
            if (existingUser) {  //  TODO Add user-agent to that user may be point to another function
                const userAgents = existingUser.userAgents;
                userAgents.push({ time, value });
                existingUser.set({ userAgents });
                existingUser.save((err) => {
                    if (err) { return res.sendFile(resFileSrc); }
                    return res.sendFile(resFileSrc);
                });
            } else {
                user.save((err) => {
                    if (err) { return res.sendFile(resFileSrc); }
                    return res.sendFile(resFileSrc);
                });
            }
        });
    } else {
        return res.sendFile(resFileSrc);
    }
};
