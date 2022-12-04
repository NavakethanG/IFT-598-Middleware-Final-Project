const express = require('express');
const authController = require('../controllers/authController');
const loanController = require('../controllers/loanController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router
  .route('/')
  .get(authController.protect,loanController.getAllloans)
  .post(authController.protect,loanController.createLoan);

router
  .route('/:id')
  .get(authController.protect,loanController.getloan)
  .put(authController.protect,loanController.updateLoanCollection)
  .patch(authController.protect,loanController.updateLoan)
  .delete(authController.protect,loanController.deleteLoan);

module.exports = router;
