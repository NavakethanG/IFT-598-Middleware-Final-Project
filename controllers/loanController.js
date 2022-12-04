const Loan = require('./../models/loanModel');
const APIFeatures = require('./../dataBaseManager/loanDbContext');

exports.getAllloans =   async (req, res) => {
  try {
    // EXECUTE QUERY
    const features = new APIFeatures(Loan.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const loans = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: loans.length,
      data: {
        loans
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

exports.getloan = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);
    // Course.findOne({ _id: req.params.id })

    res.status(200).json({
      status: 'success',
      data: {
        loan
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

exports.createLoan = async  (req, res) => {
  try {
    const {customerName, phoneNumber, address, amountPerMonth, interest, loanTermYears, loanType, description} = req.body;
    const newLoan = await Loan.create({
      customerName,
      phoneNumber,
      address,
      amountPerMonth,
      interest,
      loanTermYears,
      loanType,
      description
    });
    const loans = await Loan.find();
    var authorized = true;
    res.status(200).render('allloans',{
      loans: loans,
      authorized: authorized
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    });
  }
};

exports.updateLoan = async (req, res) => {
  try {
    const loan = await Loan.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      status: 'success',
      data: {
        loan
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

exports.updateLoanCollection = async (req, res) => {
  try {
    const loan = await Loan.findOneAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      status: 'success',
      data: {
        loan
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

exports.deleteLoan = async (req, res) => {
  try {
    await Loan.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};