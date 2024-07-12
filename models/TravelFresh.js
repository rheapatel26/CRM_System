import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const familyMemberSchema = new mongoose.Schema({
    familyMemberName: String,
    familyMemberAge: String,
    familyMemberDOB: Date,
    familyMemberPED: String
});

const TravelInsuranceSchema = new Schema({
  customerName: String,
  dob: Date,
  age: Number,
  ped: String,
  ticket: {
    filename: String,
    path: String
  },
  passport: {
    filename: String,
    path: String
  },
  visa: {
    filename: String,
    path: String
  },
  destination: String,
  travelFrom: Date,
  travelTo: Date,
  travelDays: Number,
  addOns: [String],
  remarks: String,
  familyMembers: [familyMemberSchema]
});

const TravelInsurance = mongoose.model('TravelInsurance', TravelInsuranceSchema);

export default TravelInsurance;
