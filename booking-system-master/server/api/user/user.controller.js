'use strict';

var User = require('./user.model');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');
var _ = require('lodash');

var gmTransport = nodemailer.createTransport({
    service: 'Mailgun',
    auth: {
        user: 'postmaster@sandbox2827225757434d61a0130a62c314f486.mailgun.org',
        pass: 'ce8fe2fda9b614ae868cccb634fd1708'
    }
});


var validationError = function (res, err) {
    return res.json(422, err);
};

/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function (req, res) {
    User.find({}, '-salt -hashedPassword', function (err, users) {
        if (err) return res.send(500, err);
        res.json(200, users);
    });
};

/**
 * Creates a new user
 */
exports.create = function (req, res, next) {
    var newUser = new User(req.body);
    newUser.provider = 'local';
    newUser.role = 'user';
    newUser.validated = false;
    newUser.save(function (err, user) {
        if (err) return validationError(res, err);
        var token = jwt.sign({_id: user._id}, config.secrets.session, {expiresInMinutes: 60 * 5});

        var emailAuthIdLink = "http://" + req.headers.host + "/validate/" + user._id;


        var mailOptions = {
            from: 'Device Booking System <ux@hof.co.uk>', // sender address
            to: user.email,
            subject: 'Booking System - Account Validation',
            html: "Dear User, <br><br> To confirm that this is your correct account, Please click on the link below to validate your account <br />" + "<a>" + emailAuthIdLink + "</a>" + "<br><br>" + "If this isn't correct, do not click the link and ignore this email. <br><br> Thank You <br><br> Booking System Team",
            test: "Please click on the link  to validate your account - " + emailAuthIdLink
        };

        console.log(token);
        console.log(token);


        gmTransport.sendMail(mailOptions, function (error, response) {
            if (error) {
                console.log(error);
            } else {
                console.log('Message sent: ' + response.message);
            }
        });

        res.json({token: token});
    });
};

/**
 * Get a single user
 */
exports.show = function (req, res, next) {
    var userId = req.params.id;
    User.findById(userId, function (err, user) {
        if (err) return next(err);
        if (!user) return res.send(404);
        res.json(user.profile);
    });
};

/**
 * Get a single user
 */
exports.find = function (req, res, next) {
    var email = req.params.email;
    User.findOne({email: email}, function (err, user) {
        if (err) return next(err);
        if (!user) return res.send(404);
        res.json(user.profile);
    });
};

/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function (req, res) {
    User.findByIdAndRemove(req.params.id, function (err, user) {
        if (err) return res.send(500, err);
        return res.send(204);
    });
};

/**
 * Change a users password
 */
exports.changePassword = function (req, res, next) {
    var userId = req.params.id;
    var oldPass = String(req.body.oldPassword);
    var newPass = String(req.body.newPassword);


    User.findById(userId, function (err, user) {
        if (user.authenticate(oldPass)) {
            user.password = newPass;
            user.save(function (err) {
                if (err) return validationError(res, err);
                res.send(200);
            });
        } else {
            res.send(403);
        }
    });
};


// Updates an existing thing in the DB.
exports.update = function (req, res) {
    if (req.body._id) {
        delete req.body._id;
    }
    User.findById(req.params.id, function (err, user) {
        if (err) {
            return validationError(res, err);
        }
        if (!user) {
            return res.send(404);
        }
        var updated = _.merge(user, req.body);
        updated.save(function (err) {
            if (err) {
                return validationError(res, err);
            }
            return res.json(200, user);
        });
    });
};


/**
 * Validate User
 */
exports.validate = function (req, res, next) {
    var userId = req.user._id;

    User.findById(userId, function (err, user) {
        user.validate = true;
        user.save(function (err) {
            if (err) return validationError(res, err);
            res.send(200);
        });
    });
};

/**
 * Get my info
 */
exports.me = function (req, res, next) {
    var userId = req.user._id;

    User.findOne({
        _id: userId
    }, '-salt -hashedPassword', function (err, user) { // don't ever give out the password or salt
        if (err) return next(err);
        if (!user) return res.json(401);
        res.json(user);
    });
};

/**
 * Authentication callback
 */
exports.authCallback = function (req, res, next) {
    res.redirect('/');
};


