// models/RenewalCase.js

import mongoose from 'mongoose';

const Schema = mongoose.Schema;

// Define the schema
const RenewalCaseMotorSchema = new Schema({
  customerName: String,
  policyNumber: String,
  addOns: String,
  remarks: String,
});

// Create a model
const RenewalCaseMotor = mongoose.model('RenewalCaseMotor', RenewalCaseMotorSchema);

export default RenewalCaseMotor;
