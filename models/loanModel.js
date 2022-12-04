
const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  customerName: {
    type: String,
        required: [true, 'A customer must have a name'],
        unique: true,
        trim: true,
        maxlength: [40, 'A customer name must have less or equal then 40 characters'],
        minlength: [5, 'A customer name must have more or equal then 5 characters']
  },
  phoneNumber: {
    type: String,
    trim: true
  },
  address: {
      type: String,
      trim: true
  },
  amountPerMonth: {
      type: Number,
      trim: true
  },
  interest: {
      type: Number,
      trim: true
  },
  loanTermYears: {
    type: Number,
    trim: true
  },
  loanType: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  createdDate: {
      type: Date,
      default: new Date()
  },
  modifiedDate: {
    type: Date,
    default: new Date()
  },
  isDeleted: {
      type: Boolean,
      default: false
  }
});


const Loan = mongoose.model('Loan', loanSchema);

module.exports = Loan;
