const Router = require('express').Router;
const authController = require('../controllers/authController')
const router = new Router();
const {body} = require('express-validator')
const authMiddleware = require('../middlewares/auth');

router.post('/registration',
    body('first_name').isLength({min: 1}),
    body('last_name').isLength({min: 1}),
    body('email').isEmail(),
    body('password').isLength({min: 3}),
    authController.registartion);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/refresh', authController.refresh);
router.get('/chats', authMiddleware, authController.getChats);

module.exports = router