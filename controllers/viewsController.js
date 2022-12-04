const Loan = require('../models/loanModel');
const User = require('../models/userModel');

exports.getLandingPAge = async (req, res) => {
  res.status(200).render('overview', {
    title: `Over View`
  
  });
};

exports.getSignInForm = (req, res) => {
  res.status(200).render('signup', {
    title: 'Sign in New User'
  });
};
exports.getLoginForm = (req, res) => {
  var authorized = false;
  res.status(200).render('login', {
    title: 'Log into your account',
    authorized: authorized
  });
};

exports.getLoginUser = (req, res) => {
  const {email, password} = req.body;
  res.status(200).render('login', {
    title: 'Log into your account'
  });
};

exports.getAllLoans = async (req, res) => {
  const loans = await Loan.find();
  var authorized = true;
  res.status(200).render('allloans', {
    loans: loans,
    authorized: authorized
  });
};
exports.getDashboard = async (req, res) => {
  var authorized = true;
  res.status(200).render('overview', {
    title: `Dashboard`,
    userName: req.user.name,
    authorized: authorized
  });
};
