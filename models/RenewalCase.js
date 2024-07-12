import mongoose from 'mongoose';

const Schema = mongoose.Schema;

// Define the schema without validation
const RenewalFormSchema = new Schema({
    customerName: String,
    policyNumber: String,
    companyPreference: String,
    sumInsured: Number,
    premiumSlab: String,
    addOns: [String],
    remarks: String,
    file: {
        filename: String,
        path: String
      },
});

// Create a model based on the schema
const RenewalForm = mongoose.model('RenewalForm', RenewalFormSchema);

export default RenewalForm;
