import mongoose from 'mongoose';

const { Schema } = mongoose;

// Define the schema
const portCaseSchema = new Schema({
  customerName: String,
  dob: Date,
  age: Number,
  ped: String,
  city: String,
  state: String,
  pincode: String,
  zone: String,
  claim: String,
  portClaimFileUpload: {
    filename: String,
    path: String,
  },
  portPreviousPolicyUpload: {
    filename: String,
    path: String,
  },
  companyPreference: String,
  sumInsured: Number,
  premiumSlab: String,
  addOns: [String],
  remarks: String,
  portAdditionalDocument: {
    filename: String,
    path: String,
  },
});

// Create a model based on the schema
const PortCase = mongoose.model('PortCase', portCaseSchema);

export default PortCase;
