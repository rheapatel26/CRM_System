import mongoose from 'mongoose';

const RolloverCaseSchema = new mongoose.Schema({
  customerName: String,
  email: String,
  contactNo: String,
  pincode: String,
  policyCopy: {
    filename: String,
    path: String,
  },
  rcCopy: {
    filename: String,
    path: String,
  },
  claimConfirmation: String,
  registrationNumber: String,
  expiryDate: Date,
  makeModel: String,
  variant: String,
  addOns: String,
  companyPreference: String,
  remarks: String,
});

const RolloverCase = mongoose.model('RolloverCase', RolloverCaseSchema);

export default RolloverCase;
