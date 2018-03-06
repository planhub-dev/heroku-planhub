const path = require('path');
const User = require('../models/User');

exports.setEmail = (req, res) => {
    //  TODO Validation required
    const resFileSrc = path.join(__dirname, '../public/static/email-logo.png');
    const time = Date.now();
    const email = req.query.email;
    const value = req.headers['user-agent'];

    if (email && value) {
        const user = new User({
            email,
            userAgents: [{ time, value }],
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
