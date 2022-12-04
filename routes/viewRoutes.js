const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/', viewsController.getLoginForm);
router.get('/login', viewsController.getLoginForm);
router.get('/signup', viewsController.getSignInForm);
router.get('/logout', authController.logout);
router.get('/allloans',authController.protect, viewsController.getAllLoans);
router.get('/overview',authController.protect, viewsController.getDashboard);

module.exports = router;
