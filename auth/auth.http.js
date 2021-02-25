const usersController = require('./user.controller');
const jwt = require('jsonwebtoken');
const {to} = require('../tools/to');

const loginUser = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({message: 'Missing data'});
    } else if (!req.body.user || !req.body.password) {
        return res.status(400).json({message: 'Missing data'});
    }
    // Comprobamos credenciales
    let [err, resp] = await to(usersController.checkUserCredentials(req.body.user, req.body.password));
    // Si no son validas, error
    if (err || !resp) {
        return res.status(401).json({message: 'Invalid credentials'});
    }
    // Si son validas, generamos un JWT y lo devolvemos
    let user = await usersController.getUserIdFromUserName(req.body.user);
    const token = jwt.sign({userId: user.userId}, 'secretPassword');
    res.status(200).json(
        {token: token}
    )
}

const registerUser = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({message: 'Missing data'});
    } else if (!req.body.user || !req.body.password || !req.body.email) {
        return res.status(400).json({message: 'Missing data'});
    }

    let [errReg, respReg] = await to(usersController.registerUser(req.body.user, req.body.email, req.body.password));

    if(errReg) {
        return res.status(500).json({message: 'Server error'});
    }

    let [errEmail, respEmail] = await to(usersController.sendEmailToUser(req.body.email, respReg));

    if(errEmail) {
        return res.status(500).json({message: 'Server error'});
    }

    res.status(200).json(
        {message: 'Succesful register'}
    )
}

const activeAcount = async (req, res) => {
    if (!req.params) {
        return res.status(400).json({message: 'Missing data'});
    }

    let [errActive, resActive] = await to(usersController.activeUserAcount(req.params.userId));

    if(errActive) {
        return res.status(500).json({message: 'Server error'});
    }

    res.status(200).json(
        {message: 'Succesful activation'}
    )
}

exports.loginUser = loginUser;
exports.registerUser = registerUser;
exports.activeAcount = activeAcount;