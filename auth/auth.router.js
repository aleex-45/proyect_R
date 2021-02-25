const express = require('express');
const router = express.Router();
const authHttpHandler = require('./auth.http');

router.route('/login')
    .post(authHttpHandler.loginUser);

router.route('/register')
    .post(authHttpHandler.registerUser);

router.route('/register/activation/:userId')
    .get(authHttpHandler.activeAcount);

router.route('/')
    .get(authHttpHandler.getAllUsers);

exports.router = router;

