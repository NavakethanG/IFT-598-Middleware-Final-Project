const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const AppError = require('./../utilities/appError');
const bcrypt = require('bcryptjs');
const promisify = require('util.promisify');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createSendToken = (user, statusCode, res, url) => {
  const token = signToken(user._id);
  const userName = user.name;
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    'withCredentials':true
  };
  if (process.env.NODE_ENV === 'production') {
    cookieOptions.secure = true;
  }
  
  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  //If the user logged-in then render the overview page
  if(res.statusCode == 200 && !url.includes("signup")) {
    var authorized = true
    res.status(200).render('overview', {
      title: `Over View`,
      token,
      userName,
      authorized: authorized
    });
  }
  else{
    //Once the user is signed-up render the login page with a success message.
    res.status(200).render('login', {
      success: `You have successfully signed up. Please login to continue.`
    });
    return;
  }
};

exports.signup = async (req, res, next) => {
  const {name, email, password, passwordConfirm} = req.body;
  if (!name || !email || !password || !passwordConfirm) {
    return res.status(400).render('signup', {
      error: `Please provide the required information!`
    });
  }
  if (password != passwordConfirm) {
    return res.status(401).render('signup', {
      error: `Password and confirm password do not match. Please try again!`
    });
  }  
  else
  {
    const newUser = await User.create({
      name,
      email,
      password,
      passwordConfirm
    });
    //success
    createSendToken(newUser, 201, res,req.route.path);
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  // 1) Check if email and password exist
  if (!email || !password) {
    return res.status(400).render('login', {
      error: `Please provide an email address and password!`
    });
  }
  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return res.status(401).render('login', {
      error: `Incorrect email address or password. Please try again!`
    });
  }  
  // 3) If everything ok, send token to client
  createSendToken(user, 200, res, 'login');
};

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).render('login', {
    success: `You are successfully signed out. Please login to continue.`
  });
  return;
};

exports.protect = async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } 
  
  else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token || token == 'loggedout') {
    res.status(401).render('login', {
      error: `You are not logged in! Please log in to continue.`
    });
    return;
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
};

// Only for rendered pages, no errors!
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // 2) Check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      // 3) Check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // THERE IS A LOGGED IN USER
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

