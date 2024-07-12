// models/HealthInsurance.js
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const HealthInsuranceSchema = new Schema({
  customerName: String,
  dob: Date,
  age: Number,
  ped: String,
  city: String,
  state: String,
  pincode: String,
  zone: String,
  companyPreference: String,
  sumInsured: Number,
  expectedPremium: Number,
  addOns: [String],
  remarks: String,
  file: {
    filename: String,
    path: String
  },
  familyMembers: [{
    name: String,
    dob: Date,
    age: Number,
    ped: String
  }]
});



const HealthInsurance = mongoose.model('HealthInsurance', HealthInsuranceSchema);

export default HealthInsurance;
