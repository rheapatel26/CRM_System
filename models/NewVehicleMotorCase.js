import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const NewVehicleCaseSchema = new Schema({
  customerName: String,
  email: String,
  contactNo: String,
  pincode: String,
  // Fields for "With Invoice Copy"
  invoiceCopy: String,
  cc: String,
  fuelType: String,
  sittingCapacity: String,
  rtoLocation: String,
  variant: String,
  addOns: String,
  companyPreference: String,
  // Fields for "Without Invoice Copy"
  companyName: String,
  modelNo: String,
  variantWithoutInvoice: String,
  exShowroomPrice: String,
  ccWithoutInvoice: String,
  fuelTypeWithoutInvoice: String,
  sittingCapacityWithoutInvoice: String,
  rtoLocationWithoutInvoice: String,
  addOnsWithoutInvoice: String,
  companyPreferenceWithoutInvoice: String
});

const NewVehicleCase = mongoose.model('NewVehicleCase', NewVehicleCaseSchema);

export default NewVehicleCase;
