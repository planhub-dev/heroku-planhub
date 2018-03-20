const path = require('path');
const UserEmail = require('../models/UserEmail');

exports.setEmailPixel = (req, res) => {
    const resFileSrc = path.join(__dirname, '../public/static/pixel.png');
    const ip = req.header('x-forwarded-for') || req.connection.remoteAddress || 'N/A';
    const value = req.headers['user-agent'] || 'N/A';
    const category = req.query.category || 'N/A';
    const data = req.query.data || 'N/A';
    const email = req.query.id || 'N/A';
    const time = Date.now();
    const pixel = { category, time, value, ip, data };
    const user = new UserEmail({
        email,
        data: {
            pixels: [ pixel ],
        }
    });

    UserEmail.findOne({ email }, (err, existingUser) => {
        if (err) { return res.sendFile(resFileSrc); }
        if (existingUser) {  //  TODO Add user-agent to that user may be point to another function
            const pixels = existingUser.data.pixels;
            pixels.push(pixel);
            existingUser.data.set({ pixels });
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
};
