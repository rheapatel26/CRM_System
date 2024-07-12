// models/HealthInsurance.js
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const LifeInsuranceSchema = new Schema({
    customerName: String,
    dob: Date,
    age: Number,
    gender: String,
    smoker: String,
    education: String,
    employment: String,
    annualIncome: String,
    planType: String,
    planDetails: {
        term: {
            typeOfPlan: String,
            companyPreference: String,
            productName: String,
            sumInsured: String,
            existingSI: String,
            coverTillAge: String,
            policyTerm: Number,
            premiumPayingTerm: Number,
            riders: String,
            remarks: String,
            uploadDocument: String
        },
        traditional: {
            premium: String,
            companyPreference: String,
            productName: String,
            premiumPayingTerm: Number,
            policyTerm: Number,
            payoutType: String,
            payoutTerm: Number,
            riders: String,
            remarks: String
        },
        ulip: {
            premium: String,
            companyPreference: String,
            productName: String,
            fundSelection: String,
            premiumPayingTerm: Number,
            policyTerm: Number,
            riders: String,
            remarks: String,
            uploadDocument: String
        }
    }
});

const LifeInsurance = mongoose.model('LifeInsurance', LifeInsuranceSchema);

export default LifeInsurance;
