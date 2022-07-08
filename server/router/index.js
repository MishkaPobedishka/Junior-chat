const Router = require('express').Router;
const authController = require('../controllers/authController')
const chatController = require('../controllers/chatController')
const router = new Router();
const {body} = require('express-validator')
const authMiddleware = require('../middlewares/auth');

router.post('/registration',
    body('first_name').isLength({min: 1}),
    body('last_name').isLength({min: 1}),
    body('email').isEmail(),
    body('password').isLength({min: 3}),
    authController.registration);
router.post('/login',
    body('email').isEmail(),
    body('password').isLength({min: 3}),
    authController.login);
router.post('/logout', authController.logout);
router.get('/refresh', authController.refresh);
router.post('/dialogs', authMiddleware, chatController.addDialog);
router.get('/dialogs/:userId', authMiddleware, chatController.getDialogs);
router.post('/messages', authMiddleware, chatController.sendMessage);
router.get('/messages/:dialogId', authMiddleware, chatController.getMessages);
router.patch('/messages/', chatController.setMessagesReaded);

module.exports = router