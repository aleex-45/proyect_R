const uuid = require('uuid');
const crypto = require('../tools/crypto.js');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const { to } = require('../tools/to');

const UserModel = mongoose.model('UserModel',
    {
        userName: String,
        email: String,
        password: String,
        userId: String,
        confirmed: Boolean
    });

const cleanUpUsers = () => {
    return new Promise(async (resolve, reject) => {
        await UserModel.deleteMany({}).exec();
        resolve();
    })
}

const registerUser = (userName, email, password) => {
    return new Promise(async (resolve, reject) => {
        let hashedPwd = crypto.hashPasswordSync(password);
        // Guardar en la base de datos nuestro usuario
        let userId = uuid.v4();
        let newUser = new UserModel({
            userId: userId,
            userName: userName,
            email: email,
            password: hashedPwd,
            confirmed: false
        });
        await newUser.save();
        resolve();
    });
}

const getUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        let [err, result] = await to(UserModel.findOne({ userId: userId }).exec());
        if (err) {
            return reject(err);
        }
        resolve(result);
    });
}

const getUserIdFromUserName = (userName) => {
    return new Promise(async (resolve, reject) => {
        let [err, result] = await to(UserModel.findOne({ userName: userName }).exec());
        if (err) {
            return reject(err);
        }
        resolve(result);
    });
}

const checkUserCredentials = (userName, password) => {
    return new Promise(async (resolve, reject) => {
        let [err, user] = await to(getUserIdFromUserName(userName));
        if (!err || user) {
            crypto.comparePassword(password, user.password, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        } else {
            reject(err);
        }
    });
}

const sendEmailToUser = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'pruebas.alex.programacion@gmail.com',
                pass: 'pruebasAlex'
            }
        });

        var mailOptions = {
            from: 'pruebas.alex.programacion@gmail.com',
            to: userEmail,
            subject: 'Bienvenido a ...',
            text: 'Se ha registrado correctamente, para activar su cuenta pulse el siguiente link:'
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                reject(error);
            } else {
                console.log('Email sent: ' + info.response);
                resolve();
            }
        });
    })
}

exports.registerUser = registerUser;
exports.checkUserCredentials = checkUserCredentials;
exports.getUserIdFromUserName = getUserIdFromUserName;
exports.getUser = getUser;
exports.cleanUpUsers = cleanUpUsers;
exports.sendEmailToUser = sendEmailToUser;